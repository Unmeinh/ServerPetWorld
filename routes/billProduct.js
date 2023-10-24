var express = require('express');
var billProductCtrl = require('../controller/billProduct.controller');
var checkLoginServer = require('../middlewares/checkLogin');
var router = express.Router();

router.get('/', checkLoginServer.check_request_login, billProductCtrl.listBillProduct);

router.get('/detail/:idBP', checkLoginServer.check_request_login, billProductCtrl.detailBillProduct);

module.exports = router;
