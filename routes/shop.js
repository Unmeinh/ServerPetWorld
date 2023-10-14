var express = require('express');
var ShopCtrl = require('../controller/shop.controller');
var multer = require('multer');
var uploader = multer({ dest: './tmp' });
var router = express.Router();

router.get('/', ShopCtrl.listShop);

router.get('/detail/:idShop', ShopCtrl.detailShop);//bổ sung /:idUser khi làm 
router.get('/detailOwner/:idShop', ShopCtrl.detailOwner);//bổ sung /:idUser khi làm 

router.get('/delete/:idShop',ShopCtrl.deleteShop);
router.post('/delete/:idShop',ShopCtrl.deleteShop);

module.exports = router;
