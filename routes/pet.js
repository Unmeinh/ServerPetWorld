var express = require('express');
var petCtrl = require('../controller/pet.controller');
var router = express.Router();
var multer = require('multer');
var uploader = multer({ dest: './tmp' });
router.get('/', petCtrl.listpet);

router.get('/detail/:idP', petCtrl.detailpet);

router.get('/delete/:idP',petCtrl.deletepet);
router.post('/delete/:idP',petCtrl.deletepet);

module.exports = router;
