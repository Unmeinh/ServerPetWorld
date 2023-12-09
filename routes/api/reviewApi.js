let express = require("express");
let ReviewApiCtrl = require("../../controller/api/review.api");
let mdJWT = require("../../middlewares/api.auth");
let multer = require("multer");
let uploader = multer({ dest: "./tmp" });
let router = express.Router();

router.get("/list/product/:idProduct", ReviewApiCtrl.listReviewProduct);

router.post(
  "/insert/:idBill",
  mdJWT.api_user_auth,
  uploader.any(),
  ReviewApiCtrl.addReview
);

module.exports = router;
