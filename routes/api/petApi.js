var express = require('express');
var PetApiCtrl = require('../../controller/api/pet.api');
var multer = require('multer');
var uploader = multer({dest:'/tmp'});
var router = express.Router();

router.get('/list/all', PetApiCtrl.listpet);

router.get('/list/shop/:idShop', PetApiCtrl.listPetFromIdShop);

router.get('/detail/:idPet', PetApiCtrl.detailpet);

router.post('/insert', uploader.any(), PetApiCtrl.addpet);

// router.put('/update/:idPR', uploader.any(), ProducttApiCtrl.editProduct);

router.delete('/delete/:idPet',PetApiCtrl.deletepet);

module.exports = router;