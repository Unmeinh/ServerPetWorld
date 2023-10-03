var express = require('express');
var appointmentCtrl = require('../../controller/api/Appointment.api');
var router = express.Router();
var mdJWT= require('../../middlewares/api.auth');

router.get('/list',mdJWT.api_auth, appointmentCtrl.listAppointment);

router.post('/insert',mdJWT.api_auth,appointmentCtrl.addAppointment);

router.put('/update/:idAppt',mdJWT.api_auth,appointmentCtrl.editAppointment);

// router.put('/update/:idNotice',mdJWT.api_auth, noticeCtrl.editNotice);

router.delete('/delete/:idAppt',mdJWT.api_auth,appointmentCtrl.deleteAppointment);

module.exports = router;