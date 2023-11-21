var express = require('express');
var mdJWT= require('../../middlewares/api.auth');
var CatAllCtrl = require('../../controller/api/categoryAll.api');
var router = express.Router();

router.get('/list/all',mdJWT.api_user_auth, CatAllCtrl.listCategory);

router.get('/list/product&pet/:idCategory',mdJWT.api_user_auth, CatAllCtrl.listAllFromIdCategory);

router.get('/list/category/all/:idCategory',mdJWT.api_user_auth, CatAllCtrl.listCategorySort);
module.exports = router;