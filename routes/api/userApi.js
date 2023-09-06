var express = require('express');
var UserApiCtrl = require('../../controller/api/user.api');
var router = express.Router();
var mdJWT= require('../../middlewares/api.auth');

router.get('/list/all',mdJWT.api_auth, UserApiCtrl.listUser);
router.get('/myDetail',mdJWT.api_auth, UserApiCtrl.myDetail);
router.get('/token/:token', UserApiCtrl.getFromToken);
router.get('/userDetail/:idUser',mdJWT.api_auth, UserApiCtrl.detailUser);
router.post('/register', UserApiCtrl.registUser);
router.post('/login',mdJWT.api_auth, UserApiCtrl.loginUser);
router.get('/logout', UserApiCtrl.logoutUser);
router.put('/update/:idUser',mdJWT.api_auth, UserApiCtrl.editUser);
router.delete('/delete/:idUser',UserApiCtrl.deleteUser);

// router.post('/list/following/:idUser');
// router.post('/list/follower/:idUser');

module.exports = router;
