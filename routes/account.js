var express = require('express');
var AccountnCtrl = require('../controller/account.controller');
var router = express.Router();

router.get('/login', AccountnCtrl.login);
router.post('/login', AccountnCtrl.login);
router.get('/verifyEmail/:encodeEmail', AccountnCtrl.verifyEmail);
router.post('/verifyEmail/:encodeEmail', AccountnCtrl.verifyEmail);
router.get('/verifyResult', AccountnCtrl.verifyResult);

// router.get('/edit', AdminCtrl.editAdmin); //bổ sung /:idAdmin khi làm 
// router.put('/edit', AdminCtrl.editAdmin);//bổ sung /:idAdmin khi làm 

// router.get('/delete/:idAdmin',AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 
// router.post('/delete/:idAdmin',AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 

module.exports = router;
