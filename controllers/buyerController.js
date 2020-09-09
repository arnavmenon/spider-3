const User = require("../models/User");
const jwt = require('jsonwebtoken');



module.exports.updateCart=(req, res)=> {
    
    var userid;

    const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            res.redirect('/login');
        } else {
            userid=decodedToken.id;
        }
    });
  } else {
    res.redirect('/');
  }

  var cartitems= {productID: '1', quantity: '5'}

    
    User.findByIdAndUpdate(userid, { $push : {cart: cartitems }})
    .then(result => {
        res.json({ redirect: '/' });
      })
      .catch(err => {
        console.log(err);
    });

};