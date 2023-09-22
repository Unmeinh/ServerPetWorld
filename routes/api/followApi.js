var express = require('express');
var mdJWT = require('../../middlewares/api.auth');
var FollowCtrl = require('../../controller/api/follow.api');
var router = express.Router();

router.get('/myFollower', mdJWT.api_auth, FollowCtrl.myFollower);

router.get('/myFollowing/:idUser', mdJWT.api_auth, FollowCtrl.myFollowing);

router.post('/addFollowing/:idUser', mdJWT.api_auth, FollowCtrl.addFollowing);

router.delete('/deleteFollowing/:idUser', mdJWT.api_auth, FollowCtrl.deleteFollowing);
module.exports = router;