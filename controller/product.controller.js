let mdProduct = require('../model/product.model');
var moment = require('moment')

exports.listProduct = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let sortOption=null;
    let filterSearch = null;
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                // Use a regex to match any username containing the search input character(s)
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { nameProduct: new RegExp(searchTerm, 'i') };
            }

            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { nameProduct: req.query.sortOption };
            }
     
            const totalCount = await mdProduct.ProductModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            // Validate the current page number to stay within the correct range
            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listProduct = await mdProduct.ProductModel.find(filterSearch).populate('idCategoryPr')
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
    let ObjProduct = await mdProduct.ProductModel.findById(idPR).populate('idCategoryPr');
    res.render('Product/detailProduct', { ObjProduct: ObjProduct });
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
            return res.redirect('/product');
        } catch (error) {
            console.log(error.message);
            console.log("falll");
        }
    }

    res.render('Product/deleteProduct', { message: message, ObjProduct: ObjProduct });
}