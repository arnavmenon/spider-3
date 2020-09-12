const express=require('express');
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const sellerRoutes= require('./routes/sellerRoutes');

const cookieParser = require('cookie-parser');
const mongoose=require('mongoose');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


const app=express();

app.set('view engine','ejs');

app.use(express.static('public'));
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});


const dbURI = 'mongodb+srv://newuser:yeet123@cluster0.6k5bw.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {app.listen(3000);console.log('Server started on port 3000');})
  .catch((err) => console.log(err));


// routes
app.get('*', checkUser);
//app.get('/', (req, res) => res.redirect('/dashboard'));
app.use(authRoutes);

app.use(requireAuth);

app.use(buyerRoutes);
app.use(sellerRoutes);