var express = require('express');
var ItemCartApiCtrl = require('../../controller/api/itemCart.api');
var router = express.Router();

router.get('/', ItemCartApiCtrl.listItemCart);

router.get('/user/:idUser', ItemCartApiCtrl.listItemCartFromIdUser);

router.get('/detail/:idItemCart', ItemCartApiCtrl.detailItemCart);

router.post('/add', ItemCartApiCtrl.addItemCart);

router.put('/edit/:idItemCart', ItemCartApiCtrl.editItemCart);

router.delete('/delete/:idItemCart',ItemCartApiCtrl.deleteItemCart);

module.exports = router;