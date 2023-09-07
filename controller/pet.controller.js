let mdpet = require('../model/pet.model');
var moment = require('moment')

exports.listpet = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = null;
    let sortOption = null;
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { namePet: new RegExp(searchTerm, 'i') };
            }

            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { namePet: req.query.sortOption };
            }

            const totalCount = await mdpet.PetModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            // Validate the current page number to stay within the correct range
            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;
            const skipCount = (currentPage - 1) * perPage;
            let listpet = await mdpet.PetModel.find(filterSearch).populate('idCategoryP').populate('idShop')
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);

            msg = 'Lấy danh sách  sản phẩm thành công';
            return res.render('pet/listpet', {
                listpet: listpet,
                countNowpet: listpet.length,
                countAllpet: totalCount,
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
    res.render('pet/listpet', {
        msg: 'Không tìm thấy kết quả phù hợp',
        moment: moment
    });
}
exports.detailpet = async (req, res, next) => {
    let msg = '';
    let idP = req.params.idP;
    let Objpet = await mdpet.PetModel.findById(idP).populate('idCategoryP').populate('idShop');
    res.render('pet/detailpet', { Objpet: Objpet });
    console.log("objjjjj" + Objpet);
}

exports.deletepet = async (req, res, next) => {
    let message = ""
    let idP = req.params.idP;
    let Objpet = await mdpet.PetModel.findById(idP);
    console.log("idP  " + idP);
    if (req.method == 'POST') {
        try {
            await mdpet.PetModel.findByIdAndDelete(idP);
            console.log("xoa thành công");
            return res.redirect('/pet');
        } catch (error) {
            console.log(error.message);
            console.log("falll");
        }
    }

    res.render('pet/deletepet', { message: message, Objpet: Objpet });
}