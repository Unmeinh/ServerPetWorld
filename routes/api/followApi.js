var express = require('express');
// var mdJWT= require('../../middlewares/api.auth');
var FollowCtrl = require('../../controller/api/follow.api');
var router = express.Router();

router.get('/', FollowCtrl.myFollower);

module.exports = router;