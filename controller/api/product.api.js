let mdProduct = require('../../model/product.model');
let mdbillProduct = require('../../model/billProduct.model');
const fs = require("fs");
const { match } = require('assert');
const moment = require('moment');
exports.listProduct = async (req, res, next) => {
    try {
        if (req.query.hasOwnProperty('page') && req.query.hasOwnProperty('day')) {
            const page = parseInt(req.query.page) || 1;
            const days = parseInt(req.query.day, 10);

            // Validate page and days
            if (page <= 0 || isNaN(page) || days <= 0 || isNaN(days)) {
                return res.status(400).json({
                    success: false,
                    message: 'Số trang và số ngày không hợp lệ.',
                });
            }

            const limit = 10;
            const startIndex = (page - 1) * limit;
            const startDate = moment().subtract(days, 'days').toDate();

            // Get product IDs based on page and within the specified days
            const productIds = await mdProduct.ProductModel
                .find()
                .limit(limit)
                .skip(startIndex)
                .select('_id')
                .exec();

            // Get product details for the retrieved product IDs within the specified days
            const productDetails = await mdbillProduct.billProductModel.aggregate([
                {
                    $match: {
                        purchaseDate: { $gte: startDate },
                        'products.idProduct': { $in: productIds.map(id => id._id) }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $group: {
                        _id: '$products.idProduct',
                        totalCount: { $sum: '$products.amount' }
                    }
                },
                {
                    $sort: { totalCount: -1 }
                },
                {
                    $lookup: {
                        from: 'Products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                {
                    $unwind: '$productDetails'
                },
                {
                    $replaceRoot: { newRoot: '$productDetails' } // Replace the root with productDetails
                }
            ]);

            if (productDetails && productDetails.length > 0) {
                return res.status(200).json({
                    success: true,
                    data: productDetails,
                    message: `Sản phẩm được mua nhiều nhất trong thời gian qua ${days} ngày trên trang ${page}`,
                });
            } else {
                return res.status(203).json({
                    success: false,
                    data: null,
                    message: `Không tìm thấy sản phẩm nào được mua trong vòng ${days} ngày trên trang ${page}`,
                });
            }
        } 
        else if (req.query.hasOwnProperty('page')) {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const totalCount = await mdProduct.ProductModel.countDocuments();
            const totalPage = Math.ceil(totalCount / limit);
            const startIndex = (page - 1) * limit;
            const pageRegex = /^[0-9]+$/;

            if (page <= 0) {
                return res.status(500).json({ success: false, message: "Số trang phải lớn hơn 0" });
            }

            if (!pageRegex.test(page)) {
                return res.status(500).json({ success: false, message: "Số trang phải là số nguyên!" });
            }

            if (page > totalPage) {
                return res.status(500).json({ success: false, message: "Số trang không tồn tại!" });
            }

            const listProduct = await mdProduct.ProductModel
                .find()
                .populate('idCategoryPr')
                .populate('idShop')
                .limit(limit)
                .skip(startIndex)
                .exec();

            if (listProduct.length > 0) {
                return res.status(200).json({ success: true, data: listProduct, message: 'Lấy danh sách sản phẩm thành công' });
            } else {
                return res.status(500).json({ success: false, message: 'Không có sản phẩm nào' });
            }
        } else if (req.query.hasOwnProperty('day')) {
            const days = parseInt(req.query.day, 10);

            if (isNaN(days) || days <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Số ngày không hợp lệ hoặc bị thiếu (trang)',
                });
            }

            const startDate = moment().subtract(days, 'days').toDate();

            const productCounts = await mdbillProduct.billProductModel.aggregate([
                {
                    $match: {
                        purchaseDate: { $gte: startDate }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $group: {
                        _id: '$products.idProduct',
                        totalCount: { $sum: '$products.amount' }
                    }
                },
                {
                    $sort: { totalCount: -1 }
                },
                {
                    $lookup: {
                        from: 'Products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                {
                    $unwind: '$productDetails'
                },
                {
                    $replaceRoot: { newRoot: '$productDetails' } // Replace the root with productDetails
                }
            ]);

            if (productCounts && productCounts.length > 0) {
                return res.status(200).json({
                    success: true,
                    data: productCounts,
                    message: `Sản phẩm được mua nhiều nhất trong thời gian qua ${days} ngày`,
                });
            } else {
                return res.status(203).json({
                    success: false,
                    data: null,
                    message: `Không tìm thấy idSản phẩm nào trong vòng ${days} ngày`,
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid request. Please provide either "page" or "day" parameter.',
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.listProductFromIdShop = async (req, res, next) => {
    let idShop = req.params.idShop;
    if (req.method == 'GET') {

        let listProduct = await mdProduct.ProductModel.find({ idShop: idShop }).populate('idCategoryPr').populate('idShop');
        if (listProduct) {
            return res.status(200).json({ success: true, data: listProduct, message: 'Lấy danh sách sản phẩm theo shop thành công' });
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
        return res.status(200).json({ success: true, data: ObjProduct, message: "Lấy chi tiết sản phẩm thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}
exports.addProduct = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        if (
            !req.body.nameProduct &&
            !req.body.priceProduct &&
            !req.body.detailProduct &&
            !req.body.amountProduct &&
            !req.body.quantitySold &&
            !req.body.idCategoryPr &&
            !req.body.discount
        ) {
            return res.status(400).json({ success: false, data: [], message: 'Vui lòng không để trống ô nhập' });
        }

        let newObj = new mdProduct.ProductModel();
        newObj.nameProduct = req.body.nameProduct;
        newObj.priceProduct = req.body.priceProduct;
        newObj.discount = req.body.discount;
        newObj.idCategoryPr = req.body.idCategoryPr;
        newObj.amountProduct = req.body.amountProduct;
        newObj.detailProduct = req.body.detailProduct;
        newObj.quantitySold = 0;
        newObj.rate = 0;
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
            return res.status(201).json({ success: true, data: newObj, message: 'Thêm sản phẩm thành công' });
        } catch (error) {
            console.log(error.message);
            if (error.message.match(new RegExp('.+`nameProduct` is require+.'))) {
                msg = 'Tên sản phẩm đang trống!';
            }
            else if (error.message.match(new RegExp('.+`priceProduct` is require+.'))) {
                msg = 'Giá sản phẩm đang trống!';
            }
            else if (error.message.match(new RegExp('.+priceProduct: Cast to Number failed for value+.'))) {
                msg = 'Giá sản phẩm phải nhập số!';
            }

            else if (newObj.priceProduct <= 0) {
                msg = 'Giá sản phẩm phải lớn hơn 0!';
            }
            else if (error.message.match(new RegExp('.+`amountProduct` is require+.'))) {
                msg = 'Số lượng sản phẩm đang trống!';
            }
            else if (error.message.match(new RegExp('.+amountProduct: Cast to Number failed for value+.'))) {
                msg = 'Số lượng sản phẩm phải nhập số!';
            }

            else if (newObj.amountProduct <= 0) {
                msg = 'Số lượng sản phẩm phải lớn hơn 0!';
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
}

exports.editProduct = async (req, res, next) => {
    let msg = '';
    let idPR = req.params.idPR;
    if (req.method == 'PUT') {
        if (
            !req.body.nameProduct &&
            !req.body.priceProduct &&
            !req.body.detailProduct &&
            !req.body.amountProduct &&
            !req.body.quantitySold &&
            !req.body.idCategoryPr &&
            !req.body.discount
        ) {
            return res.status(400).json({ success: false, data: [], message: 'Vui lòng không để trống ô nhập' });
        }

        let newObj = new mdProduct.ProductModel();
        newObj.nameProduct = req.body.nameProduct;
        newObj.priceProduct = req.body.priceProduct;
        newObj.discount = req.body.discount;
        newObj.idCategoryPr = req.body.idCategoryPr;
        newObj.amountProduct = req.body.amountProduct;
        newObj.detailProduct = req.body.detailProduct;
        newObj.quantitySold = 0;//cập nhật
        newObj.rate = 0;//cập nhật

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
        newObj._id = idPR;

        try {
            await mdProduct.ProductModel.findByIdAndUpdate(idPR, newObj);
            return res.status(200).json({ success: true, data: newObj, message: 'Cập nhật sản phẩm thành công' });
        } catch (error) {
            console.log(error.message);
            if (error.message.match(new RegExp('.+`nameProduct` is require+.'))) {
                msg = 'Tên sản phẩm đang trống!';
            }
            else if (error.message.match(new RegExp('.+`priceProduct` is require+.'))) {
                msg = 'Giá sản phẩm đang trống!';
            }
            else if (error.message.match(new RegExp('.+priceProduct: Cast to Number failed for value+.'))) {
                msg = 'Giá sản phẩm phải nhập số!';
            }

            else if (newObj.priceProduct <= 0) {
                msg = 'Giá sản phẩm phải lớn hơn 0!';
            }
            else if (error.message.match(new RegExp('.+`amountProduct` is require+.'))) {
                msg = 'Số lượng sản phẩm đang trống!';
            }
            else if (error.message.match(new RegExp('.+amountProduct: Cast to Number failed for value+.'))) {
                msg = 'Số lượng sản phẩm phải nhập số!';
            }

            else if (newObj.amountProduct <= 0) {
                msg = 'Số lượng sản phẩm phải lớn hơn 0!';
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
}

exports.deleteProduct = async (req, res, next) => {
    let idPR = req.params.idPR;
    // let ObjProduct = await mdProduct.ProductModel.findById(idPR);

    if (req.method == 'DELETE') {
        try {
            await mdProduct.ProductModel.findByIdAndDelete(idPR);
            return res.status(203).json({ success: true, data: {}, message: "Sản phẩm không còn trong shop" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
        }
    }

}