const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({

    itemname: {
      type: String,
      required: true,
    }, 
    itemdesc: {
      type: String
    },
    quantity: {
      type: Number   
     },
    sellerID: {
      type: String
    }

  });
  



const Item = mongoose.model('item', itemSchema);

module.exports = Item;