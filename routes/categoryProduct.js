var express = require('express');
var checkLoginServer = require('../middlewares/checkLogin');
var categoryProductCtrl = require('../controller/categoryProduct.controller');

var router = express.Router();

router.get('/',checkLoginServer.check_request_login, categoryProductCtrl.listCategoryProduct);

// router.get('/detail', categoryProductCtrl.detailCategoryProduct);

router.get('/add',checkLoginServer.check_request_login,categoryProductCtrl.addCategoryProduct);
router.post('/add',categoryProductCtrl.addCategoryProduct);

router.get('/edit/:idCat',checkLoginServer.check_request_login, categoryProductCtrl.editCategoryProduct);
router.post('/edit/:idCat', categoryProductCtrl.editCategoryProduct);

router.get('/delete/:idCat',checkLoginServer.check_request_login,categoryProductCtrl.deleteCategoryProduct);
router.post('/delete/:idCat',categoryProductCtrl.deleteCategoryProduct);

module.exports = router;
