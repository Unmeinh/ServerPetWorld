var express = require('express');
var UserApiCtrl = require('../../controller/api/user.api');
var router = express.Router();
var mdJWT = require('../../middlewares/api.auth');

router.get('/list/all', UserApiCtrl.listUser);
router.get('/myDetail', mdJWT.api_auth, UserApiCtrl.myDetail);
router.get('/autoLogin', mdJWT.api_auth, UserApiCtrl.autoLogin);
router.post('/checkPhoneNumber', UserApiCtrl.checkPhoneNumber);
router.get('/userDetail/:idUser', mdJWT.api_auth, UserApiCtrl.detailUser);
router.post('/register', UserApiCtrl.registerUser);
router.post('/login', UserApiCtrl.loginUser);
router.get('/logout', UserApiCtrl.logoutUser);
router.put('/updateInfo', mdJWT.api_auth, UserApiCtrl.updateInfo);
router.put('/updatePassword', mdJWT.api_auth, UserApiCtrl.updatePassword);
router.put('/changePassword', UserApiCtrl.changePassword);
router.delete('/delete/:idUser', UserApiCtrl.deleteUser);
router.post('/sendVerifyEmail', UserApiCtrl.sendVerifyEmail);
router.post('/sendResetPasswordEmail', UserApiCtrl.sendResetPassword);
router.post('/verifyResetPasswordCode', UserApiCtrl.verifyResetCode);

// router.post('/list/following/:idUser');
// router.post('/list/follower/:idUser');
module.exports = router;
