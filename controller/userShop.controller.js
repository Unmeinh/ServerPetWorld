let mdUserShop = require('../model/userShop.model');

exports.listUserShop = async (req, res, next) => {
    let msg = '';
    if (req.method == 'GET') {
        try {
            let listUserShop = await mdUserShop.UserShopModel.find();
            msg = 'Lấy danh sách user shop thành công';
            return res.render('UserShop/listUserShop', { listUserShop: listUserShop, msg: msg });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách  user shop: ' + msg);
        }

    }

}
exports.detailUserShop = async (req, res, next) => {
    
    res.render('UserShop/detailUserShop');
}
exports.addUserShop = async (req, res, next) => {
    res.render('UserShop/addUserShop');
}
exports.editUserShop = async (req, res, next) => {
    res.render('UserShop/editUserShop');
}
exports.deleteUserShop = async (req, res, next) => {
    res.render('UserShop/deleteUserShop');
}