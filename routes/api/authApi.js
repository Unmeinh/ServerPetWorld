var express = require('express');
var AuthApiCtrl = require('../../controller/api/auth.api');
var router = express.Router();
var mdJWT = require('../../middlewares/api.auth');
var multer = require('multer')
var uploader = multer({ dest: './tmp' });

router.post('/photo/checkNSFW', uploader.single("image"), AuthApiCtrl.checkImageNSFW);

module.exports = router;
