var express = require('express');
var appointmentCtrl = require('../../controller/api/Appointment.api');
var router = express.Router();
var mdJWT= require('../../middlewares/api.auth');

router.get('/list',mdJWT.api_auth, appointmentCtrl.listAppointment);

router.get('/detail/:idAppt',mdJWT.api_auth, appointmentCtrl.detailAppointment);

router.post('/insert',mdJWT.api_auth,appointmentCtrl.addAppointment);

router.put('/update/:idAppt',mdJWT.api_auth,appointmentCtrl.editAppointment);
//phân chia hẹn theo tháng, trả về cần check thời gian xem quá hẹn chưa

// router.put('/update/:idNotice',mdJWT.api_auth, noticeCtrl.editNotice);

router.delete('/delete/:idAppt',mdJWT.api_auth,appointmentCtrl.deleteAppointment);

module.exports = router;