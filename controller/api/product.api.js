let mdProduct = require('../../model/product.model');
var moment = require('moment')
const fs = require("fs");
exports.listProduct = async (req, res, next) => {

    if (req.method == 'GET') {

        let listProduct = await mdProduct.ProductModel.find().populate('idCategoryPr').populate('idShop');
        if (listProduct) {
            return res.status(200).json({ success: true, data: listProduct, message: 'Lấy danh sách sản phẩm thành công' });
        }
        else {
            return res.status(500).json({ success: false, data: [], message: 'Không lấy được danh sách sản phẩm' });
        }

    }
}
exports.listProductFromIdShop = async (req, res, next) => {
    let idShop = req.params.idShop;
    if (req.method == 'GET') {

        let listProduct = await mdProduct.ProductModel.find({ idShop: idShop }).populate('idCategoryPr').populate('idShop');
        if (listProduct) {
            return res.status(200).json({ success: true, data: listProduct, message: 'Lấy danh sách sản phẩm theo thành công' });
        }
        else {
            return res.status(500).json({ success: false, data: [], message: 'Không lấy được danh sách sản phẩm' });
        }

    }
}
exports.detailProduct = async (req, res, next) => {

    let idPR = req.params.idPR;
    try {
        let ObjProduct = await mdProduct.ProductModel.findById(idPR).populate('idCategoryPr').populate('idShop');
        res.status(200).json({ success: true, data: ObjProduct, message: "Lấy chi tiết sản phẩm thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }

}
exports.addProduct = async (req, res, next) => {
    let msg = '';

    if (
        !req.body.nameProduct &&
        !req.body.priceProduct &&
        !req.body.detailProduct &&
        !req.body.amountProduct &&
        !req.body.quantitySold &&
        !req.body.idCategoryPr &&
        !req.body.discount
    ) {
        return res.status(400).json({ message: 'Vui lòng không để trống!' });
    }
    console.log("reqbody" + req.body.nameProduct);
    let newObj = new mdProduct.ProductModel();
    newObj.nameProduct = req.body.nameProduct;
    newObj.priceProduct = req.body.priceProduct;
    newObj.detailProduct = req.body.detailProduct;
    newObj.amountProduct = req.body.amountProduct;
    newObj.idCategoryPr = req.body.idCategoryPr;
    newObj.quantitySold = req.body.quantitySold;
    newObj.rate = 0;
    newObj.discount = req.body.discount;
    newObj.createdAt = new Date();

    if (req.files != undefined) {
        console.log("check " + req.files);
        req.files.map((file, index, arr) => {
            
            if (file != {}) {
                fs.renameSync(file.path, './public/upload/' + file.originalname);
                let imagePath = 'http://localhost:3000/upload/' + file.originalname;
                newObj.arrProduct.push(imagePath);
            }
        })
    }

    try {
        await newObj.save();
        return res.status(201).json({ success: true, data: newObj, message: 'Them thanh cong' });
    } catch (error) {
        console.log(error.message);
        if (error.message.match(new RegExp('.+`nameProduct` is require+.'))) {
            msg = 'Tên sản phẩm đang trống!';
        }
        else if (error.message.match(new RegExp('.+`priceProduct` is require+.'))) {
            msg = 'giá sản phẩm đang trống!';
        }
        else if (isNaN(newObj.priceProduct) || newObj.priceProduct <= 0) {
            msg = 'Giá sản phẩm phải nhập số!';
            return res.status(400).json({ success: false, data: {}, message: msg });
        }

        else if (isNaN(newObj.quantitySold) || newObj.quantitySold <= 0) {
            msg = 'Số lượng bán phải nhập số!';
            return res.status(400).json({ success: false, data: {}, message: msg });
        }
        else if (error.message.match(new RegExp('.+`detailProduct` is require+.'))) {
            msg = 'Chi tiết sản phẩm đang trống!';
        }
        else if (error.message.match(new RegExp('.+`quantitySold` is require+.'))) {
            msg = 'Số lượng bán đang trống!';
        }
        else if (error.message.match(new RegExp('.+`amountProduct` is require+.'))) {
            msg = 'Số lượng bán đang trống!';
        }
        else if (isNaN(newObj.amountProduct) || newObj.amountProduct <= 0) {
            msg = 'Giá sản phẩm phải nhập số!';
            return res.status(400).json({ success: false, data: {}, message: msg });
        }
        else {
            msg = error.message;
        }
        return res.status(500).json({ success: false, data: {}, message: msg });
    }
}
exports.deleteProduct = async (req, res, next) => {

    let idPR = req.params.idPR;
    let ObjProduct = await mdProduct.ProductModel.findById(idPR);

    if (req.method == 'DELETE') {
        try {
            await mdProduct.ProductModel.findByIdAndDelete(idPR);
            return res.status(203).json({ success: true, data: {}, message: "Sản phẩm không còn trong shop" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
        }
    }

    res.render('Product/deleteProduct', { message: message, ObjProduct: ObjProduct });
}