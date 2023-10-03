var express = require('express');
var billProductApiCtrl = require('../../controller/api/billProduct.api');
var mdJWT= require('../../middlewares/api.auth');
var router = express.Router();
router.get('/',mdJWT.api_auth, billProductApiCtrl.listbillProduct);
router.post('/insert',mdJWT.api_auth, billProductApiCtrl.billProductUser);
//router.post('/edit',mdJWT.api_auth, billProductApiCtrl.editCart);

module.exports = router;