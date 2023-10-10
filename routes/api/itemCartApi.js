var express = require('express');
var ItemCartApiCtrl = require('../../controller/api/itemCart.api');
var mdJWT= require('../../middlewares/api.auth');
var router = express.Router();

router.post('/insert',mdJWT.api_auth, ItemCartApiCtrl.addItemCart);

router.put('/update/:idItemCart',mdJWT.api_auth, ItemCartApiCtrl.editItemCart);

router.delete('/delete/:idItemCart',mdJWT.api_auth,ItemCartApiCtrl.deleteItemCart);

module.exports = router;