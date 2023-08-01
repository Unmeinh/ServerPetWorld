let mdUser = require('../../model/user.model');
let bcrypt = require('bcrypt');
exports.listUser = async (req, res, next) => {

  try {
    let listUser = await mdUser.UserModel.find();
    if (listUser) {
      return res.status(200).json({ success: true, data: listUser, message: "Lấy danh sách user thành công" });
    }
    else {
      return res.status(203).json({ success: false, message: "Không có dữ liệu" });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
exports.detailUser = async (req, res, next) => {


  let idUser = req.params.idUser;
  try {
    let objU = await mdUser.UserModel.findById({ _id: idUser });
    return res.status(200).json({ success: true, data: objU, message: "Lấy dữ liệu user thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi: " + error.message });
  }

}
exports.registUser = async (req, res, next) => {
  if (req.method == 'POST') {

    try {
      let newUser = new mdUser.UserModel();
      newUser.usernameUser = req.body.usernameUser;
      newUser.phoneNumber = req.body.phoneNumber;

      const salt = await bcrypt.genSalt(10);
      newUser.passwordUser = await bcrypt.hash(req.body.passwordUser, salt);
      await newUser.generateAuthToken();

      await newUser.save();
      return res.status(201).json({ success: true, data: newUser, message: "Đăng kí tài khoản thành công" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Đăng kí thất bại " + error.message });

    }
  }
}
exports.loginUser = async (req, res, next) => {
  if (req.method == 'POST') {
    try {
      let objU = await mdUser.UserModel.findByCredentials(req.body.usernameUser, req.body.passwordUser);
      if (!objU) {
        return res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' })
      }
      const token = await objU.generateAuthToken();
      return res.status(200).json({ success: true, data: objU, token: token , message: "Đăng nhập thành công"});

    } catch (error) {
      // console.log(error.message);
      return res.status(500).json({
        success: false,
        obj:[],
        message:'Đăng nhập không thanh công',
      });
    }
  }
}
exports.editUser = async (req, res, next) => {
  let idUser = req.params.idUser;
  if (req.method == 'PUT') {
    // try {
    //   let newUser = new mdUser.UserModel(req.body);

    //   await mdUser.UserModel.findByIdAndUpdate(idUser, newUser);
    //   return res.status(200).json({ success: true, msg: "Cập nhật thành công" });
    // } catch (error) {
    //   return res.status(500).json({ success: false, msg: "Lỗi: " + error.message });
    // }
  }
}
exports.deleteUser = async (req, res, next) => {
  let idUser = req.params.idUser;
  if (req.method == 'DELETE') {
    try {
      await mdUser.UserModel.findByIdAndDelete({ _id: idUser });
      return res.status(203).json({ success: true, message: "Tài khoản này không còn tồn tại" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Lỗi: " + error.message });
    }
  }
}