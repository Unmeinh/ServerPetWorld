var express = require('express');
var UserCtrl = require('../controller/user.controller');
var router = express.Router();
var checkLogin = require('../middlewares/checkLogin');
router.get('/',checkLogin.check_request_login, UserCtrl.listUser);

router.get('/detail/:idUser',checkLogin.check_request_login, UserCtrl.detailUser); 

router.get('/add',checkLogin.check_request_login,UserCtrl.addUser);
router.post('/add',checkLogin.check_request_login, UserCtrl.addUser);

router.get('/delete/:idUser',checkLogin.check_request_login,UserCtrl.deleteUser);
router.post('/delete/:idUser',checkLogin.check_request_login,UserCtrl.deleteUser);

module.exports = router;
