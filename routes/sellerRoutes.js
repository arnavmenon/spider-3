const { Router } = require('express');
const sellerController = require('../controllers/sellerController');

const router = Router();

router.get('/newitem', sellerController.newItem_get);
router.post('/newitem', sellerController.newItem_post);
router.get('/getinventory',sellerController.getInventory);
router.get('/soldhistory',sellerController.soldHistory);
router.get('/editproduct/:id',sellerController.editProduct);
router.post('/updateproduct',sellerController.updateProduct);



module.exports = router;