let mdUser = require('../model/user.model');
let bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.listUser = async (req, res, next) => {
    console.log("đã chạy vào đây")
    let filterSearch = null; 
    const msg = req.query.msg;
    // let msg = '';
    if (req.method == 'GET') {
        try {
            if(typeof(req.query.filterSearch)!='undefined')
            {
                filterSearch={fullname: req.query.filterSearch};
            }
            if(req.body.ChangeUser==1)
            {

            }
            let listUser = await mdUser.UserModel.find(filterSearch);
            let countNowUser = await mdUser.UserModel.count(filterSearch);
            let countAllUser = await mdUser.UserModel.count();
            // msg = 'Lấy danh sách user thành công';
            return res.render('User/listUser', { listUser: listUser,countAllUser: countAllUser, countNowUser: countNowUser, msg: msg });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách  user: ' + msg);
        }

    }

}

exports.detailUser = async (req, res, next) => {
    let idus = req.params.idUser;
    console.log(idus);
  var listUser = await mdUser.UserModel
    .findById(idus);
 
    res.render('User/detailUser', { objUser :listUser });
}


exports.addUser = async (req, res, next) => {
    console.log("đã chạy vào đây");
    let msg = ''; // biến để truyền thông báo ra màn hình
    var listUser = await mdUser.UserModel.find();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('User/addUser', { msg: 'Lỗi validate', listUser: listUser, errors: errors.array() });
    }
    
    if (req.method == 'POST') {
        const { usernameUser, fullname, emailUser, locationUser, phoneNumber, birthdayUser, genderUser, passwordUser } = req.body;

        // Kiểm tra email hợp lệ bằng regex
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailPattern.test(emailUser)) {
            msg = 'Email không hợp lệ';
        } else {
            try {
                const checkemailUser = await mdUser.UserModel.findOne({ emailUser: emailUser });
                const checkUsername = await mdUser.UserModel.findOne({ usernameUser: usernameUser });
                const checkPhonenumber = await mdUser.UserModel.findOne({ phoneNumber: phoneNumber });
                // if (checkemailUser) {
                //     msg = 'Email đã tồn tại trong hệ thống';
                // } else
                 if (checkUsername) {
                    msg = 'Username đã tồn tại trong hệ thống';
                } else if (checkPhonenumber) {
                    msg = 'Số điện thoại đã tồn tại trong hệ thống';
                } 
                else {
                    let objUser = new mdUser.UserModel();
                    objUser.usernameUser= usernameUser;
                    objUser.fullname = fullname;
                    objUser.emailUser = emailUser;
                    objUser.locationUser = locationUser;
                    objUser.phoneNumber = phoneNumber;
                    objUser.birthdayUser = birthdayUser;
                    objUser.genderUser = genderUser;
                    const salt=await bcrypt.genSalt(10);
                    objUser.passwordUser=await bcrypt.hash(req.body.passwordUser,salt);

                    await objUser.save();
                    msg = 'Đã thêm thành công';
                    return res.redirect('/user?msg=Thêm+người+dùng+thành+công')           
                }           
            } catch (error) {
                console.log(error.message);
             if(error.message.match(new RegExp('.+`usernameUser` is require+.')))
            {
                msg='Tên đăng nhập đang trống!';
            }
            else if(error.message.match(new RegExp('.+`emailUser` is require+.')))
            {
                msg='Email đang trống!';
            }
            else if(error.message.match(new RegExp('.+`passwordUser` is require+.')))
            {
                msg='Mật khẩu đang trống!';
            }
            else if(error.message.match(new RegExp('.+index: usernameUser+.')))
            {
                msg= 'Username đã tồn tại - Nhập lại username!';
            }
            else if(error.message.match(new RegExp('.+index: emailUser+.')))
            {
                msg='Email đã tồn tại - Nhập lại email!';
            }
           
            else{
                msg=error.message;
            }
               
            }
        }
    }
    res.render('User/addUser', { msg: msg, listUser: listUser });
}



exports.editUser = async (req, res, next) => {
    res.render('User/editUser');
}
exports.deleteUser = async (req, res, next) => {
    await mdUser.UserModel.deleteOne({_id: req.params.idUser});
    console.log("dasd" + req.params.idUser)
    res.redirect("back");
}