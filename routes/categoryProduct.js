var express = require('express');
var categoryProductCtrl = require('../controller/categoryProduct.controller');

var router = express.Router();

router.get('/', categoryProductCtrl.listCategoryProduct);

router.get('/detail', categoryProductCtrl.detailCategoryProduct);//bổ sung /:idUser khi làm 

router.get('/add',categoryProductCtrl.addCategoryProduct);
router.post('/add',categoryProductCtrl.addCategoryProduct);

router.get('/edit/:idCat', categoryProductCtrl.editCategoryProduct);//bổ sung /:idUser khi làm 
router.post('/edit/:idCat', categoryProductCtrl.editCategoryProduct);//bổ sung /:idUser khi làm 

router.get('/delete/:idCat',categoryProductCtrl.deleteCategoryProduct);//bổ sung /:idUser khi làm 
router.post('/delete/:idCat',categoryProductCtrl.deleteCategoryProduct);//bổ sung /:idUser khi làm 

module.exports = router;
