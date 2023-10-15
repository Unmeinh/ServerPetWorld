var express = require('express');
// var mdJWT= require('../../middlewares/api.auth');
var ConversCtrl = require('../../controller/api/Conversations.api');
var mdJWT = require('../../middlewares/api.auth');
var router = express.Router();

// router.get('/list/myFollowing', mdJWT.api_auth , ConversCtrl.myFollowing);
// router.get('/list/following/:idUser', mdJWT.api_auth, FollowCtrl.userFollowing);
router.post('/insert',mdJWT.api_auth, ConversCtrl.convertS);
router.get('/listConverts',mdJWT.api_auth, ConversCtrl.convertS);
module.exports = router;

