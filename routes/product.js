var express = require('express');
var ProductCtrl = require('../controller/product.controller');
var multer = require('multer');
var uploader = multer({ dest: './tmp' });
var router = express.Router();

router.get('/', ProductCtrl.listProduct);   

router.get('/detail/:idPR', ProductCtrl.detailProduct);

router.get('/delete/:idPR',ProductCtrl.deleteProduct);
router.post('/delete/:idPR',ProductCtrl.deleteProduct);

module.exports = router;
