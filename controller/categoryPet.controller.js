let mdCategoryPet = require('../model/categoryPet.model');
var moment = require('moment')
let msg = '';

exports.listCategoryPet = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = {};
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                // Use a regex to match any username containing the search input character(s)
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { nameCategoryPet: new RegExp(searchTerm, 'i') };
            }

            let sortOption = {};
            const selectedSortOption = req.query.sortOption;
            if (selectedSortOption === 'az') {
                sortOption = { nameCategoryPet: 1 }; // 1 for ascending order (A-Z)
            } else if (selectedSortOption === 'za') {
                sortOption = { nameCategoryPet: -1 }; // -1 for descending order (Z-A)
            }

            const totalCount = await mdCategoryPet.CategoryPetModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            // Validate the current page number to stay within the correct range
            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listCategoryPet = await mdCategoryPet.CategoryPetModel.find(filterSearch)
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);

            msg = 'Lấy danh sách thể loại sản phẩm thành công';
            return res.render('CategoryPet/listCategoryPet', {
                listCategoryPet: listCategoryPet,
                countNowCategoryPet: listCategoryPet.length,
                countAllCategoryPet: totalCount,
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
    res.render('CategoryPet/listCategoryPet', {
        msg: 'Không tìm thấy kết quả phù hợp',
        moment: moment
    });
}
exports.addCategoryPet = async (req, res, next) => {
    if (req.method == 'POST') {
        let newObj = new mdCategoryPet.CategoryPetModel();
        newObj.nameCategoryPet = req.body.tentheloai;
        newObj.nameIcon = req.body.tenicon;
        newObj.createdAt = new Date();
        try {
            await newObj.save();
            message = 'Thêm người dùng shop thành công!';
            console.log("them okkkkkkk");
            return res.redirect('/categoryPet');
        } catch (error) {
            console.log(error.message);
            console.log("falll");
        }

    }
    res.render('CategoryPet/addCategoryPet');
}
exports.editCategoryPet = async (req, res, next) => {
    try {
        let idPet = req.params.idPet;

        if (req.method == 'POST') {
            try {
                await mdCategoryPet.CategoryPetModel.findByIdAndUpdate(idPet, {
                    nameCategoryPet: req.body.tentheloai,
                    nameIcon: req.body.tenicon,
                    createdAt: new Date()
                });

                return res.redirect('/categoryPet');
            } catch (error) {
                console.error("Error updating category pet:", error.message);
                return res.status(500).send("Internal Server Error");
            }
        }

        let ObjPet = await mdCategoryPet.CategoryPetModel.findById(idPet);
        if (!ObjPet) {
            console.error("Category pet not found");
            return res.status(404).send("Category Pet Not Found");
        }

        res.render('CategoryPet/editCategoryPet', { ObjPet: ObjPet });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).send("Internal Server Error");
    }
};


exports.deleteCategoryPet = async (req, res, next) => {
    let message = ""
    let idPet = req.params.idPet;
    let ObjPet = await mdCategoryPet.CategoryPetModel.findById(idPet);
    console.log("idPet  " + idPet);
    if (req.method == 'POST') {
        try {
            await mdCategoryPet.CategoryPetModel.findByIdAndDelete(idPet);
            console.log("xoa thành công");
            return res.redirect('/categoryPet');
        } catch (error) {
            console.log(error.message);
            console.log("falll");
        }
    }

    res.render('CategoryPet/deleteCategoryPet', { message: message, ObjPet: ObjPet });
}