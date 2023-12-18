var express = require('express');
var noticeCtrl = require('../../controller/api/notice.api');
var router = express.Router();
var mdJWT= require('../../middlewares/api.auth');

router.get('/list/all/:status',mdJWT.api_user_auth, noticeCtrl.listAllNotice);

router.post('/insert',mdJWT.api_user_auth, noticeCtrl.addNoti);

router.get('/update',mdJWT.api_user_auth, noticeCtrl.editNotice);

router.delete('/delete/:idNotice',mdJWT.api_user_auth, noticeCtrl.deleteNotice);

router.post('/reading',mdJWT.api_user_auth, noticeCtrl.onReadingNotice);

module.exports = router;