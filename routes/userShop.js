var express = require('express');
var UserShopCtrl = require('../controller/userShop.controller');
var router = express.Router();

router.get('/', UserShopCtrl.listUserShop);

router.get('/detail/:idUser', UserShopCtrl.detailUserShop);

router.get('/add',UserShopCtrl.addUserShop);
router.post('/add', UserShopCtrl.addUserShop);

router.get('/edit/:idUser', UserShopCtrl.editUserShop);
router.put('/edit/:idUser', UserShopCtrl.editUserShop);

router.get('/delete/:idUser',UserShopCtrl.deleteUserShop);
router.delete('/delete/:idUser',UserShopCtrl.deleteUserShop);

module.exports = router;
