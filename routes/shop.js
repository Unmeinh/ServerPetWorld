var express = require('express');
var ShopCtrl = require('../controller/shop.controller');
var multer = require('multer');
var uploader = multer({ dest: './tmp' });
var router = express.Router();
router.get('/', ShopCtrl.listShop);
router.get('/confirm', ShopCtrl.listShopConfirm);
router.get('/detail/:idShop', ShopCtrl.detailShop);
router.get('/delete/:idShop',ShopCtrl.deleteShop);
router.post('/delete/:idShop',ShopCtrl.deleteShop);

router.get('/update/:idShop', ShopCtrl.updateShopStatus);
router.post('/update/:idShop', ShopCtrl.updateShopStatus);


module.exports = router;
