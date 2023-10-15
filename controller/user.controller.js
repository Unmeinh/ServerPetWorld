let mdUser = require('../model/user.model');
let bcrypt = require('bcrypt');
let moment = require('moment');
exports.listUser = async (req, res, next) => {
    let msg = '';
    let filterSearch = null;
    let SortEmail = null;
    let perPage = 6;
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method === 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined') {
                const searchQuery = req.query.filterSearch;
                filterSearch = { fullName: { $regex: new RegExp(searchQuery, 'i') } };
            }
            if (typeof req.query.SortEmail !== 'undefined') {
                // Determine the sorting order based on the selected option
                SortEmail = req.query.SortEmail === '1' ? { fullName: 1 } : { fullName: -1 };
            }
            let totalCount = await mdUser.UserModel.countDocuments(filterSearch);
            const totalPage = Math.ceil(totalCount / perPage);
            if (currentPage <=0) {
                msg = 'Không có dữ liệu.';
                return res.render('User/listUser', { listUser: [], countAllUser: 0, countNowUser: 0, msg: msg, currentPage: currentPage, totalPage: totalPage });
            } else if (currentPage > totalPage) {
                msg = 'Không có dữ liệu.';
                return res.render('User/listUser', { listUser: [], countAllUser: 0, countNowUser: 0, msg: msg, currentPage: currentPage, totalPage: totalPage });
            } 
            let skipCount = (currentPage - 1) * perPage;

            let listUser = await mdUser.UserModel.find(filterSearch).sort(SortEmail).populate('idAccount').skip(skipCount).limit(perPage);

            if (listUser.length === 0) {
                msg = 'Không có dữ liệu.';
                return res.render('User/listUser', { listUser: [], countAllUser: 0, countNowUser: 0, msg: msg, currentPage: currentPage, totalPage: totalPage });
            }
            msg = 'Lấy danh sách user thành công';
            return res.render('User/listUser', { listUser: listUser, countAllUser: totalCount, countNowUser: listUser.length, msg: msg, currentPage: currentPage, totalPage: totalPage });
        } catch (error) {
            msg = 'Không lấy được danh sách user: ' + error.message;
            console.log(msg);
            return res.status(500).send(msg);
        }
    }
};


exports.detailUser = async (req, res, next) => {
    let idUser = req.params.idUser;
    let objU = await mdUser.UserModel.findById(idUser).populate('idAccount');
    res.render('User/detailUser',{objU:objU,moment:moment});
}
exports.addUser = async (req, res, next) => {
    let msg = '';
    let listUser = await mdUser.UserModel.find();

    if (req.method == 'POST') {
        const { userName, fullName, email, locationUser, phoneNumber, birthday } = req.body;
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        
        try {
            let objUser = new mdUser.UserModel();
            objUser.userName = userName;
            objUser.fullName = fullName;
            objUser.email = email;
            objUser.locationUser = locationUser;
            objUser.phoneNumber = phoneNumber;
            objUser.birthday = birthday;
            objUser.followers= 0;
            objUser.following= 0;
            objUser.createAt = new Date();
            const salt = await bcrypt.genSalt(10);
            objUser.passWord = await bcrypt.hash(req.body.passWord, salt);
            await objUser.generateAuthToken();

            await objUser.save();
            msg = 'Đã thêm thành công';
            return res.redirect('/user?msg=Thêm+người+dùng+thành+công')

        } catch (error) {
            console.log(error.message);
            if (error.message.match(new RegExp('.+`userName` is require+.'))) {
                msg = 'Tên đăng nhập đang trống!';
            }

            else if (error.message.match(new RegExp('.+`email` is require+.'))) {
                msg = 'Email đang trống!';
            }
            else if (!emailPattern.test(email)) {
                msg = 'Email không hợp lệ';
    
            }
            
            else if (error.message.match(new RegExp('.+`phoneNumber` is require+.'))) {
                msg = 'Số điện thoại đang trống!';
            }
            else if(error.message.match(new RegExp('.+index: phoneNumber_1 dup key+.')))
            {
                msg='Số điện thoại đã tồn tại trên hệ thống';
            }
            else if (error.message.match(new RegExp('.+`passWord` is require+.'))) {
                msg = 'Mật khẩu đang trống!';
            }
            else if (error.message.match(new RegExp('.+index: userName+.'))) {
                msg = 'Tên đăng nhập đã tồn tại - Nhập lại username!';
            }
            //vì email đang để false bên model
            // else if (error.message.match(new RegExp('.+index: email+.'))) {
            //     msg = 'Email đã tồn tại - Nhập lại email!';
            // }

            else {
                msg = "Lỗi" + error.message;
            }

        }

    }
    res.render('User/addUser', { listUser: listUser, msg: msg });
}

exports.deleteUser = async (req, res, next) => {
    let msg = '';
    let idUser = req.params.idUser;
    let objU = await mdUser.UserModel.findById(idUser);
    if (req.method == "POST") {
        try { 
            await mdUser.UserModel.findByIdAndDelete(idUser);
            res.redirect('/user');
        } catch (error) {
            console.log(error.message);
        }
    }
    res.render('User/deleteUser',{msg:msg,objU:objU});
}