var express = require('express');
var mdJWT= require('../../middlewares/api.auth');
var CatAllCtrl = require('../../controller/api/categoryAll.api');
var router = express.Router();

router.get('/list/all',mdJWT.api_auth, CatAllCtrl.listCategory);

router.get('/list/product&pet/:idCategory',mdJWT.api_auth, CatAllCtrl.listAllFromIdCategory);


module.exports = router;