var express = require('express');
var AddShipperCtrl = require('../controller/addShipper.controller');
var checkLogin = require('../middlewares/checkLogin');
var router = express.Router();

router.get('/listBillProduct', AddShipperCtrl.listBillProduct);
router.get('/listShipper/:idBillProduct', AddShipperCtrl.listShipper);
router.post('/insertShipper/:idBillProduct', AddShipperCtrl.addShipper);


module.exports = router;
