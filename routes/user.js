var express = require('express');
var UserCtrl = require('../controller/user.controller');

var router = express.Router();

router.get('/', UserCtrl.listUser);

router.get('/detail/:idUser', UserCtrl.detailUser);//bổ sung /:idUser khi làm 

router.get('/add',UserCtrl.addUser);
router.post('/add', UserCtrl.addUser);

router.get('/delete/:idUser',UserCtrl.deleteUser);//bổ sung /:idUser khi làm 
router.post('/delete/:idUser',UserCtrl.deleteUser);//bổ sung /:idUser khi làm 

module.exports = router;
