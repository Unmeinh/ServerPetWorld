var express = require('express');
var UserCtrl = require('../controller/user.controller');
var router = express.Router();

router.get('/', UserCtrl.listUser);

router.get('/detail/:idUser', UserCtrl.detailUser);

router.get('/add',UserCtrl.addUser);
router.post('/add', UserCtrl.addUser);

router.get('/edit/:idUser', UserCtrl.editUser);
router.put('/edit/:idUser', UserCtrl.editUser);

router.get('/delete/:idUser',UserCtrl.deleteUser);
router.delete('/delete/:idUser',UserCtrl.deleteUser);

module.exports = router;
