const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const products = new mongoose.Schema({
  productID: {
    type: String,
    required: true
  },
  prodname: {
    type: String
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number
  },
  url: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  }

  
})


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: true,
    lowercase: true,
    minlength: [6, 'Minimum username length is 6 characters']  
  },
  usertype: {
    type: String,
    required: true,
  }, 
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  cart: {
    type: [products]
  },
  inventory: {
    type: [products]
  },
  history: {
    type: [products]
  }
});


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;