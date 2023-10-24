var express = require('express');
var PetApiCtrl = require('../../controller/api/pet.api');
var mdJWT= require('../../middlewares/api.auth');
var multer = require('multer');
var uploader = multer({dest:'/tmp'});
var router = express.Router();

router.get('/list/all',mdJWT.api_user_auth, PetApiCtrl.listpet);

router.get('/list/shop/:idShop',mdJWT.api_user_auth, PetApiCtrl.listPetFromIdShop);

router.get('/detail/:idPet',mdJWT.api_user_auth, PetApiCtrl.detailpet);

//Seller
router.get('/list/category',mdJWT.api_shop_auth, PetApiCtrl.listCategory);

router.post('/insert',mdJWT.api_shop_auth, uploader.any(), PetApiCtrl.addpet);

// router.put('/update/:idPR', uploader.any(), ProducttApiCtrl.editProduct);

router.delete('/delete/:idPet',mdJWT.api_user_auth,PetApiCtrl.deletepet);

module.exports = router;