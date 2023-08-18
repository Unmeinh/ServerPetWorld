var express = require('express');
var UserApiCtrl = require('../../controller/api/user.api');
var router = express.Router();

router.get('/', UserApiCtrl.listUser);

router.get('/detail/:idUser', UserApiCtrl.detailUser);

router.post('/register', UserApiCtrl.registUser);
router.post('/login', UserApiCtrl.loginUser);
router.get('/logout', UserApiCtrl.logoutUser);
router.put('/edit/:idUser', UserApiCtrl.editUser);

router.delete('/delete/:idUser',UserApiCtrl.deleteUser);

module.exports = router;
