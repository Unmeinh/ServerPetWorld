var express = require('express');
var saveNotiCtrl = require('../../controller/api/notice.api');
var router = express.Router();
var mdJWT= require('../../middlewares/api.auth');

// router.get('/add',UserCtrl.addUser);
router.post('/insert',mdJWT.api_auth, saveNotiCtrl.addNoti);

router.put('/update/:idNotice',mdJWT.api_auth, saveNotiCtrl.editNotice);

router.delete('/delete/:idNotice',mdJWT.api_auth, saveNotiCtrl.deleteNotice);

module.exports = router;