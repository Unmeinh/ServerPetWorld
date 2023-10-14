var express = require('express');
var appointmentCtrl = require('../../controller/api/Appointment.api');
var mdJWT = require('../../middlewares/api.auth');
var router = express.Router();

router.get('/list', mdJWT.api_user_auth, appointmentCtrl.listAppointment);

router.get('/detail/:idAppt', mdJWT.api_user_auth, appointmentCtrl.detailAppointment);

router.post('/insert', mdJWT.api_user_auth, appointmentCtrl.addAppointment);

router.put('/update', mdJWT.api_user_auth, appointmentCtrl.editAppointment);

router.delete('/delete/:idAppt', mdJWT.api_user_auth, appointmentCtrl.deleteAppointment);

module.exports = router;