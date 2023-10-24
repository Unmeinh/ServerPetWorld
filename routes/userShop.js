var express = require('express');
var multer = require('multer')
var uploader = multer({dest:'./tmp'});
var UserShopCtrl = require('../controller/userShop.controller');
var router = express.Router();

router.get('/', UserShopCtrl.listUserShop);

router.get('/detail/:idUS', UserShopCtrl.detailUserShop);

router.get('/add',UserShopCtrl.addUserShop);
router.post('/add',uploader.single('anh_usershop'), UserShopCtrl.addUserShop);

// router.get('/edit', UserShopCtrl.editUserShop);
// router.put('/edit', UserShopCtrl.editUserShop);

router.get('/delete/:idUS',UserShopCtrl.deleteUserShop);
router.post('/delete/:idUS',UserShopCtrl.deleteUserShop);

module.exports = router;
