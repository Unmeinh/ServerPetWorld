let express = require("express");
let myFavoriteProductsCtrl = require("../../controller/api/myfavoriteproduct.api");
let router = express.Router();
let mdJWT = require("../../middlewares/api.auth");

router.get(
  "/list",
  mdJWT.api_user_auth,
  myFavoriteProductsCtrl.listAllMyFavoriteProducts
);
router.post(
  "/insert",
  mdJWT.api_user_auth,
  myFavoriteProductsCtrl.addFavoriteProducts
);
router.post(
  "/delete",
  mdJWT.api_user_auth,
  myFavoriteProductsCtrl.deleteFavoriteProducts
);

module.exports = router;
