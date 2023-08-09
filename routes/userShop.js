var express = require('express');
var UserShopCtrl = require('../controller/userShop.controller');
var multer = require('multer');
var uploader = multer({dest:'./tmp'});

var router = express.Router();

router.get('/', UserShopCtrl.listUserShop);

router.get('/detail/:idUS', UserShopCtrl.detailUserShop);//bổ sung /:idAdmin khi làm 
router.get('/add',UserShopCtrl.addUserShop);
router.post('/add',uploader.single('anh_usershop'),UserShopCtrl.addUserShop);

// router.get('/edit', UserShopCtrl.editUserShop);//bổ sung /:idUserShop khi làm
// router.put('/edit', UserShopCtrl.editUserShop);//bổ sung /:idUserShop khi làm

router.get('/delete',UserShopCtrl.deleteUserShop);//bổ sung /:idUserShop khi làm
router.delete('/delete',UserShopCtrl.deleteUserShop);//bổ sung /:idUserShop khi làm

router.get('/listUserShop', UserShopCtrl.listUserShop);


module.exports = router;    
