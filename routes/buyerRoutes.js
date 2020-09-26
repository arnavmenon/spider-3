const { Router } = require('express');
const buyerController = require('../controllers/buyerController');

const router = Router();

router.get('/search',buyerController.home);
router.get('/product/:id',buyerController.productDetails);
router.post('/addtocart',buyerController.addtocart);
router.get('/cart',buyerController.displayCart);
router.post('/buy',buyerController.buy);
router.get('/boughthistory',buyerController.boughtHistory)
router.get('/search/:searchtext',buyerController.search);
router.get('/buycart',buyerController.buyCart)





module.exports = router;