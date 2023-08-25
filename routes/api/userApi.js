var express = require('express');
var UserApiCtrl = require('../../controller/api/user.api');
var router = express.Router();

router.get('/list/all', UserApiCtrl.listUser);

router.get('/detail/:idUser', UserApiCtrl.detailUser);

router.post('/register', UserApiCtrl.registUser);
router.post('/login', UserApiCtrl.loginUser);
router.get('/logout', UserApiCtrl.logoutUser);
router.put('/update/:idUser', UserApiCtrl.editUser);
router.delete('/delete/:idUser',UserApiCtrl.deleteUser);

// router.post('/list/following/:idUser');
// router.post('/list/follower/:idUser');

module.exports = router;
