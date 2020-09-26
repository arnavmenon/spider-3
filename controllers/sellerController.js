const Item = require("../models/Item");
const User = require('../models/User');
const jwt = require('jsonwebtoken');

function checkSeller(req,res){

    const token = req.cookies.jwt;
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {

          let user = await User.findById(decodedToken.id);
          if(user.usertype!="seller")
            return 0;
          else
            return 1;  
          })
         
        
      }




module.exports.newItem_get=(req, res)=> {

/*     if(checkSeller(req,res)) */
        res.render('newitem');
/*     else    
        res.redirect("/");
 */
};

module.exports.newItem_post=async (req,res)=>{

    const {itemname, itemdesc, price, quantity, userid, url}=req.body;
    const sellerID=userid;

    

    console.log(req.body);

    try{
        const item=await Item.create({itemname, itemdesc, price, quantity, sellerID, url});
        console.log(item);

        var inventoryEntry={productID: item.id, productname:itemname, price:price, quantity:item.quantity, url:url};

        User.findByIdAndUpdate(sellerID, { $push : {inventory: inventoryEntry }})
        .then(result => {
            res.json(item);
          })
          .catch(err => {
            console.log(err);
        });
    }
    catch(err){
        console.log(err);
    }
}

module.exports.getInventory=async(req,res)=>{

    const token = req.cookies.jwt;
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {

            let user = await User.findById(decodedToken.id);
            Item.find({sellerID:user.id},(err,items)=>{
                if(err) return res.status(500).send("Error");
                res.send(items);

            })
           
          
        });
}

module.exports.soldHistory=(req,res)=>{
    res.render('shistory');
  }

module.exports.editProduct=(req,res)=>{
    let itemid=req.params.id;

    Item.findById(itemid,(err,item)=>{
        if(err) return res.status(500).send("Error");
        res.render('editproduct',{item:item});
    })

    
  }

  module.exports.updateProduct=async (req,res)=>{

    const {itemname, itemdesc, price, quantity, itemid, url}=req.body;

    console.log(req.body);

    Item.findByIdAndUpdate(itemid,{itemname:itemname, itemdesc:itemdesc, price: price, quantity: quantity, url: url})
    .then(result=>{
        res.send({itemid});
    })
    .catch(err=>{
        console.log(err);
    })
}

module.exports.getGraph=(req,res)=>{
    res.render('graph');
}

module.exports.showGraph=async (req,res)=>{
    const today=new Date();
    const token = req.cookies.jwt;
    var profitarray=[0,0,0,0,0,0,0];

    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {

        let user = await User.findById(decodedToken.id);
        console.log(user.id);

        user.history.forEach(item=>{
            let itemdate=item.date;
            var one_day = 1000 * 60 * 60 * 24 ;
            var result = Math.round(today.getTime() - itemdate.getTime()) / (one_day);
            var finalresult = result.toFixed(0); 
            console.log(finalresult);
            if(finalresult<=6){

                profitarray[finalresult]+=item.cost;
            }
        })
        console.log(profitarray);

        res.json(profitarray);
    })
           
   
}
