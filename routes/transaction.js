var express = require('express');
var PaymentCtrl = require('../controller/transaction.controller');
var checkLoginServer = require('../middlewares/checkLogin')
var router = express.Router();
const path = require('path');


router.use(express.static(path.join(__dirname, 'public')));
router.get('/', PaymentCtrl.listPayment);
router.get('/detail/:idTransaction', PaymentCtrl.detailPayment);
router.post('/', PaymentCtrl.listPayment);
module.exports = router;
