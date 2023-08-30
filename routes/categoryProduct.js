var express = require('express');
var categoryProductCtrl = require('../controller/categoryProduct.controller');

var router = express.Router();

router.get('/', categoryProductCtrl.listCategoryProduct);

// router.get('/detail', categoryProductCtrl.detailCategoryProduct);

router.get('/add',categoryProductCtrl.addCategoryProduct);
router.post('/add',categoryProductCtrl.addCategoryProduct);

router.get('/edit/:idCat', categoryProductCtrl.editCategoryProduct);
router.post('/edit/:idCat', categoryProductCtrl.editCategoryProduct);

router.get('/delete/:idCat',categoryProductCtrl.deleteCategoryProduct);
router.post('/delete/:idCat',categoryProductCtrl.deleteCategoryProduct);

module.exports = router;
