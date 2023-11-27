var express = require('express');
var AdminCtrl = require('../controller/admin.controller');
var checkLogin = require('../middlewares/checkLogin');
var router = express.Router();

router.get('/',checkLogin.check_request_login, AdminCtrl.listAdmin);

router.get('/detail/:idAdmin',checkLogin.check_request_login, AdminCtrl.detailAdmin); 

router.get('/add',checkLogin.check_request_login, AdminCtrl.addAdmin);
router.post('/add',checkLogin.check_request_login, AdminCtrl.addAdmin);

// router.get('/edit', AdminCtrl.editAdmin);  
// router.put('/edit', AdminCtrl.editAdmin);

router.get('/delete/:idAdmin',checkLogin.check_request_login,AdminCtrl.deleteAdmin);
router.post('/delete/:idAdmin',checkLogin.check_request_login,AdminCtrl.deleteAdmin);

module.exports = router;
