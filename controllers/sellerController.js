const Item = require("../models/Item");
const User = require('../models/User');
const jwt = require('jsonwebtoken');


module.exports.newItem_get=(req, res)=> {
    
    res.render('newitem');

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


//        itemname: req.body.itemname, 
//itemdesc: req.body.itemdesc, 
//quantity: req.body.quantity