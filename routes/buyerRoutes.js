const { Router } = require('express');
const buyerController = require('../controllers/buyerController');

const router = Router();

router.post('/updatecart', buyerController.updateCart);


module.exports = router;