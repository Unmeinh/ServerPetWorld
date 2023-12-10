let mdCategoryPet = require('../model/categoryPet.model');
var moment = require('moment')

exports.listCategoryPet = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = null;
    let sortOption = null;
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { nameCategory: new RegExp(searchTerm, 'i') };
            }
            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { nameCategory: req.query.sortOption };
            }
            const totalCount = await mdCategoryPet.CategoryPetModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listCategoryPet = await mdCategoryPet.CategoryPetModel.find(filterSearch)
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);

            msg = 'Lấy danh sách thể loại thú cưng thành công';
            return res.render('CategoryPet/listCategoryPet', {
                listCategoryPet: listCategoryPet,
                countNowCategoryPet: listCategoryPet.length,
                countAllCategoryPet: totalCount,
                msg: msg,
                currentPage: currentPage,
                totalPages: totalPages,
                moment: moment,
                adminLogin: req.session.adLogin
            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách thể loại thú cưng: ' + msg);
        }
    }
}

exports.addCategoryPet = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        if(req.body.nameCategory == "")
        {
            msg='Vui lòng không để trống tên thể loại!'
            return res.render('CategoryPet/addCategoryPet', { msg: msg });
        }
        if(req.body.nameIcon == "")
        {
            msg='Vui lòng không để trống tên icon!'
            return res.render('CategoryPet/addCategoryPet', { msg: msg });
        }
        
        let newObj = new mdCategoryPet.CategoryPetModel();
        newObj.nameCategory = req.body.nameCategory;
        newObj.nameIcon = req.body.nameIcon;
        newObj.createdAt = new Date();
        try {
            msg = 'Thêm thể loại thú cưng thành công';
            await newObj.save();
            return res.redirect('/category-pet');
        } catch (error) {
            msg = error.message
            console.log("Lỗi: " + msg);
        }
    }
    res.render('CategoryPet/addCategoryPet', { msg: msg,adminLogin: req.session.adLogin });
}
exports.editCategoryPet = async (req, res, next) => {
    let msg = '';
    let idCat = req.params.idCat;
    let Objdata = await mdCategoryPet.CategoryPetModel.findById(idCat);

    if (req.method == 'POST') {
        if(req.body.nameCategory.trim()==0)
        {
            msg='Vui lòng không để trống tên thể loại!'
            return res.render('CategoryProduct/editCategoryProduct', { Objdata: Objdata ,msg:msg});
        }
        if(req.body.nameIcon.trim()==0)
        {
            msg='Vui lòng không để trống tên icon!'
            return res.render('CategoryProduct/editCategoryProduct', { Objdata: Objdata ,msg:msg});
        }
        let newObj = new mdCategoryPet.CategoryPetModel();
        newObj.nameCategory = req.body.nameCategory;
        newObj.nameIcon = req.body.nameIcon;
        newObj.createdAt = new Date();
        newObj._id= idCat;
        try {
            await mdCategoryPet.CategoryPetModel.findByIdAndUpdate(idCat, newObj);
            return res.redirect('/category-pet');
        } catch (error) {
            msg=error.message;
            console.log("Lỗi: " + msg);
        }
    }
    res.render('CategoryPet/editCategoryPet', { Objdata: Objdata ,msg:msg, adminLogin: req.session.adLogin});
};

exports.deleteCategoryPet = async (req, res, next) => {
    let message = ""
    let idCat = req.params.idCat;
    let Objdata = await mdCategoryPet.CategoryPetModel.findById(idCat);
 
    if (req.method == 'POST') {
        try {
            await mdCategoryPet.CategoryPetModel.findByIdAndDelete(idCat);
            return res.redirect('/category-pet');
        } catch (error) {
            console.log(error.message);
        }
    }
    res.render('CategoryPet/deleteCategoryPet', { message: message, Objdata: Objdata, adminLogin: req.session.adLogin });
}