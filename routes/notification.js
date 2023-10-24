var express = require('express');
var NotificationnCtrl = require('../controller/notification.controller');
var router = express.Router();
const path = require('path');


router.use(express.static(path.join(__dirname, 'public')));

// Định nghĩa các route
router.get('/', NotificationnCtrl.detailUser);
router.post('/create', NotificationnCtrl.notificationSc);
router.get('/messages', NotificationnCtrl.getChatMessages);

module.exports = router;
