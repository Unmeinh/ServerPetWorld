let mdProduct = require('../model/product.model');
var moment = require('moment')
const fs = require("fs");
exports.listProduct = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = {};
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                // Use a regex to match any username containing the search input character(s)
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { nameProduct: new RegExp(searchTerm, 'i') };
            }

            let sortOption = {};
            const selectedSortOption = req.query.sortOption;
            if (selectedSortOption === 'az') {
                sortOption = { nameProduct: 1 }; // 1 for ascending order (A-Z)
            } else if (selectedSortOption === 'za') {
                sortOption = { nameProduct: -1 }; // -1 for descending order (Z-A)
            }

            const totalCount = await mdProduct.ProductModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            // Validate the current page number to stay within the correct range
            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listProduct = await mdProduct.ProductModel.find(filterSearch).populate('id_categoryPr')
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);

            msg = 'Lấy danh sách  sản phẩm thành công';
            return res.render('Product/listProduct', {
                listProduct: listProduct,
                countNowProduct: listProduct.length,
                countAllProduct: totalCount,
                msg: msg,
                currentPage: currentPage,
                totalPages: totalPages,
                moment: moment
            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách sản phẩm: ' + msg);
        }
    }

    // If no search results are found, render a message
    res.render('Product/listProduct', {
        msg: 'Không tìm thấy kết quả phù hợp',
        moment: moment
    });
}
exports.detailProduct = async (req, res, next) => {
    let msg = '';
    let idPR = req.params.idPR;
    let ObjProduct = await mdProduct.ProductModel.findById(idPR).populate('id_categoryPr');
    res.render('Product/detailProduct', { ObjProduct: ObjProduct });
    console.log("objjjjj" + ObjProduct);
}

exports.addProduct = async (req, res, next) => {
    let msg = '';

    if (
        !req.body.nameProduct ||
        !req.body.priceProduct ||
        !req.body.detailProduct ||
        !req.body.amountProduct ||
        !req.body.quantitySold ||
        !req.body.rate ||
        !req.body.id_categoryPr ||
        !req.body.discount
    ) {
        return res.status(400).json({ message: 'Vui lòng không để trống!' });
    }
        console.log("reqbody"+req.body.nameProduct);
        let newObj = new mdProduct.ProductModel();
        newObj.nameProduct = req.body.nameProduct;
        newObj.priceProduct = req.body.priceProduct;
        newObj.detailProduct = req.body.detailProduct;
        newObj.amountProduct = req.body.amountProduct;
        newObj.id_categoryPr = req.body.id_categoryPr;
        newObj.quantitySold = req.body.quantitySold;
        newObj.rate = req.body.rate;
        newObj.discount = req.body.discount;
        newObj.createdAt = new Date();
        if (req.files && req.files.length > 0) {
            newObj.arrProduct = req.files.map(file => "http://localhost:3000/upload/"  + file.originalname); // Lưu đường link + tên tệp vào mảng
        } else {
            newObj.arrProduct = []; // Mảng rỗng nếu không có ảnh được tải lên
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
    let message = ""
    let idPR = req.params.idPR;
    let ObjProduct = await mdProduct.ProductModel.findById(idPR);
    console.log("idPR  " + idPR);
    if (req.method == 'POST') {
        try {
            await mdProduct.ProductModel.findByIdAndDelete(idPR);
            console.log("xoa thành công");
            return res.redirect('/Product');
        } catch (error) {
            console.log(error.message);
            console.log("falll");
        }
    }

    res.render('Product/deleteProduct', { message: message, ObjProduct: ObjProduct });
}