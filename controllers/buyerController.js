const User = require("../models/User");
const Item = require("../models/Item");
const jwt = require('jsonwebtoken');

module.exports.secret=(req,res)=>{

  res.render('secret');
}

module.exports.home=(req, res)=> {
    
     
    Item.find({},null,{ sort: {itemname:1 }}, function(err,items){
      if (err) return res.status(500).send("Error");
      //if (!items) return res.status(404).send("No items found.");
      res.render('search',{itemlist: items});
    })

};

module.exports.search=(req,res)=>{

  let searchText=req.params.searchtext;

  Item.find({$or:[{itemname:{ $regex: `^${searchText}`, $options: 'i' }},{itemdesc:{ $regex: `^${searchText}`, $options: 'i' }}]}, function (err, items) {
    if (err) return res.status(500).send("Error");
    if (!items) return res.status(404).send("No item found.");
    res.status(200).send(items);
    
});

}

module.exports.productDetails=(req, res)=> {
    

  let id=req.params.id;
     
  Item.findById(id,function(err,item){
    if (err) return res.status(500).send("Error");
    //if (!items) return res.status(404).send("No items found.");
    res.render('bproduct',{item: item});
  })

};

module.exports.addtocart=(req, res)=> {
    

  const {qty, userid, itemid}=req.body;

  console.log(qty,userid,itemid);
     
  Item.findById(itemid,function(err,item){
    if (err) return res.status(500).send("Error");

    var cartitems= {productID: item.id, prodname:item.itemname, price:item.price, quantity: qty, url: item.url}
    User.findByIdAndUpdate(userid, { $push : {cart: cartitems }})
    .then(result => {
        res.send(item);
      })
      .catch(err => {
        console.log(err);
    });
  })

};

module.exports.displayCart=(req,res)=>{
  const token = req.cookies.jwt;
  jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
    let user = await User.findById(decodedToken.id);
    //console.log("yeeeeeeeeeeeeet",user.cart);
  });
  res.render('cart');
}

module.exports.buyCart=(req,res)=>{
  const token = req.cookies.jwt;
  const today= new Date();
  var returnmsg=[];
  jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
    let user = await User.findById(decodedToken.id);
    let cart=user.cart;
    cart.forEach(item => {
      Item.findById(item.productID,(err,shopitem)=>{
        //if(err) return res.status(500).send("Error");

        if(item.quantity>shopitem.quantity){
          returnmsg.push(`${cart.prodname} could not be purchased, Try again`);
          return;
        }
        
        else{

          var finalqty=shopitem.quantity-item.quantity;
          var cost=shopitem.price*item.quantity;
          var boughtitems= {productID: shopitem.id, prodname:shopitem.itemname, price:shopitem.price, cost: cost, quantity: item.quantity, url: shopitem.url, date: today}
          User.findByIdAndUpdate(user.id, { $push : {history: boughtitems }})
          .then(result=>{

            boughtitems={productID: shopitem.id, prodname:shopitem.itemname, price:shopitem.price, cost: cost, quantity: item.quantity, url: shopitem.url, username:user.username,email:user.email,date: today};
            User.findByIdAndUpdate(item.sellerID, { $push : {history: boughtitems}})
            .then(result=>{

              Item.findByIdAndUpdate(shopitem.id,{quantity: finalqty})
              .then(result=>{
                returnmsg.push(`${cart.prodname} purchased.`);

              })
              .catch(err=>{console.log(err);})
            })
            .catch(err=>{console.log(err);})

          })
          .catch(err=>{console.log(err);})

        }
    });
    });

    var emptyarray=[];
    User.findByIdAndUpdate(user.id, { $set : {cart: emptyarray }})
    .then(result=>{
      res.render('cart',{message: returnmsg});
    })
    .catch(err=>{console.log(err);})

});

  res.render('cart');
}



module.exports.boughtHistory=(req,res)=>{
  res.render('bhistory');
}

module.exports.buy=(req, res)=> {
    

  const {qty, userid, itemid}=req.body;
  const today= new Date();

  console.log(qty,userid,itemid);
     
  Item.findById(itemid,function(err,item){
    if (err) return res.status(500).send("Error");

    var finalqty=item.quantity-qty;
    var cost=item.price*qty;

    var boughtitems= {productID: item.id, prodname:item.itemname, price:item.price, cost: cost, quantity: qty, url: item.url, date: today}
    User.findByIdAndUpdate(userid, { $push : {history: boughtitems }})
    .then(result => {

      const token = req.cookies.jwt;
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {

            let user = await User.findById(decodedToken.id);
            //const username=user.username,email=user.email;
            boughtitems={productID: item.id, prodname:item.itemname, price:item.price, cost: cost, quantity: qty, url: item.url, username:user.username,email:user.email, date: today};
            User.findByIdAndUpdate(item.sellerID, { $push : {history: boughtitems}})
            .then(result=>{

              Item.findByIdAndUpdate(itemid,{quantity: finalqty})
              .then(result=>{
                res.send(user);
              })
              .catch(err=>{console.log(err);})

             
            })
            .catch(err=>{console.log(err);})
            


            //console.log(user);
           
          
        });
        
      })
      .catch(err => {
        console.log(err);
    });
  })

  

};