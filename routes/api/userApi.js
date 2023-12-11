var express = require('express');
var UserApiCtrl = require('../../controller/api/user.api');
var router = express.Router();
var mdJWT = require('../../middlewares/api.auth');
var multer = require('multer')
var uploader = multer({ dest: './tmp' });

router.get('/list/all', UserApiCtrl.listUser);
router.get('/myDetail', mdJWT.api_user_auth, UserApiCtrl.myDetail);
router.get('/autoLogin', mdJWT.api_user_auth, UserApiCtrl.autoLogin);
router.post('/checkPhoneNumber', UserApiCtrl.checkPhoneNumber);
router.get('/userDetail/:idUser', mdJWT.api_user_auth, UserApiCtrl.detailUser);
router.post('/register', UserApiCtrl.registerUser);
router.post('/login', UserApiCtrl.loginUser);
router.get('/logout', mdJWT.api_user_auth, UserApiCtrl.logoutUser);
router.put('/updateUser', mdJWT.api_user_auth, UserApiCtrl.updateUser);
router.put('/updateAvatar', mdJWT.api_user_auth, uploader.any(), UserApiCtrl.updateAvatar);
router.put('/updateAccount', mdJWT.api_user_auth, UserApiCtrl.updateAccount);
router.put('/updatePassword', mdJWT.api_user_auth, UserApiCtrl.updatePassword);
router.put('/changePassword', UserApiCtrl.changePassword);
router.delete('/deleteEmail', mdJWT.api_user_auth, UserApiCtrl.deleteEmail);
router.delete('/delete/:idUser', UserApiCtrl.deleteUser);
router.post('/sendVerifyEmail', UserApiCtrl.sendVerifyEmail);
router.post('/sendResetPasswordEmail', UserApiCtrl.sendResetPassword);
router.post('/verifyResetPasswordCode', UserApiCtrl.verifyResetCode);

// router.post('/list/following/:idUser');
// router.post('/list/follower/:idUser');
module.exports = router;
