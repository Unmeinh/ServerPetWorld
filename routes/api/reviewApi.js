var express = require('express');
var ReviewApiCtrl = require('../../controller/api/review.api');
var mdJWT = require('../../middlewares/api.auth');
var multer = require('multer')
var uploader = multer({ dest: './tmp' });
var router = express.Router();

router.get('/list/product/:idProduct', ReviewApiCtrl.listReviewProduct);

router.post('/insert/:idProduct', mdJWT.api_user_auth,uploader.any(), ReviewApiCtrl.addReview);

module.exports = router;