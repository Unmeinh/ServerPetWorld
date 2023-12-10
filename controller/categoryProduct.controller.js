let mdCategoryProduct = require('../model/categoryProduct.model');
var moment = require('moment')

exports.listCategoryProduct = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = null;
    let sortOption = null;
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                // Use a regex to match any username containing the search input character(s)
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { nameCategory: new RegExp(searchTerm, 'i') };
            }
            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { nameCategory: req.query.sortOption };
            }
            const totalCount = await mdCategoryProduct.CategoryProductModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            // Validate the current page number to stay within the correct range
            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listCategoryProduct = await mdCategoryProduct.CategoryProductModel.find(filterSearch)
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);
            msg = 'Lấy danh sách thể loại sản phẩm thành công';
            return res.render('CategoryProduct/listCategoryProduct', {
                listCategoryProduct: listCategoryProduct,
                countNowCategoryProduct: listCategoryProduct.length,
                countAllCategoryProduct: totalCount,
                msg: msg,
                currentPage: currentPage,
                totalPages: totalPages,
                moment: moment,
                adminLogin: req.session.adLogin
            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách thể loại sản phẩm: ' + msg);
        }
    }
}

exports.addCategoryProduct = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        if (req.body.nameCategory == "") {
            msg = 'Vui lòng không để trống tên thể loại!'
            return res.render('CategoryProduct/addCategoryProduct', { msg: msg });
        }
        if (req.body.nameIcon == "") {
            msg = 'Vui lòng không để trống tên icon!'
            return res.render('CategoryProduct/addCategoryProduct', { msg: msg });
        }

        let newObj = new mdCategoryProduct.CategoryProductModel();
        newObj.nameCategory = req.body.nameCategory;
        newObj.nameIcon = req.body.nameIcon;
        newObj.createdAt = new Date();
        try {
            msg = 'Thêm thể loại sản phẩm thành công';
            await newObj.save();
            return res.redirect('/category-product');
        } catch (error) {
            msg = error.message
            console.log("Lỗi: " + msg);
        }
    }
    res.render('CategoryProduct/addCategoryProduct', { msg: msg, adminLogin: req.session.adLogin });
}
exports.editCategoryProduct = async (req, res, next) => {
    let msg = '';
    let idCat = req.params.idCat;
    let Objdata = await mdCategoryProduct.CategoryProductModel.findById(idCat);

    if (req.method == 'POST') {
        if (req.body.nameCategory == "") {
            msg = 'Vui lòng không để trống tên thể loại!'
            return res.render('CategoryProduct/editCategoryProduct', { Objdata: Objdata, msg: msg });
        }
        if (req.body.nameIcon == "") {
            msg = 'Vui lòng không để trống tên icon!'
            return res.render('CategoryProduct/editCategoryProduct', { Objdata: Objdata, msg: msg });
        }
        let newObj = new mdCategoryProduct.CategoryProductModel();
        newObj.nameCategory = req.body.nameCategory;
        newObj.nameIcon = req.body.nameIcon;
        newObj.createdAt = new Date();
        newObj._id = idCat;
        try {
            await mdCategoryProduct.CategoryProductModel.findByIdAndUpdate(idCat, newObj);
            return res.redirect('/category-product');
        } catch (error) {
            msg = error.message;
            console.log("Lỗi: " + msg);
        }
    }
    res.render('CategoryProduct/editCategoryProduct', { Objdata: Objdata, msg: msg, adminLogin: req.session.adLogin });
};

exports.deleteCategoryProduct = async (req, res, next) => {
    let message = ""
    let idCat = req.params.idCat;
    let Objdata = await mdCategoryProduct.CategoryProductModel.findById(idCat);
    if (req.method == 'POST') {
        try {
            await mdCategoryProduct.CategoryProductModel.findByIdAndDelete(idCat);
            return res.redirect('/category-product');
        } catch (error) {
            console.log(error.message);
        }
    }
    res.render('CategoryProduct/deleteCategoryProduct', { message: message, Objdata: Objdata, adminLogin: req.session.adLogin });
}