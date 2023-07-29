var express = require('express');
var UserCtrl = require('../controller/user.controller');
var router = express.Router();

router.get('/', UserCtrl.listUser);

router.get('/detail', UserCtrl.detailUser);//bổ sung /:idUser khi làm 

router.get('/add',UserCtrl.addUser);
router.post('/add', UserCtrl.addUser);

router.get('/edit', UserCtrl.editUser);//bổ sung /:idUser khi làm 
router.put('/edit', UserCtrl.editUser);//bổ sung /:idUser khi làm 

router.get('/delete',UserCtrl.deleteUser);//bổ sung /:idUser khi làm 
router.delete('/delete',UserCtrl.deleteUser);//bổ sung /:idUser khi làm 

module.exports = router;
