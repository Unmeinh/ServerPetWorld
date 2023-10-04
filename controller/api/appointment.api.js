let mdAppointment = require('../../model/appointment.model');


exports.listAppointment = async (req, res, next) => {
  if (req.method == 'GET') {
      let listAppointment = await mdAppointment.AppointmentModel.find().populate('idShop').populate('idPet').populate('idUser');
      if (listAppointment) {
          return res.status(200).json({ success: true, data: listAppointment, message: 'Lấy danh sách lịch hẹn thành công' });
      }
      else {
          return res.status(500).json({ success: false, data: [], message: 'Không lấy được danh sách lịch hẹn' });
      }
  }
}

function validateAppointmentData(appointmentData) {
  const message = [];

  if (!appointmentData.amountPet || appointmentData.amountPet.trim().length === 0) {
    message.push('Vui lòng không bỏ trống tên voucher!');
  }

  if (!appointmentData.location || appointmentData.location.trim().length === 0) {
    message.push('Vui lòng không bỏ trống discount!');
  }

  if (!appointmentData.deposits || appointmentData.deposits.trim().length === 0 ) {
    message.push('Vui lòng không bỏ trống số tiền tối thiểu!');
  }

  if (!appointmentData.status || appointmentData.status.trim().length === 0) {
    message.push('Vui lòng không bỏ trống !');
  }

  if (!appointmentData.idPet || appointmentData.idPet.trim().length === 0) {
    message.push('Vui lòng không bỏ trống !');
  }

  if (!appointmentData.idShop || appointmentData.idShop.trim().length === 0) {
    message.push('Vui lòng không bỏ trống !');
  }

  if (!appointmentData.idUser || appointmentData.idUser.trim().length === 0) {
    message.push('Vui lòng không bỏ trống !');
  }

  // Kiểm tra các điều kiện khác cần thiết
  return message;
}

exports.addAppointment = async (req, res, next) => {
  let msg = '';
  const appointmentDate = req.body.appointmentDate || new Date();
  const apptErrors = validateAppointmentData(req.body);

  if (apptErrors.length > 0) {
 // Xử lý lỗi nếu có
 return res.status(400).json({  message:apptErrors });
}

  const newObjAppt = new mdAppointment.AppointmentModel();
  newObjAppt.amountPet = req.body.amountPet; 
  newObjAppt.location = req.body.location;
  newObjAppt.deposits = req.body.deposits;
  newObjAppt.status = req.body.status;
  newObjAppt.idPet = req.body.idPet;
  newObjAppt.idUser = req.body.idUser;
  newObjAppt.idShop = req.body.idShop;
  newObjAppt.appointmentDate = appointmentDate ;
  newObjAppt.createdAt = new Date();

  
  // const expirationDate = new Date();
  // expirationDate.setDate(expirationDate.getDate() + 30);// + 30 ngày sau thì hết hạn
  // newObjVoucher.expiedAt = expirationDate;



  try {
    await newObjAppt.save();

    return res.status(200).json({ success: true, data: newObjAppt, message: 'Đặt lịch hẹn thành công!' });
  } catch (error) {
    console.log(error.message);

    msg = error.message;
    return res.status(500).json({ success: false, data: {}, message: msg });
  }
}

exports.editAppointment = async (req, res, next) => {
  let msg = '';
  let idAppt = req.params.idAppt;

  const apptErrors = validateAppointmentData(req.body);

  if (apptErrors.length > 0) {
 // Xử lý lỗi nếu có
 return res.status(400).json({  message:apptErrors });
}

if (!idAppt) {
  return res.status(500).json({
    success: false,
    message: 'idAppt không hợp lệ',
  });
}
  // Lấy thông tin cuộc hẹn hiện tại
  const objAppt = await mdAppointment.AppointmentModel.findById(idAppt);

  // Xử lý PUT
  if (req.method === 'PUT') {
    try {
      // Kiểm tra giá trị trạng thái từ query parameter hoặc req.body
      let status = req.body.status;
      let appointmentStatus = null;

      if (status == 0 || status == 1 || status == 2 || status == 3) {
        appointmentStatus = status;
      }else {
        return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
      }

      // Sửa trường status của đối tượng objAppt
      objAppt.status = appointmentStatus;

      // Lưu lại cuộc hẹn đã sửa
      await objAppt.save();

      msg = 'Đã sửa trạng thái thành công';
      return res.status(200).json({ success: true, message: msg });
    } catch (error) {
      msg = 'Lỗi ' + error.message;
      console.log(error);
      return res.status(500).json({ success: false, data: {}, message: msg });
    }
  }
};

exports.deleteAppointment = async (req, res, next) => {
  let idAppt = req.params.idAppt;

  if (!idAppt) {
    return res.status(500).json({
      success: false,
      message: 'idAppt không hợp lệ',
    });
  }
  if (req.method == 'DELETE') {
      try {
          await mdAppointment.AppointmentModel.findByIdAndDelete(idAppt);
          return res.status(203).json({ success: true, data: {}, message: "Lịch hẹn này không còn tồn tại" });
      } catch (error) {
          return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
      }
  }
}