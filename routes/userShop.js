var express = require('express');
var UserShopCtrl = require('../controller/userShop.controller');
var router = express.Router();

router.get('/', UserShopCtrl.listUserShop);

router.get('/detail', UserShopCtrl.detailUserShop);//bổ sung /:idUserShop khi làm

router.get('/add',UserShopCtrl.addUserShop);
router.post('/add', UserShopCtrl.addUserShop);

router.get('/edit', UserShopCtrl.editUserShop);//bổ sung /:idUserShop khi làm
router.put('/edit', UserShopCtrl.editUserShop);//bổ sung /:idUserShop khi làm

router.get('/delete',UserShopCtrl.deleteUserShop);//bổ sung /:idUserShop khi làm
router.delete('/delete',UserShopCtrl.deleteUserShop);//bổ sung /:idUserShop khi làm

module.exports = router;
