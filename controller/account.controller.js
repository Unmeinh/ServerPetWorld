let mdAdmin = require('../model/admin.model');
let mdUserAccount = require('../model/userAccount.model').UserAccountModel;
var bcrypt = require('bcrypt');
let { decodeFromSha256 } = require('../function/hashFunction');

exports.login = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        try {
            let objAd = await mdAdmin.AdminModel.findOne({ userName: req.body.userName });
            if (objAd != null) {
                let check_pass = await bcrypt.compare(req.body.passWord, objAd.passWord);
                if (check_pass) {
                    req.session.adLogin = objAd;
                    return res.redirect('/pet');
                }
                else {
                    msg = 'Thông tin đăng nhập chưa đúng';
                    return res.render('Account/loginAdmin', { msg: msg })
                }
            } else {
                msg = 'Không tồn tại tài khoản này';
            }
        } catch (error) {
            msg = error.message
        }

    }
    res.render('Account/loginAdmin', { msg: msg })
}

exports.verifyEmail = async (req, res, next) => {
    if (req.method == 'POST') {
        let decode = decodeFromSha256(req.params.encodeToSha256);
        try {
            var data = await mdUserAccount.findOne({ emailAddress: decode });
            if (data != null) {
                data.isVerifyEmail = 0;
                await mdUserAccount.findByIdAndUpdate(data._id, data);
                return res
                    .status(200)
                    .json({ success: true, data: {}, message: "Xác minh email thành công" });
            } else {
                return res
                    .status(500)
                    .json({ success: false, data: {}, message: "Xác minh email thất bại" });
            }
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ success: false, data: {}, message: "Xác minh email thất bại" });
        }
    }
    res.render('Account/verifyEmail')
}

exports.verifyResult = async (req, res, next) => {
    let isVerify = req.query.isVerify;
    res.render('account/verifyResult', { isVerify: isVerify })
}

exports.profile = async (req, res, next) => {
    let msg = '';

    if (req.method == 'GET') {

    }
    res.render('Account/profileAdmin', { msg: msg })
}
exports.logout = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        if (req.session != null)
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                } else {
                    res.redirect('/account/login');
                }
            });
    }
    res.render('Account/logoutAdmin', { msg: msg, adminLogin:req.session.adLogin })
}