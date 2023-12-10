var express = require('express');
var noticeSellerCtrl = require('../../controller/api/noticeSeller.api');
var router = express.Router();
var mdJWT= require('../../middlewares/api.auth');

router.get('/list/seller/all/:status',mdJWT.api_user_auth, noticeSellerCtrl.listAllNoticeSeller);

router.post('/insert',mdJWT.api_user_auth, noticeSellerCtrl.addNotiSeller);

router.get('/update/:idNotice',mdJWT.api_user_auth, noticeSellerCtrl.editNoticeSeller);

router.delete('/delete/:idNotice',mdJWT.api_user_auth, noticeSellerCtrl.deleteNoticeSeller);

module.exports = router;