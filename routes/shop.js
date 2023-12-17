var express = require("express");
var ShopCtrl = require("../controller/shop.controller");
var multer = require("multer");
var uploader = multer({ dest: "./tmp" });
var checkLogin = require("../middlewares/checkLogin");
var router = express.Router();

router.get("/", checkLogin.check_request_login, ShopCtrl.listShop);

router.get(
  "/detail/:idShop",
  checkLogin.check_request_login,
  ShopCtrl.detailShop
);
router.get(
  "/detailOwner/:idShop",
  checkLogin.check_request_login,
  ShopCtrl.detailOwner
);

router.get(
  "/delete/:idShop",
  checkLogin.check_request_login,
  ShopCtrl.updateHideShopStatus
);
router.post(
  "/delete/:idShop",
  checkLogin.check_request_login,
  ShopCtrl.updateHideShopStatus
);

router.get(
  "/confirm",
  checkLogin.check_request_login,
  ShopCtrl.listShopConfirm
);
router.get(
  "/update/:idShop",
  checkLogin.check_request_login,
  ShopCtrl.updateShopStatus
);
router.post(
  "/update/:idShop",
  checkLogin.check_request_login,
  ShopCtrl.updateShopStatus
);

module.exports = router;
