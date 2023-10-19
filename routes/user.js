var express = require('express');
var UserCtrl = require('../controller/user.controller');
var router = express.Router();
var checkLogin = require('../middlewares/checkLogin');
router.get('/',checkLogin.check_request_login, UserCtrl.listUser);

router.get('/detail/:idUser',checkLogin.check_request_login, UserCtrl.detailUser);//bổ sung /:idUser khi làm 

router.get('/add',checkLogin.check_request_login,UserCtrl.addUser);
router.post('/add',checkLogin.check_request_login, UserCtrl.addUser);

router.get('/delete/:idUser',checkLogin.check_request_login,UserCtrl.deleteUser);//bổ sung /:idUser khi làm 
router.post('/delete/:idUser',checkLogin.check_request_login,UserCtrl.deleteUser);//bổ sung /:idUser khi làm 

module.exports = router;
