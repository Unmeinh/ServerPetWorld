var express = require('express');
var AdminCtrl = require('../controller/admin.controller');
var checkLogin = require('../middlewares/checkLogin');
var router = express.Router();

router.get('/',checkLogin.check_request_login, AdminCtrl.listAdmin);

router.get('/detail/:idAdmin',checkLogin.check_request_login, AdminCtrl.detailAdmin);//bổ sung /:idAdmin khi làm 

router.get('/add',checkLogin.check_request_login, AdminCtrl.addAdmin);
router.post('/add', AdminCtrl.addAdmin);

// router.get('/edit', AdminCtrl.editAdmin); //bổ sung /:idAdmin khi làm 
// router.put('/edit', AdminCtrl.editAdmin);//bổ sung /:idAdmin khi làm 

router.get('/delete/:idAdmin',checkLogin.check_request_login,AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 
router.post('/delete/:idAdmin',AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 

module.exports = router;
