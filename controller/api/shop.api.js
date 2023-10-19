let mdShop = require('../../model/shop.model');
let fs = require("fs");
const jwt = require('jsonwebtoken');
let bcrypt = require("bcrypt");
const { onUploadImages } = require("../../function/uploadImage");
const { encodeToSha256, encodeToAscii } = require("../../function/hashFunction");
let validator = require('email-validator');
const nodemailer = require("nodemailer");
const OTPEmailModel = require("../../model/otpemail.model").OTPEmailModel;
const otpGenerator = require("otp-generator");

exports.listShop = async (req, res, next) => {
    let filterSearch = null;

    if (req.method == 'GET') {
        try {
            if (typeof (req.query.filterSearch) != 'undefined' && req.query.filterSearch.trim() != '') {
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { fullName: new RegExp(searchTerm, 'i') };
            }
            let listShop = await mdShop.ShopModel.find(filterSearch);
            return res.status(200).json({ success: true, data: listShop, message: 'Lấy danh sách shop thành công' });
        } catch (error) {
            return res.status(500).json({ success: false, data: [], message: 'Lỗi: ' + error.message });
        }
    }

}

exports.detailShop = async (req, res, next) => {

    let idShop = req.params.idShop;
    try {
        let ObjShop = await mdShop.ShopModel.findById(idShop);
        return res.status(200).json({ success: true, data: ObjShop, message: "Lấy dữ liệu chi tiết shop thành công" });

    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.checkPhoneNumber = async (req, res, next) => {
    try {
        console.log(req.body.hotline);
        let objU = await mdShop.ShopModel.findOne({ hotline: req.body.hotline });
        if (!objU) {
            return res.status(201).json({ success: true, data: objU, message: "Số điện thoại chưa được đăng ký." });
        } else {
            return res.status(201).json({ success: false, data: objU, message: "Số điện thoại đã được đăng ký." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.checkStatus = async (req, res, next) => {
    try {
        return res.status(200).json({ success: true, data: req.shop.status, message: "Lấy trạng thái thành công." });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.registerShop = async (req, res, next) => {
    if (req.method == 'POST') {
        console.log(req.body);
        let newShop = new mdShop.ShopModel();
        newShop.nameShop = req.body.nameShop;
        newShop.email = req.body.email;
        newShop.locationShop = req.body.locationShop;
        newShop.userName = req.body.userName;
        const salt = await bcrypt.genSalt(10);
        newShop.passWord = await bcrypt.hash(req.body.passWord, salt);
        newShop.description = "";
        newShop.status = 0;
        newShop.followers = 0;
        newShop.revenue = 0;
        newShop.hotline = req.body.hotline;
        newShop.createdAt = new Date();
        await newShop.generateAuthToken(newShop);
        let images = await onUploadImages(req.files, 'shop')
        if (images != [] && images[0] == false) {
            if (images[1].message.indexOf('File size too large.') > -1) {
                return res.status(500).json({ success: false, data: {}, message: "Dung lượng một ảnh tối đa là 10MB!" });
            } else {
                return res.status(500).json({ success: false, data: {}, message: images[1].message });
            }
        }
        newShop.avatarShop = images[0];
        let ownerIdentity = JSON.stringify({
            nameIdentity: encodeToSha256(String(req.body.nameIdentity)),
            numberIdentity: encodeToSha256(String(req.body.numberIdentity)),
            dateIdentity: encodeToSha256(String(req.body.dateIdentity)),
            imageIdentity: [encodeToSha256(images[1]), encodeToSha256(images[2])]
        });
        await newShop.encodeOwnerIdentity(newShop, encodeToAscii(ownerIdentity));

        try {
            await newShop.save();
            return res.status(201).json({ success: true, data: newShop, message: 'Thêm shop thanh công' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, data: {}, message: JSON.stringify(error.message) });
        }
    }

}

exports.loginShop = async (req, res, next) => {
    if (req.method == "POST") {
      try {
        let objS = await mdShop.ShopModel.findByCredentials(
          req.body.userName,
          req.body.passWord
        );
        if (!objS) {
          return res
            .status(201)
            .json({ success: false, message: "Sai thông tin đăng nhập!" });
        }
        objS.online = 0;
        await mdShop.ShopModel.findByIdAndUpdate(objS._id, objS);
        return res.status(201).json({
          success: true,
          data: {shopStatus: objS.status},
          token: objS.token,
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
  
exports.editShop = async (req, res, next) => {
    let msg = '';
    let idShop = req.params.idShop;
    if (req.method == 'PUT') {
        // let ObjShop = await mdShop.ShopModel.findById(idShop);
        let newObj = new mdShop.ShopModel();
        newObj.nameShop = req.body.nameShop;
        newObj.email = req.body.email;
        newObj.locationShop = req.body.locationShop;
        let images = await onUploadImages(req.files, 'shop')
        if (images != [] && images[0] == false) {
            if (images[1].message.indexOf('File size too large.') > -1) {
                return res.status(500).json({ success: false, data: {}, message: "Dung lượng một ảnh tối đa là 10MB!" });
            } else {
                return res.status(500).json({ success: false, data: {}, message: images[1].message });
            }
        }
        newObj.avatarShop = [...images];
        newObj.description = req.body.description;
        newObj.status = 'Chưa được duyệt';
        newObj.followers = 0;
        newObj.idUserShop = req.body.idUserShop;
        newObj.revenue = 0;
        newObj.hotline = req.body.hotline;
        newObj.createdAt = new Date();
        newObj._id = idShop;

        try {
            await mdShop.ShopModel.findByIdAndUpdate(idShop, newObj);
            return res.status(201).json({ success: true, data: newObj, message: 'Cập nhật shop thành công' });
        } catch (error) {
            console.log(error.message);

            if (
                !req.body.nameShop &
                !req.body.email &
                !req.body.locationShop &
                !req.body.description &
                !req.body.status &
                !req.body.idUserShop &
                !req.body.hotline
            ) {
                msg = 'Không để trống thông tin'
            }

            else if (error.message.match(new RegExp('.+`nameShop` is require+.'))) {
                msg = 'Tên shop đang trống!';
            }
            else if (error.message.match(new RegExp('.+`email` is require+.'))) {
                msg = 'Email shop đang trống!';
            }
            else if (!validator.validate(req.body.email)) {
                msg = 'Email shop không đúng định dạng!';
            }
            else if (error.message.match(new RegExp('.+`locationShop` is require+.'))) {
                msg = 'Địa chỉ shop đang trống!';
            }
            else if (error.message.match(new RegExp('.+`description` is require+.'))) {
                msg = 'Mô tả shop đang trống!';
            }
            else if (error.message.match(new RegExp('.+`hotline` is require+.'))) {
                msg = 'Số điện thoại đang trống!';
            }
            else if (error.message.match(new RegExp('.+Number failed for value \"+.'))) {
                msg = 'Số điện thoại phải nhập số dương!';
            }

            else {
                msg = error.message;
            }
            var phoneValidate = /^\d{10}$/
            if (!phoneValidate.test(req.body.hotline)) {
                msg = 'Số điện thoại chưa đúng định đạng 9 số!';
                return res.status(500).json({ success: false, data: {}, message: msg });

            }
            return res.status(500).json({ success: false, data: {}, message: msg });
        }
    }
}

exports.deleteShop = async (req, res, next) => {
    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop);

    if (req.method == 'DELETE') {
        try {
            await mdShop.ShopModel.findByIdAndDelete(idShop);
            return res.status(203).json({ success: true, data: {}, message: "Shop không còn tồn tại" });

        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });

        }
    }

}

exports.sendVerifyEmail = async (req, res, next) => {
    if (req.method == "POST") {
        if (req.body.email != undefined) {
            var data = await OTPEmailModel.find({ email: req.body.email, typeUser: 1 });
            var newOTP = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            await sendEmailOTP(req.body.email, newOTP, data, res);
        }
    }
};

exports.verifyCode = async (req, res, next) => {
    if (req.method == "POST") {
        if (req.body.email != undefined && req.body.otp != undefined) {
            var data = await OTPEmailModel.find({ email: req.body.email, typeUser: 1 });
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
                message: "Mã xác minh sai hoặc không tồn tại trong cơ sở dữ liệu",
            });
        }
    }
};

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
                <p>Mã xác thực cho email của bạn là ${otp}.</p>
                <p>Để bảo mật an toàn, Bạn tuyệt đối không cung cấp mã xác thực này cho bất kỳ ai.</p>
                <p>Mã xác thực có hiệu lực trong vòng 5 phút. Nếu hết thời gian cho yêu cầu này, Xin vui lòng thực hiện lại yêu cầu để nhận được mã xác thực mới.</p>
                <p>Nếu bạn không yêu cầu xác thực email nữa, bạn có thể bỏ qua email này.</p>
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
        subject: "Xác thực email của bạn cho PetworldSeller",
        text:
            "Xin chào! Mã xác thực cho email của bạn là " +
            otp +
            ". Để bảo mật an toàn, Bạn tuyệt đối không cung cấp mã xác thực này cho bất kỳ ai.",
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
                    typeUser: 1,
                    createAt: new Date(),
                });
                return res.status(201).json({
                    success: true,
                    data: {},
                    message: "Gửi mã xác minh thành công.",
                });
            } else {
                let newOTPEmail = new OTPEmailModel();
                newOTPEmail.email = email;
                newOTPEmail.code = otp;
                newOTPEmail.typeUser = 1;
                newOTPEmail.createAt = new Date();

                await newOTPEmail.save();
                return res.status(201).json({
                    success: true,
                    data: {},
                    message: "Gửi mã xác minh thành công.",
                });
            }
        }
    });
}
