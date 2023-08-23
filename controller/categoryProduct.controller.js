let mdCategoryProduct = require('../model/categoryProduct.model');
var moment = require('moment')
let msg = '';

exports.listCategoryProduct = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = {};
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                // Use a regex to match any username containing the search input character(s)
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { nameCategoryProduct: new RegExp(searchTerm, 'i') };
            }

            let sortOption = {};
            const selectedSortOption = req.query.sortOption;
            if (selectedSortOption === 'az') {
                sortOption = { nameCategoryProduct: 1 }; // 1 for ascending order (A-Z)
            } else if (selectedSortOption === 'za') {
                sortOption = { nameCategoryProduct: -1 }; // -1 for descending order (Z-A)
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
exports.detailCategoryProduct = async (req, res, next) => {
    // let msg='';
    // if(req.method=='GET')
    // {

    // }
    res.render('CategoryProduct/detailCategoryProduct');
}
exports.addCategoryProduct = async (req, res, next) => {
    if (req.method == 'POST') {
        let newObj = new mdCategoryProduct.CategoryProductModel();
        newObj.nameCategoryProduct = req.body.tentheloai;
        newObj.nameIcon = req.body.tenicon;
        newObj.createdAt = new Date();
        try {
            await newObj.save();
            message = 'Thêm người dùng shop thành công!';
            console.log("them okkkkkkk");
            return res.redirect('/categoryProduct');
        } catch (error) {
            console.log(error.message);
            console.log("falll");
        }

    }
    res.render('CategoryProduct/addCategoryProduct');
}
exports.editCategoryProduct = async (req, res, next) => {
    try {
        let idCat = req.params.idCat;

        if (req.method == 'POST') {
            try {
                await mdCategoryProduct.CategoryProductModel.findByIdAndUpdate(idCat, {
                    nameCategoryProduct: req.body.tentheloai,
                    nameIcon: req.body.tenicon,
                    createdAt: new Date()
                });

                return res.redirect('/categoryProduct');
            } catch (error) {
                console.error("Error updating category product:", error.message);
                return res.status(500).send("Internal Server Error");
            }
        }

        let Objdata = await mdCategoryProduct.CategoryProductModel.findById(idCat);
        if (!Objdata) {
            console.error("Category product not found");
            return res.status(404).send("Category Product Not Found");
        }

        res.render('CategoryProduct/editCategoryProduct', { Objdata: Objdata });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).send("Internal Server Error");
    }
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
            return res.redirect('/categoryProduct');
        } catch (error) {
            console.log(error.message);
            console.log("falll");
        }
    }

    res.render('CategoryProduct/deleteCategoryProduct', { message: message, Objdata: Objdata });
}