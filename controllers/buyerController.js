const User = require("../models/User");
const jwt = require('jsonwebtoken');

module.exports.secret=(req,res)=>{

  res.render('secret');
}

module.exports.updateCart=(req, res)=> {
    
    var userid;

    const token = req.cookies.jwt;

    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {

            userid=decodedToken.id;
      });

    var cartitems= {productID: '1', quantity: '5'}

    
    User.findByIdAndUpdate(userid, { $push : {cart: cartitems }})
    .then(result => {
        res.json({ redirect: '/' });
      })
      .catch(err => {
        console.log(err);
    });

};