let mdUser = require('../../model/user.model');
let bcrypt = require('bcrypt');
exports.listUser = async (req, res, next) => {

  try {
    let listUser = await mdUser.UserModel.find();
    if (listUser) {
      return res.status(200).json({ success: true, data: listUser, message: "Lấy danh sách người dùng thành công" });
    }
    else {
      return res.status(203).json({ success: false, message: "Không có dữ liệu người dùng" });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
exports.detailUser = async (req, res, next) => {
  let idUser = req.params.idUser;
  try {
    let objU = await mdUser.UserModel.findById(idUser);
    return res.status(200).json({ success: true, data: objU, message: "Lấy dữ liệu users thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }

}
exports.registUser = async (req, res, next) => {
  if (req.method == 'POST') {

    try {
      let newUser = new mdUser.UserModel();
      newUser.userName = req.body.userName;
      newUser.phoneNumber = req.body.phoneNumber;
      newUser.createAt = new Date();
      newUser.avatarUser='https://i.pinimg.com/564x/0c/a6/ec/0ca6ecf671331f3ca3bbee9966359e32.jpg';
      const salt = await bcrypt.genSalt(10);
      newUser.passWord = await bcrypt.hash(req.body.passWord, salt);
      await newUser.generateAuthToken();
      
      await newUser.save();
      return res.status(201).json({ success: true, data: newUser, message: "Đăng kí tài khoản thành công" });
    } catch (error) {
      return res.status(500).json({ success: false, data: {}, message:  error.message });

    }
  }
}
exports.loginUser = async (req, res, next) => {
  if (req.method == 'POST') {
    try {
      let objU = await mdUser.UserModel.findByCredentials(req.body.userName, req.body.passWord);
      console.log('objU login '+objU);
      if (!objU) {
        return res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập' })
      }
      // const token = await objU.generateAuthToken();
      return res.status(200).json({ success: true, data: {}, token: objU.token, message: "Đăng nhập thành công" });

    } catch (error) {
      console.error('err: ' + error.message);
 
      return res.status(500).json({
        success: false,
        data: {},
        message:  error.message,
      });
    }
  }
}

exports.logoutUser = async (req, res, next) => {
  try {
    console.log(req.user);

    req.user.token = null; //xóa token
    await req.user.save()
    return res.status(200).json({ success: true, data: {}, message: 'Đăng xuất thành công' });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message)
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
      return res.status(203).json({ success: true,data:{}, message: "Tài khoản này đã không còn tồn tại" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Lỗi rồi: " + error.message });
    }
  }
}