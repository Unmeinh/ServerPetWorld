let mdpet = require('../model/pet.model');
var moment = require('moment')

exports.listpet = async (req, res, next) => {
    let page = req.query.page || 1;
    let list = await mdpet.PetModel.find();
    let limit = 7;
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let totalCount = await mdpet.PetModel.countDocuments();
    let totalPage = Math.ceil(totalCount / limit);
    let msg = '';
    let filterSearch = null;
    let sortOption = null;
    
    if (endIndex < list.length) {
        page = page + 1;
    }

    if (startIndex > 0) {
        page = page - 1;
    }
    // Validate
    if (page <= 0) {
        return res.render('pet/listpet', {msg: 'Số Page phải lớn hơn 0!'});
    }
    if (isNaN(page)) {
       return res.render('pet/listpet', {msg: 'Số trang page phải là số nguyên'});
    }

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
            const totalPages = Math.ceil(totalCount / limit);

            // Validate the current page number to stay within the correct range
            if (page < 1) page = 1;
            if (page > totalPages) page = totalPages;
        
            let listpet = await mdpet.PetModel.find(filterSearch).populate('idCategoryP').populate('idShop')
                .sort(sortOption)
                .skip(startIndex)
                .limit(limit).exec();

            msg = 'Lấy danh sách  sản phẩm thành công';
            return res.render('pet/listpet', {
                listpet: listpet,
                countNowpet: listpet.length,
                countAllpet: totalCount,
                msg: msg,
                page: page,
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