let mdbillProduct = require("../model/billProduct.model");
let moment = require('moment');
exports.listBillProduct = async (req, res, next) => {
    let message = '';
    let sortOption = null;
    let page = parseInt(req.query.page) || 1;
    const perPage = 7;
    const totalCount = await mdbillProduct.billProductModel.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);
    const skipCount = (page - 1) * perPage;

    let listBillProduct = await mdbillProduct.billProductModel.find().populate("products.idProduct").populate("idUser").sort(sortOption).sort({ createdAt: -1 }).skip(skipCount).limit(perPage);

    message = "Lấy danh sách hóa đơn sản phẩm thành công";
    return res.render('BillProduct/listBillProduct', {
        listBillProduct: listBillProduct,
        message: message,
        moment: moment,
        countNowBill: listBillProduct.length,
        countAllBill: totalCount,
        page: page,
        totalPages: totalPages,
        adminLogin: req.session.adLogin,
    });
};

exports.detailBillProduct = async (req, res, next) => {
    let message = '';
    let idBP = req.params.idBP;
    let objBP = await mdbillProduct.billProductModel.findById(idBP).populate('products.idProduct').populate('idUser');
    res.render('BillProduct/detailBillProduct', { objBP: objBP, message: message, adminLogin: req.session.adLogin, moment:moment });
}