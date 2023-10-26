var express = require('express');
var ShopApiCtrl = require('../../controller/api/shop.api');
var mdJWT = require('../../middlewares/api.auth');
var multer = require('multer');
var uploader = multer({ dest: './tmp' });
var router = express.Router();

//petworld
router.get('/', mdJWT.api_user_auth, ShopApiCtrl.listShop);

router.get('/detail/:idShop', mdJWT.api_user_auth, ShopApiCtrl.detailShop);

//seller
router.get('/list/pet', mdJWT.api_shop_auth, ShopApiCtrl.listPet);
router.get('/list/product', mdJWT.api_shop_auth, ShopApiCtrl.listProduct);
router.post('/checkPhoneNumber', ShopApiCtrl.checkPhoneNumber);
router.get('/autoLogin', mdJWT.api_shop_auth, ShopApiCtrl.checkStatus);

router.post('/register', uploader.any(), ShopApiCtrl.registerShop);
router.post('/login', ShopApiCtrl.loginShop);
router.get('/regex', ShopApiCtrl.getShop);
router.post('/sendVerifyCodeEmail', ShopApiCtrl.sendVerifyEmail);
router.post('/verifyCodeEmail', ShopApiCtrl.verifyCode);

router.put('/update/:idShop', [mdJWT.api_user_auth, uploader.single("avatarShop")], ShopApiCtrl.editShop);

router.delete('/delete/:idShop', mdJWT.api_user_auth, ShopApiCtrl.deleteShop);

module.exports = router;
