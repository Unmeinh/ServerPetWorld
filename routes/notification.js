var express = require('express');
var NotificationnCtrl = require('../controller/notification.controller');
var checkLoginServer = require('../middlewares/checkLogin')
var router = express.Router();
const path = require('path');


router.use(express.static(path.join(__dirname, 'public')));


router.get('/',checkLoginServer.check_request_login, NotificationnCtrl.detailUser);
router.post('/create',checkLoginServer.check_request_login, NotificationnCtrl.notificationSc);
router.get('/messages',checkLoginServer.check_request_login, NotificationnCtrl.getChatMessages);

module.exports = router;
