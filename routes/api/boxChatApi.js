var express = require('express');
// var mdJWT= require('../../middlewares/api.auth');
var boxChatCtrl = require('../../controller/api/boxChat.api');
var mdJWT = require('../../middlewares/api.auth');
var router = express.Router();

// router.get('/list/myFollowing', mdJWT.api_auth , ConversCtrl.myFollowing);
// router.get('/list/following/:idUser', mdJWT.api_auth, FollowCtrl.userFollowing);
router.post('/insert',mdJWT.api_auth, boxChatCtrl.boxChat);
router.get('/listConverts',mdJWT.api_auth, boxChatCtrl.boxChat);
module.exports = router;

