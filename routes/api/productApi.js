var express = require('express');
var ProducttApiCtrl = require('../../controller/api/product.api');
var multer = require('multer');
var uploader = multer({dest:'/tmp'});
var router = express.Router();

router.get('/list/all', ProducttApiCtrl.listProduct);

router.get('/list/shop/:idShop', ProducttApiCtrl.listProductFromIdShop);

router.get('/detail/:idPR', ProducttApiCtrl.detailProduct);

router.post('/insert', uploader.any(), ProducttApiCtrl.addProduct);

router.put('/update/:idPR', uploader.any(), ProducttApiCtrl.editProduct);

router.delete('/delete/:idPR',ProducttApiCtrl.deleteProduct);

module.exports = router;