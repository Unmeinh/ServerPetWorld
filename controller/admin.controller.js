let mdAdmin = require('../model/admin.model');
exports.listAdmin = async(req,res,next)=>{
    let msg='';
    if(req.method=='GET')
    {
        try {
            let listAdmin = await mdAdmin.AdminModel.find();
            msg='Lấy danh sách admin thành công';
            return res.render('Admin/listAdmin',{listAdmin:listAdmin,msg:msg});
        } catch (error) {
                console.log('msg: '+error.message); 
        }
       
    }
    
}
exports.detailAdmin = async(req,res,next)=>{
    res.render('');
}
exports.addAdmin = async(req,res,next)=>{
    res.render('');
}
exports.editAdmin = async(req,res,next)=>{
    res.render('');
}
exports.deleteAdmin = async(req,res,next)=>{
    res.render('');
}