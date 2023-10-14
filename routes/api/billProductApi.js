var express = require('express');
var billProductApiCtrl = require('../../controller/api/billProduct.api');
var mdJWT= require('../../middlewares/api.auth');
var router = express.Router();
router.get('/listBillProduct',mdJWT.api_auth, billProductApiCtrl.listbillProduct);
router.get('/detailBillProduct/:idBillPr',mdJWT.api_auth, billProductApiCtrl.detailBillProduct);
router.post('/insert',mdJWT.api_auth, billProductApiCtrl.billProductUser);
router.post('/cancelBill/:id',mdJWT.api_auth, billProductApiCtrl.cancelBill);
//router.post('/edit',mdJWT.api_auth, billProductApiCtrl.editCart);

module.exports = router;