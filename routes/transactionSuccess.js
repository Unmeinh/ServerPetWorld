var express = require('express');
var PaymentCtrl = require('../controller/transactionSuccess.controller');
var checkLoginServer = require('../middlewares/checkLogin')
var router = express.Router();
const path = require('path');


// router.use(express.static(path.join(__dirname, 'public')));
router.get('/', PaymentCtrl.transactionSuccess);
// router.get('/detail/:idTransaction', PaymentCtrl.detailPayment);
// router.post('/', PaymentCtrl.listPayment);
module.exports = router;
