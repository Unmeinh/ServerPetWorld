var express = require('express');
var ShopCtrl = require('../controller/shop.controller');
var multer = require('multer');
var uploader = multer({ dest: './tmp' });
var checkLogin = require('../middlewares/checkLogin');
var router = express.Router();

router.get('/',checkLogin.check_request_login, ShopCtrl.listShop);

router.get('/detail/:idShop',checkLogin.check_request_login, ShopCtrl.detailShop);//bổ sung /:idUser khi làm 
router.get('/detailOwner/:idShop',checkLogin.check_request_login, ShopCtrl.detailOwner);//bổ sung /:idUser khi làm 

router.get('/delete/:idShop',checkLogin.check_request_login,ShopCtrl.deleteShop);
router.post('/delete/:idShop',checkLogin.check_request_login,ShopCtrl.deleteShop);

module.exports = router;
