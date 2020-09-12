const { Router } = require('express');
const sellerController = require('../controllers/sellerController');

const router = Router();

router.get('/newitem', sellerController.newItem_get);
router.post('/newitem', sellerController.newItem_post);


module.exports = router;