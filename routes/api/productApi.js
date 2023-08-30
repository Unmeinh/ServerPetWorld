var express = require('express');
var ProducttApiCtrl = require('../../controller/api/product.api');
var multer = require('multer');
var uploader = multer({dest:'/tmp'});
var router = express.Router();

router.get('/', ProducttApiCtrl.listProduct);

router.get('/shop/:idShop', ProducttApiCtrl.listProductFromIdShop);

router.get('/detail/:idPR', ProducttApiCtrl.detailProduct);

router.post('/add', uploader.any(), ProducttApiCtrl.addProduct);

// router.put('/edit/:idItemCart', ItemCartApiCtrl.editItemCart);

router.delete('/delete/:idPR',ProducttApiCtrl.deleteProduct);

module.exports = router;