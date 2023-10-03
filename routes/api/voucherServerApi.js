var express = require('express');
var voucherServerCtrl = require('../../controller/api/voucherServer.api');
var router = express.Router();
var mdJWT= require('../../middlewares/api.auth');

router.get('/list',mdJWT.api_auth, voucherServerCtrl.listVoucherServer);

router.post('/insert',mdJWT.api_auth, voucherServerCtrl.addVoucherServer);

// router.put('/update/:idNotice',mdJWT.api_auth, noticeCtrl.editNotice);

// router.delete('/delete/:idNotice',mdJWT.api_auth, noticeCtrl.deleteNotice);

module.exports = router;