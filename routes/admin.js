var express = require('express');
var AdminCtrl = require('../controller/admin.controller');
var router = express.Router();

router.get('/', AdminCtrl.listAdmin);

router.get('/detail/:idAdmin', AdminCtrl.detailAdmin);

router.get('/add', AdminCtrl.addAdmin);
router.post('/add', AdminCtrl.addAdmin);

router.get('/edit/:idAdmin', AdminCtrl.editAdmin);
router.put('/edit/:idAdmin', AdminCtrl.editAdmin);

router.get('/delete/:idAdmin',AdminCtrl.deleteAdmin);
router.delete('/delete/:idAdmin',AdminCtrl.deleteAdmin);

module.exports = router;
