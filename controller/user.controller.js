let mdUser = require('../model/user.model');
exports.listUser = async (req, res, next) => {
    let msg = '';
    if (req.method == 'GET') {
        try {
            let listUser = await mdUser.UserModel.find();
            msg = 'Lấy danh sách user thành công';
            return res.render('User/listUser', { listUser: listUser, msg: msg });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách  user: ' + msg);
        }

    }

}
exports.detailUser = async (req, res, next) => {
    
    res.render('User/detailUser');
}
exports.addUser = async (req, res, next) => {
    res.render('User/addUser');
}
exports.editUser = async (req, res, next) => {
    res.render('User/editUser');
}
exports.deleteUser = async (req, res, next) => {
    res.render('User/deleteUser');
}