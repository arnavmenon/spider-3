const Item = require("../models/Item");
const User = require('../models/User');
const jwt = require('jsonwebtoken');


module.exports.newItem_get=(req, res)=> {
    
    res.render('newitem');

};

module.exports.newItem_post=async (req,res)=>{

    const {itemname, itemdesc, quantity, userid}=req.body;
    const sellerID=userid;

    

    console.log(req.body);

    try{
        const item=await Item.create({itemname, itemdesc, quantity, sellerID});
        console.log(item);

        var inventoryEntry={productID: item.id, quantity:item.quantity}

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