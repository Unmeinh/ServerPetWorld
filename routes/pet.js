var express = require('express');
var petCtrl = require('../controller/pet.controller');
var checkLoginServer = require('../middlewares/checkLogin')
var router = express.Router();

router.get('/',checkLoginServer.check_request_login, petCtrl.listpet);

router.get('/detail/:idP',checkLoginServer.check_request_login, petCtrl.detailpet);

router.get('/delete/:idP',checkLoginServer.check_request_login,petCtrl.deletepet);
router.post('/delete/:idP',petCtrl.deletepet);

// router.get('/reason-delete/:idP',petCtrl.deletepet);
// router.post('/reason-delete/:idP',petCtrl.deletepet);
module.exports = router;
