var express = require('express');
var ProductCtrl = require('../controller/product.controller');
var checkLoginServer = require('../middlewares/checkLogin')
var router = express.Router();

router.get('/',checkLoginServer.check_request_login, ProductCtrl.listProduct);

router.get('/detail/:idPR',checkLoginServer.check_request_login, ProductCtrl.detailProduct);

router.get('/delete/:idPR',checkLoginServer.check_request_login,ProductCtrl.deleteProduct);
router.post('/delete/:idPR',ProductCtrl.deleteProduct);

module.exports = router;
