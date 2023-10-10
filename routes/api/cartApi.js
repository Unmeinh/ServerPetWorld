var express = require('express');
var CartApiCtrl = require('../../controller/api/cart.api');
var mdJWT= require('../../middlewares/api.auth');
var router = express.Router();


router.get('/',mdJWT.api_auth, CartApiCtrl.cartUser);
router.post('/checkProduct/:id',mdJWT.api_auth, CartApiCtrl.checkProduct)
router.post('/',mdJWT.api_auth, CartApiCtrl.cartUser);
router.post('/update',mdJWT.api_auth, CartApiCtrl.editCart);
router.post('/updateLocations',mdJWT.api_auth, CartApiCtrl.updateLocaions)
router.post('/addLocations',mdJWT.api_auth, CartApiCtrl.addLocations)
router.put('/editLocations/:id',mdJWT.api_auth, CartApiCtrl.editLocationSelect)
router.put('/editLocation',mdJWT.api_auth, CartApiCtrl.editLocation)
module.exports = router;