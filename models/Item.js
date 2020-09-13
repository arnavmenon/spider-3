const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({

    itemname: {
      type: String,
      required: true,
    }, 
    itemdesc: {
      type: String
    },
    price: {
      type: Number
    },
    quantity: {
      type: Number   
     },
    sellerID: {
      type: String
    },
    url: {
      type: String
    }

  });
  



const Item = mongoose.model('item', itemSchema);

module.exports = Item;