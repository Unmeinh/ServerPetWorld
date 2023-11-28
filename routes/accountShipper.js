var express = require('express');
var AccountnCtrl = require('../controller/accountShipper.controller');
var router = express.Router();

router.get('/loginShipper', AccountnCtrl.login);
router.post('/loginShipper', AccountnCtrl.login);
router.get('/verifyEmail/:encodeToSha256', AccountnCtrl.verifyEmail);
router.post('/verifyEmail/:encodeToSha256', AccountnCtrl.verifyEmail);
router.get('/verifyResult', AccountnCtrl.verifyResult);

router.get('/listBillProduct', AccountnCtrl.listBillProduct);
router.get('/updateDeliveryStatus/:idBill', AccountnCtrl.updateDeliveryStatus);
router.get('/updateDeliveryStatusSuccset/:idBill', AccountnCtrl.updateDeliveryStatusSuccset);
router.get('/updateDeliveryStatusFall/:idBill', AccountnCtrl.updateDeliveryStatusFall);
router.get('/updateDeliveryStatusCancel/:idBill', AccountnCtrl.updateDeliveryStatusCancel);
router.get('/listbillDeliveryFall', AccountnCtrl.listbillDeliveryFall);
router.get('/successfulDelivery', AccountnCtrl.successfulDelivery);
router.get('/listbillDelivering', AccountnCtrl.listbillDelivering);
router.get('/cancelledDelivery', AccountnCtrl.cancelledDelivery);
router.get('/proFileShipper', AccountnCtrl.detailShipper);
router.post('/updateProFileShipper', AccountnCtrl.updateShipperInformation);

// router.get('/edit', AdminCtrl.editAdmin); //bổ sung /:idAdmin khi làm 
// router.put('/edit', AdminCtrl.editAdmin);//bổ sung /:idAdmin khi làm 

// router.get('/delete/:idAdmin',AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 
// router.post('/delete/:idAdmin',AdminCtrl.deleteAdmin);//bổ sung /:idAdmin khi làm 

module.exports = router;
