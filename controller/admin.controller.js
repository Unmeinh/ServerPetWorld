let mdAdmin = require('../model/admin.model');
let bcrypt = require('bcrypt');
exports.listAdmin = async (req, res, next) => {
    let msg = '';
    let filterSearch = null;
    let sortOption = null;
    let perPage = 6;
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { fullName: new RegExp(searchTerm, 'i') };
            }

            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { email: req.query.sortOption };
            }

            let totalCount = await mdAdmin.AdminModel.countDocuments(filterSearch);
            const totalPage = Math.ceil(totalCount / perPage);
            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPage) currentPage = totalPage;
            let skipCount = (currentPage - 1) * perPage;

            let listAdmin = await mdAdmin.AdminModel.find(filterSearch).sort(sortOption).skip(skipCount).limit(perPage);
          
            // msg = 'Lấy danh sách admin thành công';
            return res.render('Admin/listAdmin', { listAdmin: listAdmin, countAllAdmin: totalCount, countNowAdmin: listAdmin.length, msg: msg, currentPage: currentPage, totalPage: totalPage });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách  admin: ' + error.message);
            return res.render('Admin/listAdmin', { listAdmin: listAdmin, countAllAdmin: totalCount, countNowAdmin: listAdmin.length, msg: msg, currentPage: currentPage, totalPage: totalPage });
        }
    }
}
exports.detailAdmin = async (req, res, next) => {

    let idAdmin = req.params.idAdmin;
    let objAd = await mdAdmin.AdminModel.findById(idAdmin);

    res.render('Admin/detailAdmin', { objAd: objAd });
}
exports.addAdmin = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        if (req.body.re_passWord != req.body.passWord) {
            msg = "Mật khẩu không trùng khớp";
            return res.render('Admin/addAdmin', { msg: msg });
        }
        let newObj = new mdAdmin.AdminModel();
        newObj.fullName = req.body.fullName;
        newObj.userName = req.body.userName;
        newObj.email = req.body.email;

        let salt = await bcrypt.genSalt(10);
        newObj.passWord = await bcrypt.hash(req.body.passWord, salt);

        try {
            await newObj.save();
            msg = 'Thêm admin thành công!';
            return res.redirect('/admin')
        } catch (error) {
            console.log(error.message);
            if (error.message.match(new RegExp('.+`userName` is require+.'))) {
                msg = 'Tên đăng nhập đang trống!';
            }
            else if (error.message.match(new RegExp('.+`email` is require+.'))) {
                msg = 'Email đang trống!';
            }
            else if (error.message.match(new RegExp('.+`passWord` is require+.'))) {
                msg = 'Mật khẩu đang trống!';
            }
            else if (error.message.match(new RegExp('.+index: userName+.'))) {
                msg = 'Username đã tồn tại - Nhập lại username!';
            }
            else if (error.message.match(new RegExp('.+index: email+.'))) {
                msg = 'Email đã tồn tại - Nhập lại email!';
            }

            else {
                msg = error.message;
            }

        }
    }
    res.render('Admin/addAdmin', { msg: msg });
}
// exports.editAdmin = async (req, res, next) => {
//     res.render('Admin/editAdmin');
// }
exports.deleteAdmin = async (req, res, next) => {
    let msg = '';
    let listAdmin = await mdAdmin.AdminModel.find().count();
    let idAdmin = req.params.idAdmin;
    let objAd = await mdAdmin.AdminModel.findById(idAdmin);
    if (req.method == "POST") {

        try {
            if (listAdmin == 1) {
                msg = 'Danh sách admin tối thiểu phải là 1';
                return res.render('Admin/deleteAdmin', { msg: msg, objAd: objAd });
            }
            await mdAdmin.AdminModel.findByIdAndDelete(idAdmin);
            res.redirect('/admin');
        } catch (error) {
            console.log(error.message);
        }
    }
    res.render('Admin/deleteAdmin', { msg: msg, objAd: objAd });

}