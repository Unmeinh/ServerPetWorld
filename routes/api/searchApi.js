var express = require("express");
var mdJWT = require("../../middlewares/api.auth");
var SearchController = require("../../controller/api/searchApi");
var router = express.Router();

router.get("/:name", mdJWT.api_user_auth, SearchController.searchApi);

router.get("/shop/:name", mdJWT.api_user_auth, SearchController.searchShop);
module.exports = router;
