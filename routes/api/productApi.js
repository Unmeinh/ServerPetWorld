var express = require('express');
var ProducttApiCtrl = require('../../controller/api/product.api');
var mdJWT= require('../../middlewares/api.auth');
var multer = require('multer');
var uploader = multer({dest:'/tmp'});
var router = express.Router();

router.get('/list/all',mdJWT.api_auth, ProducttApiCtrl.listProduct);

router.get('/list/shop/:idShop',mdJWT.api_auth, ProducttApiCtrl.listProductFromIdShop);

router.get('/detail/:idPR',mdJWT.api_auth, ProducttApiCtrl.detailProduct);

// router.get('/detail/:idCat',mdJWT.api_auth, ProducttApiCtrl.detailProductByIdCat);//cần lấy theo thể loại nữa

router.post('/insert',mdJWT.api_auth, uploader.any(), ProducttApiCtrl.addProduct);

router.put('/update/:idPR',mdJWT.api_auth, uploader.any(), ProducttApiCtrl.editProduct);

router.delete('/delete/:idPR',mdJWT.api_auth,ProducttApiCtrl.deleteProduct);

module.exports = router;