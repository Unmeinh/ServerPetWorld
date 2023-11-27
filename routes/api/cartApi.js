var express = require('express');
var CartApiCtrl = require('../../controller/api/cart.api');
var mdJWT= require('../../middlewares/api.auth');
var router = express.Router();


router.get('/',mdJWT.api_user_auth, CartApiCtrl.cartUser);
router.post('/checkProduct/:id',mdJWT.api_user_auth, CartApiCtrl.checkProduct)
router.post('/',mdJWT.api_user_auth, CartApiCtrl.cartUser);
router.post('/update',mdJWT.api_user_auth, CartApiCtrl.editCart);
router.post('/updateLocations',mdJWT.api_user_auth, CartApiCtrl.updateLocaions)
router.post('/addLocations',mdJWT.api_user_auth, CartApiCtrl.addLocations)
router.post('/editLocations/:id',mdJWT.api_user_auth, CartApiCtrl.editLocationSelect)
router.post('/editLocation',mdJWT.api_user_auth, CartApiCtrl.editLocation)
module.exports = router;