let mdAdmin = require('../model/admin.model');
exports.listAdmin = async (req, res, next) => {
    let msg = '';
    if (req.method == 'GET') {
        try {
            let listAdmin = await mdAdmin.AdminModel.find();
            msg = 'Lấy danh sách admin thành công';
            return res.render('Admin/listAdmin', { listAdmin: listAdmin, msg: msg });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách  admin: ' + error.message);
        }

    }

}
exports.detailAdmin = async (req, res, next) => {
    // let msg='';
    // if(req.method=='GET')
    // {
        
    // }
    res.render('Admin/detailAdmin');
}
exports.addAdmin = async (req, res, next) => {
    res.render('Admin/addAdmin');
}
exports.editAdmin = async (req, res, next) => {
    res.render('Admin/editAdmin');
}
exports.deleteAdmin = async (req, res, next) => {
    res.render('Admin/deleteAdmin');
}