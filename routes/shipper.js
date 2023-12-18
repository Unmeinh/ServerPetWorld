var express = require('express');
var ShipperApiCtrl = require('../controller/shipper.api');
var router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
var checkLogin = require('../middlewares/checkLogin');
router.get('/',checkLogin.check_request_login, ShipperApiCtrl.listShipper);
router.get('/add',checkLogin.check_request_login, ShipperApiCtrl.addShipper);
router.post('/add', upload.any(),checkLogin.check_request_login, ShipperApiCtrl.addShipper);
router.get('/detail/:idShipper',checkLogin.check_request_login,ShipperApiCtrl.detailShipper);//bổ sung /:idShipper khi làm 
router.get('/delete/:idShipper',checkLogin.check_request_login,ShipperApiCtrl.deleteShipper);//bổ sung /:idShipper khi làm 
router.post('/delete/:idShipper',checkLogin.check_request_login,ShipperApiCtrl.deleteShipper);//bổ sung /:idShipper khi làm
router.post('/updateShipperStatus/:idBill',checkLogin.check_request_login, ShipperApiCtrl.updateShipperStatus);
module.exports = router;