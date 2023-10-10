var express = require('express');
var ShopApiCtrl = require('../../controller/api/shop.api');
var mdJWT= require('../../middlewares/api.auth');
var multer = require('multer');
var uploader = multer({ dest: './tmp' });
var router = express.Router();

router.get('/',mdJWT.api_auth, ShopApiCtrl.listShop);

router.get('/detail/:idShop',mdJWT.api_auth, ShopApiCtrl.detailShop);

router.post('/add',mdJWT.api_auth, uploader.single("avatarShop"), ShopApiCtrl.addShop);

router.put('/update/:idShop',mdJWT.api_auth, uploader.single("avatarShop"),ShopApiCtrl.editShop);

router.delete('/delete/:idShop',mdJWT.api_auth,ShopApiCtrl.deleteShop);

module.exports = router;
