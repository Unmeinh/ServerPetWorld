let mdAppointment = require('../../model/appointment.model');

exports.listAppointment = async (req, res, next) => {
  if (req.method == 'GET') {
    let listCheck = await mdAppointment.AppointmentModel.find({ idUser: req.user._id });
    for (let i = 0; i < listCheck.length; i++) {
      const appointment = listCheck[i];
      if (new Date(appointment.appointmentDate) < new Date() && appointment.status == 0) {
        appointment.status = "2";
        await mdAppointment.AppointmentModel.findByIdAndUpdate(appointment._id, appointment);
      }
    }
    let listAppointment = await mdAppointment.AppointmentModel.aggregate([
      {
        $match: {
          idUser: req.user._id
        }
      },
      { $sort: { appointmentDate: -1 } },
      {
        $lookup: {
          from: "Pets",
          localField: "idPet",
          foreignField: "_id",
          as: "iPet"
        }
      },
      {
        $lookup: {
          from: "User",
          localField: "idUser",
          foreignField: "_id",
          as: "iUser"
        }
      },
      {
        $lookup: {
          from: "Shop",
          localField: "idShop",
          foreignField: "_id",
          as: "iShop"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$appointmentDate" },
            month: { $month: "$appointmentDate" }
          },
          appointments: {
            $push: {
              _id: "$_id",
              idPet: "$iPet",
              idUser: "$iUser",
              idShop: "$iShop",
              amountPet: "$amountPet",
              location: "$location",
              deposits: "$deposits",
              status: "$status",
              appointmentDate: "$appointmentDate",
              createdAt: "$createdAt"
            }
          }
        }
      },
      { $project: { _id: '$_id', appointments: '$appointments' } },
      { $sort: { _id: -1 } },
    ]);
    if (listAppointment) {
      return res.status(200).json({ success: true, data: listAppointment, message: 'Lấy danh sách lịch hẹn thành công.' });
    } else {
      return res.status(500).json({ success: false, data: [], message: 'Không lấy được danh sách lịch hẹn' });
    }
  }
}

exports.detailAppointment = async (req, res, next) => {
  if (req.method == 'GET') {
    let appointment = await mdAppointment.AppointmentModel.findById(req.params.idAppt).populate('idShop').populate('idPet').populate('idUser');
    if (appointment) {
      if (appointment != {}) {
        if (new Date(appointment.appointmentDate) < new Date() && appointment.status == 0) {
          appointment.status = 2;
          await mdAppointment.AppointmentModel.findByIdAndUpdate(appointment._id, appointment);
          return res.status(200).json({ success: true, data: appointment, message: 'Lấy lịch hẹn thành công.' });
        }
      }
      return res.status(200).json({ success: true, data: appointment, message: 'Lấy lịch hẹn thành công.' });
    } else {
      return res.status(500).json({ success: false, data: {}, message: 'Không lấy được lịch hẹn' });
    }
  }
}

exports.addAppointment = async (req, res, next) => {
  try {
    let { amountPet, location, deposits, appointmentDate, idPet, idShop } = req.body;
    if (req.method == "POST") {
      if (amountPet && location && deposits && appointmentDate && idPet && idShop) {
        let listApm = await mdAppointment.AppointmentModel.find({ idPet: idPet, idUser: req.user._id })
        if (listApm && listApm.length > 0) {
          let last = listApm.length - 1;
          if (listApm[last].status == "-1" || listApm[last].status == "0") {
            return res.status(201).json({ success: false, data: {}, message: "Thú cưng này đang có lịch hẹn!" });
          }
        }

        const newObjAppt = new mdAppointment.AppointmentModel();
        newObjAppt.amountPet = amountPet;
        newObjAppt.location = location;
        newObjAppt.deposits = deposits;
        newObjAppt.status = "-1";
        newObjAppt.idPet = idPet;
        newObjAppt.idUser = req.user._id;
        newObjAppt.idShop = idShop;
        newObjAppt.appointmentDate = appointmentDate;
        newObjAppt.createdAt = new Date();

        await newObjAppt.save();
        return res.status(201).json({ success: true, data: newObjAppt, message: 'Đặt lịch hẹn thành công.' });
      } else {
        return res.status(500).json({ success: false, data: {}, message: "Không đọc được giữ liệu tải lên!" });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, data: {}, message: error.message });
  }
}

exports.editAppointment = async (req, res, next) => {
  try {
    let { status, idAppt } = req.body;
    if (req.method == "PUT") {
      if (status && idAppt) {
        const objAppt = await mdAppointment.AppointmentModel.findById(idAppt);
        if (!objAppt) {
          return res.status(500).json({ success: false, message: 'Không tìm thấy lịch hẹn.' });
        }

        if (status == "0" || status == "1" || status == "2" || status == "3") {
          objAppt.status = status;
          let mes = "";
          switch (status) {
            case "0":
              mes = "Đổi trạng thái thành đang hẹn thành công."
              break;
            case "1":
              mes = "Đổi trạng thái thành đã hẹn thành công."
              break;
            case "2":
              mes = "Đổi trạng thái thành lỡ hẹn thành công."
              break;
            case "3":
              mes = "Hủy hẹn thành công."
              break;

            default:
              break;
          }

          await mdAppointment.AppointmentModel.findByIdAndUpdate(idAppt, objAppt);
          return res.status(201).json({ success: true, data: objAppt, message: mes });
        } else {
          return res.status(500).json({ success: false, message: 'Trạng thái không hợp lệ.' });
        }
      } else {
        return res.status(500).json({ success: false, data: {}, message: "Không đọc được giữ liệu tải lên!" });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, data: {}, message: error.message });
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    let { idAppt } = req.params;
    if (req.method == "DELETE") {
      if (idAppt) {
        const objAppt = await mdAppointment.AppointmentModel.findById(idAppt);
        if (!objAppt) {
          return res.status(500).json({ success: false, message: 'Không tìm thấy lịch hẹn.' });
        }

        await mdAppointment.AppointmentModel.findByIdAndDelete(idAppt);
        return res.status(203).json({ success: true, data: {}, message: 'Xóa lịch hẹn thành công.' });
      } else {
        return res.status(500).json({ success: false, data: {}, message: "Không đọc được giữ liệu tải lên!" });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, data: {}, message: error.message });
  }
}
