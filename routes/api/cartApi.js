var express = require('express');
var CartApiCtrl = require('../../controller/api/cart.api');
var mdJWT= require('../../middlewares/api.auth');
var router = express.Router();

router.get('/',mdJWT.api_auth, CartApiCtrl.listCart);

router.get('/user/:idUser',mdJWT.api_auth, CartApiCtrl.listCartByIdUser);

module.exports = router;