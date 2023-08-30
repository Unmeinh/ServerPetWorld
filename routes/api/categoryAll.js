var express = require('express');

var CatAllCtrl = require('../../controller/api/categoryAll.api');
var router = express.Router();

router.get('/list/all', CatAllCtrl.listCategory);


module.exports = router;