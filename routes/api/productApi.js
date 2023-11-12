var express = require('express');
var ProductApiCtrl = require('../../controller/api/product.api');
var mdJWT= require('../../middlewares/api.auth');
var multer = require('multer');
var uploader = multer({dest:'/tmp'});
var router = express.Router();

router.get('/list/all',mdJWT.api_user_auth, ProductApiCtrl.listProduct);

router.get('/list/shop/:idShop',mdJWT.api_user_auth, ProductApiCtrl.listProductFromIdShop);

router.get('/detail/:idPR',mdJWT.api_user_auth, ProductApiCtrl.detailProduct);

// router.get('/detail/:idCat',mdJWT.api_user_auth, ProductApiCtrl.detailProductByIdCat);//cần lấy theo thể loại nữa

//Seller
router.get('/list/category',mdJWT.api_shop_auth, ProductApiCtrl.listCategory);

router.post('/insert',mdJWT.api_shop_auth, uploader.any(), ProductApiCtrl.addProduct);

router.put('/update',mdJWT.api_shop_auth, uploader.any(), ProductApiCtrl.editProduct);

router.put('/unremove',mdJWT.api_shop_auth, ProductApiCtrl.unremoveProduct);

router.put('/remove',mdJWT.api_shop_auth, ProductApiCtrl.removeProduct);

router.get('/updateStatus',mdJWT.api_shop_auth, ProductApiCtrl.updateStatus);

router.delete('/delete/:idProduct',mdJWT.api_shop_auth,ProductApiCtrl.deleteProduct);

module.exports = router;