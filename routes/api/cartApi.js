var express = require('express');
var CartApiCtrl = require('../../controller/api/cart.api');
var mdJWT= require('../../middlewares/api.auth');
var router = express.Router();


router.get('/',mdJWT.api_auth, CartApiCtrl.cartUser);
router.post('/',mdJWT.api_auth, CartApiCtrl.cartUser);
router.post('/edit',mdJWT.api_auth, CartApiCtrl.editCart);

module.exports = router;