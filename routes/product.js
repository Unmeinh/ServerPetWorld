var express = require('express');
var ProductCtrl = require('../controller/product.controller');
var multer = require('multer');
var checkLogin = require('../middlewares/checkLogin');
var uploader = multer({ dest: './tmp' });
var router = express.Router();

<<<<<<< HEAD
router.get('/', ProductCtrl.listProduct);   
=======
router.get('/', checkLogin.check_request_login, ProductCtrl.listProduct);
>>>>>>> 0f768fb01a5a7ee664b0390baebf3031cc9f81d3

router.get('/detail/:idPR', checkLogin.check_request_login, ProductCtrl.detailProduct);

router.get('/delete/:idPR', checkLogin.check_request_login, ProductCtrl.deleteProduct);
router.post('/delete/:idPR', checkLogin.check_request_login, ProductCtrl.deleteProduct);

module.exports = router;