var express = require('express');
var AccountnCtrl = require('../controller/account.controller');
var checkLoginServer = require('../middlewares/checkLogin')
var router = express.Router();

router.get('/login', AccountnCtrl.login);
router.post('/login', AccountnCtrl.login);
router.get('/verifyEmail/:encodeToSha256', AccountnCtrl.verifyEmail);
router.post('/verifyEmail/:encodeToSha256', AccountnCtrl.verifyEmail);
router.get('/verifyResult', AccountnCtrl.verifyResult);
router.get('/profile',checkLoginServer.check_request_login, AccountnCtrl.profile);
router.get('/logout',checkLoginServer.check_request_login, AccountnCtrl.logout);

// router.get('/edit', AdminCtrl.editAdmin); //bổ sung /:idAdmin khi làm 
// router.put('/edit', AdminCtrl.editAdmin);//bổ sung /:idAdmin khi làm 

// router.get('/delete/:idAdmin',AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 
// router.post('/delete/:idAdmin',AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 

module.exports = router;
