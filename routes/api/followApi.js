var express = require('express');
// var mdJWT= require('../../middlewares/api.auth');
var FollowCtrl = require('../../controller/api/follow.api');
var mdJWT = require('../../middlewares/api.auth');
var router = express.Router();

router.get('/list/myFollowing', mdJWT.api_auth , FollowCtrl.myFollowing);
router.get('/list/myFollower', mdJWT.api_auth , FollowCtrl.myFollower);
router.get('/list/searchFolow', mdJWT.api_auth , FollowCtrl.searchMyFollowing);
router.get('/list/following/:idUser', mdJWT.api_auth, FollowCtrl.userFollowing);
router.get('/list/follower/:idUser', mdJWT.api_auth, FollowCtrl.userFollower);
router.post('/insert', mdJWT.api_auth, FollowCtrl.insertFollow);

module.exports = router;
