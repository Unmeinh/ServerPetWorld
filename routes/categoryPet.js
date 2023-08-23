var express = require('express');
var categoryPetCtrl = require('../controller/categoryPet.controller');

var router = express.Router();

router.get('/', categoryPetCtrl.listCategoryPet);

router.get('/add',categoryPetCtrl.addCategoryPet);
router.post('/add',categoryPetCtrl.addCategoryPet);

router.get('/edit/:idPet', categoryPetCtrl.editCategoryPet);//bổ sung /:idUser khi làm 
router.post('/edit/:idPet', categoryPetCtrl.editCategoryPet);//bổ sung /:idUser khi làm 

router.get('/delete/:idPet',categoryPetCtrl.deleteCategoryPet);//bổ sung /:idUser khi làm 
router.post('/delete/:idPet',categoryPetCtrl.deleteCategoryPet);//bổ sung /:idUser khi làm 

module.exports = router;
