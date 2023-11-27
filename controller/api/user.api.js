let mdUser = require("../../model/user.model").UserModel;
let mdUserAccount = require("../../model/userAccount.model").UserAccountModel;
let bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const OTPEmailModel = require("../../model/otpemail.model").OTPEmailModel;
const otpGenerator = require("otp-generator");
let { encodeToSha256 } = require("../../function/hashFunction");
const { onUploadImages } = require("../../function/uploadImage");

exports.listUser = async (req, res, next) => {
  try {
    let listUser = await mdUser.find().populate('idAccount');

    if (listUser) {
      return res.status(200).json({
        success: true,
        data: listUser,
        message: "Lấy danh sách người dùng thành công",
      });
    } else {
      return res
        .status(203)
        .json({ success: false, message: "Không có dữ liệu người dùng" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.myDetail = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
      message: "Lấy dữ liệu của bạn thành công",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.autoLogin = async (req, res, next) => {
  try {
    req.account.online = 0;
    await mdUserAccount.findByIdAndUpdate(req.account._id, req.account);
    return res.status(200).json({ success: true, data: req.user, message: "Đăng nhập thành công." });
  } catch (error) {
    return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.checkPhoneNumber = async (req, res, next) => {
  try {
    let objU = await mdUserAccount.findOne({ phoneNumber: req.body.phoneNumber });
    if (!objU) {
      return res.status(201).json({ success: true, data: objU, message: "Số điện thoại chưa được đăng ký." });
    } else {
      return res.status(201).json({ success: false, data: objU, message: "Số điện thoại đã được đăng ký." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.detailUser = async (req, res, next) => {
  let idUser = req.params.idUser;
  try {
    let objU = await mdUser.findById(idUser).populate('idAccount');
    if (objU) {
      let isFollowed = objU.followers.find((follow) => String(follow.idFollow) == String(req.user._id))
      if (isFollowed) {
        return res.status(200).json({
          success: true,
          data: {
            ...objU.toObject(),
            isFollowed: true
          },
          message: "Lấy dữ liệu của người dùng khác thành công",
        });
      } else {
        return res.status(200).json({
          success: true,
          data: {
            ...objU.toObject(),
            isFollowed: false
          },
          message: "Lấy dữ liệu của người dùng khác thành công",
        });
      }
    } else {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Không tải được dữ liệu người dùng!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.registerUser = async (req, res, next) => {
  if (req.method == "POST") {
    try {
      let newUser = new mdUser();
      let newAccount = new mdUserAccount();
      newUser.idAccount = newAccount._id;
      newAccount.idUser = newUser._id;
      newAccount.userName = req.body.userName;
      newAccount.phoneNumber = req.body.phoneNumber;
      newAccount.isVerifyPhoneNumber = 0;
      newAccount.createAt = new Date();
      newAccount.online = 1;
      newAccount.status = 0;
      newAccount.emailAddress = "";
      const salt = await bcrypt.genSalt(10);
      newAccount.passWord = await bcrypt.hash(req.body.passWord, salt);
      await newAccount.generateAuthToken(newAccount);
      newUser.fullName = req.body.fullName;
      newUser.avatarUser =
        "https://i.pinimg.com/564x/0c/a6/ec/0ca6ecf671331f3ca3bbee9966359e32.jpg";
      newUser.nickName = "";
      newUser.description = "";
      newUser.birthday = new Date();
      newUser.locationUser = "";
      newUser.locationDelivery = [];
      newUser.blogs = 0;
      newUser.followers = [];
      newUser.followings = [];
      newUser.myPet = [];
      await newUser.save();
      await newAccount.save();
      return res.status(201).json({
        success: true,
        data: newUser,
        message: "Đăng kí tài khoản thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: {}, message: error.message });
    }
  }
};

exports.loginUser = async (req, res, next) => {
  if (req.method == "POST") {
    try {
      let objU = await mdUserAccount.findByCredentials(
        req.body.userName,
        req.body.passWord
      );
      if (!objU) {
        return res
          .status(201)
          .json({ success: false, message: "Sai thông tin đăng nhập!" });
      }
      objU.online = 0;
      await mdUserAccount.findByIdAndUpdate(objU._id, objU);
      console.log("token: " + objU.token,);
      return res.status(201).json({
        success: true,
        data: {},
        token: objU.token,
        message: "Đăng nhập thành công.",
      });
    } catch (error) {
      console.error("err: " + error.message);

      return res.status(500).json({
        success: false,
        data: {},
        message: error.message,
      });
    }
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    console.log(req.user);

    req.user.token = null; //xóa token
    await req.user.save();
    return res
      .status(200)
      .json({ success: true, data: {}, message: "Đăng xuất thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.updateUser = async (req, res, next) => {
  if (req.method == "PUT") {
    if (req.body.typeInfo) {
      try {
        switch (req.body.typeInfo) {
          case "fullName":
            req.user.fullName = req.body.valueUpdate;
            await mdUser.findByIdAndUpdate(req.user._id, req.user);
            break;
          case "nickName":
            req.user.nickName = req.body.valueUpdate;
            await mdUser.findByIdAndUpdate(req.user._id, req.user);
            break;
          case "birthday":
            req.user.birthday = req.body.valueUpdate;
            await mdUser.findByIdAndUpdate(req.user._id, req.user);
            break;
          case "locationUser":
            req.user.locationUser = req.body.valueUpdate;
            await mdUser.findByIdAndUpdate(req.user._id, req.user);
            break;
          case "description":
            req.user.description = req.body.valueUpdate;
            await mdUser.findByIdAndUpdate(req.user._id, req.user);
            break;

          default:
            break;
        }
        return res.status(201).json({ success: true, data: {}, message: "Cập nhật dữ liệu thành công " });
      } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
      }
    } else {
      return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên! " });
    }
  }
};

exports.updateAvatar = async (req, res, next) => {
  if (req.method == "PUT") {
    try {
      let result = await onUploadImages(req.files, "user");
      if (result != []) {
        req.user.avatarUser = result[0];
        await mdUser.findByIdAndUpdate(req.user._id, req.user)
        return res.status(201).json({ success: true, data: {}, message: "Cập nhật ảnh đại diện thành công." });
      } else {
        return res.status(201).json({ success: false, data: {}, message: "Không có ảnh tải lên!" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
};

exports.updateAccount = async (req, res, next) => {
  if (req.method == "PUT") {
    if (req.body.typeInfo) {
      try {
        switch (req.body.typeInfo) {
          case "phoneNumber":
            req.account.phoneNumber = req.body.valueUpdate;
            req.account.isVerifyPhoneNumber = 0;
            await mdUserAccount.findByIdAndUpdate(req.account._id, req.account);
            return res.status(201).json({ success: true, data: {}, message: "Cập nhật dữ liệu thành công!" });
          case "emailAddress":
            req.account.emailAddress = req.body.valueUpdate;
            req.account.isVerifyEmail = 1;
            await mdUserAccount.findByIdAndUpdate(req.account._id, req.account);
            let encode = encodeToSha256(req.body.valueUpdate);
            let linkVerify = "https://0732-2402-800-61c4-c98-dcce-9914-21bc-1dd3.ngrok-free.app/account/verifyEmail/" + encode;
            await sendEmailLink(req.body.valueUpdate, linkVerify, res);
            return res.status(201).json({ success: true, data: {}, message: "Cập nhật dữ liệu thành công!" });

          default:
            break;
        }
      } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
      }
    } else {
      return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên! " });
    }
  }
};

exports.deleteEmail = async (req, res, next) => {
  if (req.method == "DELETE") {
    try {
      req.account.emailAddress = "Chưa thiết lập";
      req.account.isVerifyEmail = 1;
      await mdUserAccount.findByIdAndUpdate(req.account._id, req.account);
      return res.status(203).json({
        success: true,
        data: {},
        message: "Hủy liên kết email thành công.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi: " + error.message });
    }
  }
};

exports.deleteUser = async (req, res, next) => {
  let idUser = req.params.idUser;
  if (req.method == "DELETE") {
    try {
      await mdUser.findByIdAndDelete({ _id: req.user._id });
      await mdUserAccount.findByIdAndDelete({ _id: req.account._id });
      return res.status(203).json({
        success: true,
        data: {},
        message: "Tài khoản này đã không còn tồn tại",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi rồi: " + error.message });
    }
  }
};

exports.updatePassword = async (req, res, next) => {
  if (req.method == "PUT") {
    let { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword || !req.body) {
      return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên!" });
    }
    const isPasswordMatch = await bcrypt.compare(oldPassword, req.account.passWord);
    if (!isPasswordMatch) {
      return res.status(201).json({ success: false, data: {}, message: "Mật khẩu hiện tại nhập sai!" });
    }
    req.account.passWord = newPassword;
    try {
      await mdUserAccount.findByIdAndUpdate(req.account._id, req.account);
      return res.status(201).json({ success: true, data: {}, message: "Đổi mật khẩu thành công. " });
    } catch (error) {
      return res.status(201).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
};

exports.changePassword = async (req, res, next) => {
  if (req.method == "PUT") {
    var body = req.body;
    if (body.typeUpdate && body.valueUpdate && body.newPassword) {
      try {
        let account = {};
        if (body.typeUpdate == 'email') {
          account = await mdUserAccount.findOne({ emailAddress: body.valueUpdate });
        } else {
          account = await mdUserAccount.findOne({ phoneNumber: body.valueUpdate });
        }
        const salt = await bcrypt.genSalt(10);
        account.passWord = await bcrypt.hash(body.newPassword, salt);
        await mdUserAccount.findByIdAndUpdate(account._id, account);
        return res.status(201).json({ success: true, data: {}, message: "Đổi mật khẩu thành công." });
      } catch (error) {
        console.log(error);
        return res.status(201).json({ success: false, data: {}, message: "Lỗi: " + error.message });
      }
    } else {
      return res.status(500).json({ success: false, data: {}, message: "Đổi mật khẩu thất bại, không nhận được dữ liệu mật khẩu mới! " });
    }
  }
};

exports.sendVerifyEmail = async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.email != undefined) {
      var data = await mdUserAccount.find({ emailAddress: req.body.email });
      if (data.length > 0) {
        if (data[0].isVerifyEmail == 1) {
          let encode = encodeToSha256(req.body.email);
          let linkVerify = "https://0732-2402-800-61c4-c98-dcce-9914-21bc-1dd3.ngrok-free.app/account/verifyEmail/" + encode;
          await sendEmailLink(req.body.email, linkVerify, res);
        } else {
          return res
            .status(201)
            .json({ success: false, data: {}, message: "Email của bạn đã được xác minh!" });
        }
      } else {
        return res
          .status(201)
          .json({ success: false, data: {}, message: "Không tìm thấy tài khoản có email trên!" });
      }
    }
  }
};

exports.sendResetPassword = async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.email != undefined) {
      var data = await mdUserAccount.find({ emailAddress: req.body.email });
      if (data.length > 0) {
        if (data[0].isVerifyEmail == 0) {
          var data = await OTPEmailModel.find({ email: req.body.email });
          var newOTP = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });
          await sendEmailOTP(req.body.email, newOTP, data, res);
        } else {
          return res
            .status(201)
            .json({ success: false, data: {}, message: "Email của bạn chưa được xác minh!" });
        }
      } else {
        return res
          .status(500)
          .json({ success: false, data: {}, message: "Không tìm thấy tài khoản có email trên!" });
      }
    }
  }
};

exports.verifyResetCode = async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.email != undefined && req.body.otp != undefined) {
      var data = await OTPEmailModel.find({ email: req.body.email });
      if (data.length > 0) {
        if (data[0].code == Number(req.body.otp)) {
          var timeBetween =
            (new Date().getTime() - new Date(data[0].createAt).getTime()) /
            1000;
          // console.log(date + "s");
          // console.log((date / 60) + "min");
          // console.log(new Date() - new Date(data[0].createAt));
          if (timeBetween / 60 >= 5) {
            return res.status(201).json({
              success: false,
              data: {},
              message: "Mã xác minh quá hạn!",
            });
          } else {
            await OTPEmailModel.findByIdAndDelete(data[0]._id);
            return res.status(201).json({
              success: true,
              data: {},
              message: "Xác minh thành công!",
            });
          }
        } else {
          return res
            .status(500)
            .json({ success: false, data: {}, message: "Mã xác minh sai!" });
        }
      } else {
        return res.status(500).json({
          success: false,
          data: {},
          message: "Mã xác minh sai hoặc không tồn tại trong cơ sở dữ liệu",
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message: "OTP sai hoặc không tồn tại trong cơ sở dữ liệu",
      });
    }
  }
};

async function sendEmailLink(email, link, res) {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "petworld.server.email@gmail.com",
      pass: "rrcn tlju vwab vgts",
      // pass: 'Lorem1000.-.. --- .-. . -- .---- ----- ----- -----'
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var content = "";
  content += `
      <div style="padding: 7px; background-color: #003375; border-radius: 7px;">
          <div style="padding: 10px; background-color: white; border-radius: 7px;">
              <p>Xin chào!</p>
              <p>Bấm vào link dưới đây để xác minh email của bạn.</p>
              <p>${link}</p>
              <p>Nếu bạn không yêu cầu xác minh email nữa, bạn có thể bỏ qua email này.</p>
              <p>Cảm ơn bạn!</p>
              <img src="cid:logo1" alt="logo-petworld.png"
                  width="200" height="auto" />
          </div>
      </div>
  `;
  var mainOptions = {
    from: {
      name: "noreply@petworld-server.serverapp.com",
      address: "petworld.server.email@gmail.com",
    },
    to: email,
    subject: "Xác minh email của bạn cho Petworld",
    text:
      "Xin chào! Bấm vào link dưới đây để xác minh email của bạn. " +
      link,
    html: content,
    attachments: [
      {
        filename: "logo.jpg",
        path: `public/upload/logo-darktheme.png`,
        cid: "logo1",
      },
    ],
  };
  transporter.sendMail(mainOptions, async function (err, info) {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Link xác minh email gửi thất bại!" });
    } else {
      console.log("Message sent: " + info.response);
      return res
        .status(201)
        .json({ success: true, data: {}, message: "Link xác minh email đã được gửi." });
    }
  });
}

async function sendEmailOTP(email, otp, data, res) {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "petworld.server.email@gmail.com",
      pass: "rrcn tlju vwab vgts",
      // pass: 'Lorem1000.-.. --- .-. . -- .---- ----- ----- -----'
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var content = "";
  content += `
      <div style="padding: 7px; background-color: #003375; border-radius: 7px;">
          <div style="padding: 10px; background-color: white; border-radius: 7px;">
              <p>Xin chào!</p>
              <p>Mã xác minh đặt lại mật khẩu của bạn là ${otp}.</p>
              <p>Để bảo mật an toàn, Bạn tuyệt đối không cung cấp mã xác minh này cho bất kỳ ai.</p>
              <p>Mã xác minh có hiệu lực trong vòng 5 phút. Nếu hết thời gian cho yêu cầu này, Xin vui lòng thực hiện lại yêu cầu để nhận được mã xác minh mới.</p>
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu nữa, bạn có thể bỏ qua email này.</p>
              <p>Cảm ơn bạn!</p>
              <img src="cid:logo1" alt="logo-petworld.png"
                  width="200" height="auto" />
          </div>
      </div>
  `;
  var mainOptions = {
    from: {
      name: "noreply@petworld-server.serverapp.com",
      address: "petworld.server.email@gmail.com",
    },
    to: email,
    subject: "Đặt lại mật khẩu của bạn cho Petworld",
    text:
      "Xin chào! Mã xác minh đặt lại mật khẩu của bạn là " +
      otp +
      ". Để bảo mật an toàn, Bạn tuyệt đối không cung cấp mã xác minh này cho bất kỳ ai.",
    html: content,
    attachments: [
      {
        filename: "logo.jpg",
        path: `public/upload/logo-darktheme.png`,
        cid: "logo1",
      },
    ],
  };
  transporter.sendMail(mainOptions, async function (err, info) {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Gửi mã xác minh thất bại!" });
    } else {
      console.log("Message sent: " + info.response);
      if (data.length > 0) {
        await OTPEmailModel.findByIdAndUpdate(data[0]._id, {
          _id: data[0]._id,
          email: data[0].email,
          code: otp,
          createAt: new Date(),
        });
        return res.status(200).json({
          success: true,
          data: {},
          message: "Gửi mã xác minh thành công.",
        });
      } else {
        let newOTPEmail = new OTPEmailModel();
        newOTPEmail.email = email;
        newOTPEmail.code = otp;
        newOTPEmail.createAt = new Date();

        await newOTPEmail.save();
        return res.status(200).json({
          success: true,
          data: {},
          message: "Gửi mã xác minh thành công.",
        });
      }
    }
  });
}
