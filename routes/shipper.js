var express = require('express');
var ShipperApiCtrl = require('../controller/shipper.api');
var router = express.Router();
var checkLogin = require('../middlewares/checkLogin');
router.get('/', ShipperApiCtrl.listShipper);
router.get('/add', ShipperApiCtrl.addShipper);
router.post('/add', ShipperApiCtrl.addShipper);
router.get('/delete/:idShipper',ShipperApiCtrl.deleteShipper);//bổ sung /:idShipper khi làm 
router.post('/delete/:idShipper',ShipperApiCtrl.deleteShipper);//bổ sung /:idShipper khi làm
router.post('/updateShipperStatus/:idBill', ShipperApiCtrl.updateShipperStatus);
module.exports = router;