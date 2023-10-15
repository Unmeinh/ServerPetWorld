var express = require('express');
var ProductCtrl = require('../controller/product.controller');
var multer = require('multer');
var checkLogin = require('../middlewares/checkLogin');
var uploader = multer({ dest: './tmp' });
var router = express.Router();

router.get('/',checkLogin.check_request_login, ProductCtrl.listProduct);

router.get('/detail/:idPR',checkLogin.check_request_login, ProductCtrl.detailProduct);

router.get('/delete/:idPR',checkLogin.check_request_login,ProductCtrl.deleteProduct);
router.post('/delete/:idPR',checkLogin.check_request_login,ProductCtrl.deleteProduct);

module.exports = router;