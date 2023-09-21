var express = require('express');
var myFavoriteProductsCtrl = require('../../controller/api/myfavoriteproduct.api');
var router = express.Router();
var mdJWT= require('../../middlewares/api.auth');


router.get('/list',mdJWT.api_auth, myFavoriteProductsCtrl.listAllMyFavoriteProducts);
router.post('/insert',mdJWT.api_auth, myFavoriteProductsCtrl.addFavoriteProducts);
router.delete('/delete',mdJWT.api_auth, myFavoriteProductsCtrl.deleteFavoriteProducts);

module.exports = router;