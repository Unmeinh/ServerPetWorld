let mdAdmin = require('../model/admin.model');
var bcrypt = require('bcrypt');
exports.login = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        try {
            let objAd = await mdAdmin.AdminModel.findOne({ userName: req.body.userName });
            if (objAd != null) {
                let check_pass = await bcrypt.compare(req.body.passWord, objAd.passWord);
                if (check_pass) {
                    req.session.adLogin = objAd;
                    return res.redirect('/admin');
                }
                else {
                    msg = 'Thông tin đăng nhập chưa đúng';
                    return res.render('Account/loginAdmin', { msg: msg })
                }
            } else {
                msg = 'Không tồn tại tài khoản này';
            }
        } catch (error) {
            msg=error.message
        }

    }
    res.render('Account/loginAdmin', { msg: msg })
}
// exports.detail=async()=>{
//     res.render('')
// }