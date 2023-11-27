var express = require("express");
var serverController = require("../../controller/server.controller");
var mdJWT = require("../../middlewares/api.auth");
var router = express.Router();

router.get(
  "/payments",
  mdJWT.api_user_auth,
  serverController.getPaymentMethods
);

router.get("/listBanner", mdJWT.api_user_auth, serverController.Listbanner);

module.exports = router;
