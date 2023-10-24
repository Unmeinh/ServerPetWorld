var express = require('express');
var PaymentCtrl = require('../controller/payment.controller');
var router = express.Router();
const path = require('path');


router.use(express.static(path.join(__dirname, 'public')));
router.get('/', PaymentCtrl.listPayment);
router.get('/detail/:idTransaction', PaymentCtrl.detailPayment);

// router.get('/detail/:idPR', ProductCtrl.detailProduct);

// router.get('/delete/:idPR',ProductCtrl.deleteProduct);
// router.post('/delete/:idPR',ProductCtrl.deleteProduct);

module.exports = router;
