var express = require('express');
var AdminCtrl = require('../controller/admin.controller');
var router = express.Router();

router.get('/', AdminCtrl.listAdmin);

router.get('/detail/:idAdmin', AdminCtrl.detailAdmin);//bổ sung /:idAdmin khi làm 

router.get('/add', AdminCtrl.addAdmin);
router.post('/add', AdminCtrl.addAdmin);

// router.get('/edit', AdminCtrl.editAdmin); //bổ sung /:idAdmin khi làm 
// router.put('/edit', AdminCtrl.editAdmin);//bổ sung /:idAdmin khi làm 

router.get('/delete/:idAdmin',AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 
router.post('/delete/:idAdmin',AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 

module.exports = router;
