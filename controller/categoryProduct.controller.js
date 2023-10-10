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
                moment: moment

            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách thể loại sản phẩm: ' + msg);
        }
    }

    // If no search results are found, render a message
    res.render('CategoryProduct/listCategoryProduct', {
        msg: 'Không tìm thấy kết quả phù hợp',
        moment: moment
    });
}
// exports.detailCategoryProduct = async (req, res, next) => {
//     // let msg='';
//     // if(req.method=='GET')
//     // {

//     // }
//     res.render('CategoryProduct/detailCategoryProduct');
// }
exports.addCategoryProduct = async (req, res, next) => {

    let msg = '';
    if (req.method == 'POST') {
        if(req.body.tentheloai.trim()==0)
        {
            msg='Vui lòng không để trống tên thể loại!'
            return res.render('CategoryProduct/addCategoryProduct', { msg: msg });
        }
        if(req.body.tenicon.trim()==0)
        {
            msg='Vui lòng không để trống tên icon!'
            return res.render('CategoryProduct/addCategoryProduct', { msg: msg });
        }
        
        let newObj = new mdCategoryProduct.CategoryProductModel();
        newObj.nameCategory = req.body.tentheloai;
        newObj.nameIcon = req.body.tenicon;
        newObj.createdAt = new Date();
        try {
            msg = 'Thêm thể loại sản phẩm thành công';
            await newObj.save();
            return res.redirect('/category-product');
        } catch (error) {
            msg = error.message
            console.log("Lỗi: " + msg);
            // if (error.message.match(new RegExp('Path `nameCategory` is required'))) {
            //     msg = 'Vui lòng không bỏ trống tên thể loại sản phẩm!';
            // } else if (error.message.match(new RegExp('Path `nameIcon` is required'))) {
            //     msg = 'Vui lòng không bỏ trống tên icon!';
            // } else {
            //     msg = error.message;
            // }
        }
    }
    res.render('CategoryProduct/addCategoryProduct', { msg: msg });
}
exports.editCategoryProduct = async (req, res, next) => {
    let msg = '';
    let idCat = req.params.idCat;
    let Objdata = await mdCategoryProduct.CategoryProductModel.findById(idCat);

    if (req.method == 'POST') {
        
        if(req.body.tentheloai.trim()==0)
        {
            msg='Vui lòng không để trống tên thể loại!'
            return res.render('CategoryProduct/editCategoryProduct', { Objdata: Objdata ,msg:msg});
        }
        if(req.body.tenicon.trim()==0)
        {
            msg='Vui lòng không để trống tên icon!'
            return res.render('CategoryProduct/editCategoryProduct', { Objdata: Objdata ,msg:msg});
        }
        let newObj = new mdCategoryProduct.CategoryProductModel();
        newObj.nameCategory = req.body.tentheloai;
        newObj.nameIcon = req.body.tenicon;
        newObj.createdAt = new Date();
        newObj._id= idCat;
        try {
            await mdCategoryProduct.CategoryProductModel.findByIdAndUpdate(idCat, newObj);
            return res.redirect('/category-product');
        } catch (error) {
            msg=error.message;
            console.log("Lỗi: " + msg);
           
        }
    }
    res.render('CategoryProduct/editCategoryProduct', { Objdata: Objdata ,msg:msg});
};


exports.deleteCategoryProduct = async (req, res, next) => {
    let message = ""
    let idCat = req.params.idCat;
    let Objdata = await mdCategoryProduct.CategoryProductModel.findById(idCat);
    console.log("idcat  " + idCat);
    if (req.method == 'POST') {
        try {
            await mdCategoryProduct.CategoryProductModel.findByIdAndDelete(idCat);
            console.log("xoa thành công");
            return res.redirect('/category-product');
        } catch (error) {
            console.log(error.message);
            console.log("falll");
        }
    }

    res.render('CategoryProduct/deleteCategoryProduct', { message: message, Objdata: Objdata });
}