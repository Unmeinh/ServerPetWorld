var express = require('express');
var PaymentCtrl = require('../controller/transaction.controller');
var checkLoginServer = require('../middlewares/checkLogin')
var router = express.Router();
const path = require('path');


router.use(express.static(path.join(__dirname, 'public')));
router.get('/',checkLoginServer.check_request_login, PaymentCtrl.listPayment);
router.get('/detail/:idTransaction',checkLoginServer.check_request_login, PaymentCtrl.detailPayment);
router.post('/', PaymentCtrl.listPayment);
module.exports = router;
