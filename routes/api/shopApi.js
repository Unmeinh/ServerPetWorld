var express = require("express");
var ShopApiCtrl = require("../../controller/api/shop.api");
var mdJWT = require("../../middlewares/api.auth");
var multer = require("multer");
var uploader = multer({ dest: "./tmp" });
var router = express.Router();

//petworld
router.get("/", mdJWT.api_user_auth, ShopApiCtrl.listShop);

router.get("/detail/:idShop", mdJWT.api_user_auth, ShopApiCtrl.detailShop);

//seller
router.get("/statistics/chart/revenue", mdJWT.api_shop_auth, ShopApiCtrl.statisticsChartRevenue);
router.get("/statistics/chart/sold", mdJWT.api_shop_auth, ShopApiCtrl.statisticsChartSold);
router.get("/statistics/year/revenue", mdJWT.api_shop_auth, ShopApiCtrl.statisticsYearRevenue);
router.get("/statistics/year/sold", mdJWT.api_shop_auth, ShopApiCtrl.statisticsYearSold);
router.get("/list/pet", mdJWT.api_shop_auth, ShopApiCtrl.listPet);
router.get("/list/product", mdJWT.api_shop_auth, ShopApiCtrl.listProduct);
router.get("/list/bill/all", mdJWT.api_shop_auth, ShopApiCtrl.listBillAll);
router.get("/list/bill/processing", mdJWT.api_shop_auth, ShopApiCtrl.listProcessBill);
router.get("/list/bill/delivering", mdJWT.api_shop_auth, ShopApiCtrl.listDeliveringBill);
router.get("/list/bill/delivered", mdJWT.api_shop_auth, ShopApiCtrl.listDeliveredBill);
router.get("/list/bill/evaluated", mdJWT.api_shop_auth, ShopApiCtrl.listEvaluatedBill);
router.get("/list/bill/cancelled", mdJWT.api_shop_auth, ShopApiCtrl.listCancelledBill);
router.get("/list/appointment", mdJWT.api_shop_auth, ShopApiCtrl.listAppointment);
router.get("/pet/detail/:idPet", mdJWT.api_shop_auth, ShopApiCtrl.detailPet);
router.get("/product/detail/:idProd", mdJWT.api_shop_auth, ShopApiCtrl.detailProduct);
router.get("/appointment/detail/:idAppt", mdJWT.api_shop_auth, ShopApiCtrl.detailAppointment);
router.post("/bill/confirm", mdJWT.api_shop_auth, ShopApiCtrl.confirmBill);
router.post("/bill/confirmAll", mdJWT.api_shop_auth, ShopApiCtrl.confirmBillAll);
router.post("/bill/findShipper", mdJWT.api_shop_auth, ShopApiCtrl.findShipper);
router.put("/appointment/update", mdJWT.api_shop_auth, ShopApiCtrl.updateApm);

router.get("/myDetail", mdJWT.api_shop_auth, ShopApiCtrl.myShopDetail);
router.get("/detailOwner", mdJWT.api_shop_auth, ShopApiCtrl.detailOwner);
router.post("/checkPhoneNumber", ShopApiCtrl.checkPhoneNumber);
router.put("/checkPhoneNumber", ShopApiCtrl.checkPhoneNumber);
router.put("/checkEmail", ShopApiCtrl.checkEmail);
router.get("/autoLogin", mdJWT.api_shop_auth, ShopApiCtrl.autoLogin);
router.post("/autoLogin", mdJWT.api_shop_auth, ShopApiCtrl.autoLogin);
router.post('/updateTokenDevice', mdJWT.api_shop_auth, ShopApiCtrl.updateTokenDevice);
router.post("/register", uploader.any(), ShopApiCtrl.registerShop);
router.post("/login", ShopApiCtrl.loginShop);
router.get("/logout", mdJWT.api_shop_auth, ShopApiCtrl.logoutShop);
router.post("/sendVerifyCodeEmail", ShopApiCtrl.sendVerifyEmail);
router.post("/verifyCodeEmail", ShopApiCtrl.verifyCode);
router.post("/sendResetPasswordEmail", ShopApiCtrl.sendResetPassword);
router.post("/verifyResetPasswordCode", ShopApiCtrl.verifyResetCode);

router.put("/update/:idShop", [mdJWT.api_shop_auth, uploader.single("avatarShop")], ShopApiCtrl.editShop);
router.put("/updateInfo", mdJWT.api_shop_auth, ShopApiCtrl.updateInfo);
router.put("/updateAvatar", mdJWT.api_shop_auth, uploader.any(), ShopApiCtrl.updateAvatar);
router.put("/updateAccount", mdJWT.api_shop_auth, ShopApiCtrl.updateAccount);
router.put("/updatePassword", mdJWT.api_shop_auth, ShopApiCtrl.updatePassword);
router.put("/changePassword", ShopApiCtrl.changePassword);
router.delete("/delete/:idShop", mdJWT.api_user_auth, ShopApiCtrl.deleteShop);

module.exports = router;
