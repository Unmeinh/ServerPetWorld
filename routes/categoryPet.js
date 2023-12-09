var express = require('express');
var checkLoginServer = require('../middlewares/checkLogin');
var categoryPetCtrl = require('../controller/categoryPet.controller');
var router = express.Router();

router.get('/', checkLoginServer.check_request_login, categoryPetCtrl.listCategoryPet);

router.get('/add', checkLoginServer.check_request_login, categoryPetCtrl.addCategoryPet);
router.post('/add', categoryPetCtrl.addCategoryPet);

router.get('/edit/:idCat', checkLoginServer.check_request_login, categoryPetCtrl.editCategoryPet);
router.post('/edit/:idCat', categoryPetCtrl.editCategoryPet);

router.get('/delete/:idCat', checkLoginServer.check_request_login, categoryPetCtrl.deleteCategoryPet);
router.post('/delete/:idCat', categoryPetCtrl.deleteCategoryPet);

module.exports = router;
