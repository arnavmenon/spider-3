const { Router } = require('express');
const buyerController = require('../controllers/buyerController');

const router = Router();

router.post('/updatecart', buyerController.updateCart);
router.get('/secret',buyerController.secret);


module.exports = router;