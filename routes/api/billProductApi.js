var express = require("express");
var billProductApiCtrl = require("../../controller/api/billProduct.api");
var mdJWT = require("../../middlewares/api.auth");
var router = express.Router();
router.get(
  "/listBillProduct",
  mdJWT.api_user_auth,
  billProductApiCtrl.listbillProduct
);
router.get(
  "/detailBillProduct/:idBillPr",
  mdJWT.api_user_auth,
  billProductApiCtrl.detailBillProduct
);
router.post("/insert", mdJWT.api_user_auth, billProductApiCtrl.billProductUser);
router.get(
  "/cancelBill/:id",
  mdJWT.api_user_auth,
  billProductApiCtrl.cancelBill
);
router.get("/getCount", mdJWT.api_user_auth, billProductApiCtrl.getCountBill);
//router.post('/edit',mdJWT.api_user_auth, billProductApiCtrl.editCart);

module.exports = router;
