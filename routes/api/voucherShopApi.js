var express = require('express');
var voucherShopCtrl = require('../../controller/api/voucherShop.api');
var router = express.Router();
var mdJWT= require('../../middlewares/api.auth');

router.get('/list',mdJWT.api_user_auth, voucherShopCtrl.listVoucherShop);

router.post('/insert',mdJWT.api_user_auth, voucherShopCtrl.addVoucherShop);

// router.put('/update/:idNotice',mdJWT.api_user_auth, noticeCtrl.editNotice);

// router.delete('/delete/:idNotice',mdJWT.api_user_auth, noticeCtrl.deleteNotice);

module.exports = router;