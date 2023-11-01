var express = require('express');
var ProducttApiCtrl = require('../../controller/api/product.api');
var mdJWT= require('../../middlewares/api.auth');
var multer = require('multer');
var uploader = multer({dest:'/tmp'});
var router = express.Router();

router.get('/list/all',mdJWT.api_user_auth, ProducttApiCtrl.listProduct);

router.get('/list/shop/:idShop',mdJWT.api_user_auth, ProducttApiCtrl.listProductFromIdShop);

router.get('/detail/:idPR',mdJWT.api_user_auth, ProducttApiCtrl.detailProduct);

// router.get('/detail/:idCat',mdJWT.api_user_auth, ProducttApiCtrl.detailProductByIdCat);//cần lấy theo thể loại nữa

//Seller
router.get('/list/category',mdJWT.api_shop_auth, ProducttApiCtrl.listCategory);

router.post('/insert',mdJWT.api_shop_auth, uploader.any(), ProducttApiCtrl.addProduct);

router.put('/update',mdJWT.api_shop_auth, uploader.any(), ProducttApiCtrl.editProduct);

router.delete('/delete/:idProduct',mdJWT.api_shop_auth,ProducttApiCtrl.deleteProduct);

module.exports = router;