let mdAdmin = require('../model/admin.model');
exports.listAdmin = async (req, res, next) => {
    let msg = '';
    let filterSearch = null;
    
    if (req.method == 'GET') {
        try {
            if(typeof(req.query.filterSearch)!='undefined')
            {
                filterSearch={nameAdmin: req.query.filterSearch};
            }
            if(req.body.ChangeUser==1)
            {

            }
            let listAdmin = await mdAdmin.AdminModel.find(filterSearch);
            let countNowAdmin = await mdAdmin.AdminModel.count(filterSearch);
            let countAllAdmin = await mdAdmin.AdminModel.count();
            msg = 'Lấy danh sách admin thành công';
            return res.render('Admin/listAdmin', { listAdmin: listAdmin,countAllAdmin:countAllAdmin,countNowAdmin:countNowAdmin, msg: msg });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách  admin: ' + error.message);
        }

    }

}
exports.detailAdmin = async (req, res, next) => {
    let msg='';
    let idAdmin = req.params.idAdmin;
   let objAd = await mdAdmin.AdminModel.findById(idAdmin);
  
    res.render('Admin/detailAdmin',{objAd:objAd});
}
exports.addAdmin = async (req, res, next) => {
    let msg='';
    if(req.method=='POST')
    {
        let newObj = new mdAdmin.AdminModel();
        newObj.nameAdmin = req.body.nameAdmin;
        newObj.usernameAdmin = req.body.usernameAdmin;
        newObj.emailAdmin = req.body.emailAdmin;
        newObj.passwordAdmin = req.body.passwordAdmin;
       
        try {
            await newObj.save();
            msg='Thêm admin thành công!';
           return res.redirect('/admin')
        } catch (error) {
            msg="Thêm admin thất bại! " +error.message;
            
        }
    }
    res.render('Admin/addAdmin',{msg:msg});
}
exports.editAdmin = async (req, res, next) => {
    res.render('Admin/editAdmin');
}
exports.deleteAdmin = async (req, res, next) => {
    res.render('Admin/deleteAdmin');
}