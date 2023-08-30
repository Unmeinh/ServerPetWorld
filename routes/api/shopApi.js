var express = require('express');
var ShopApiCtrl = require('../../controller/api/shop.api');
var multer = require('multer');
var uploader = multer({ dest: './tmp' });
var router = express.Router();

router.get('/', ShopApiCtrl.listShop);

router.get('/detail/:idShop', ShopApiCtrl.detailShop);

router.post('/add', uploader.single("avatarShop"), ShopApiCtrl.addShop);

router.put('/update/:idShop', uploader.single("avatarShop"),ShopApiCtrl.editShop);

router.delete('/delete/:idShop',ShopApiCtrl.deleteShop);

module.exports = router;
