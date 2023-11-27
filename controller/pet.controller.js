let mdpet = require('../model/pet.model');
var moment = require('moment')

exports.listpet = async (req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    const perPage = 7
    let msg = '';
    let hidden = "";
    let filterSearch = null;
    let sortOption = null;

    // Validate
    // if (page <= 0) {
    //     return res.render('pet/listpet', {msg: 'Số Page phải lớn hơn 0!'});
    // }
    // if (isNaN(page)) {
    //    return res.render('pet/listpet', {msg: 'Số trang page phải là số nguyên'});
    // }

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = {
                    $or: [
                        { namePet: { $regex: searchTerm, $options: 'i' } },
                        // { pricePet: { $regex: searchTerm, $options: 'i' } }
                    ]
                };
            }
            
            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { namePet: req.query.sortOption };
            }

            const totalCount = await mdpet.PetModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            if (page < 1) {

            }

            const skipCount = (page - 1) * perPage;

            let listpet = await mdpet.PetModel.find(filterSearch).populate('idCategoryP').populate('idShop')
                .sort(sortOption).sort({ createdAt: -1 })
                .skip(skipCount)
                .limit(perPage);
            if (listpet.length == 0) {
                hidden = "hidden";
            }
            msg = 'Lấy danh sách  sản phẩm thành công';
            return res.render('Pet/listPet', {
                listpet: listpet,
                countNowpet: listpet.length,
                countAllpet: totalCount,
                msg: msg,
                page: page,
                totalPages: totalPages,
                moment: moment,
                adminLogin: req.session.adLogin,
                hidden: hidden
            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách sản phẩm: ' + msg);
        }
    }

    res.render('Pet/listPet', {
        msg: 'Không tìm thấy kết quả phù hợp',
        moment: moment,
        adminLogin: req.session.adLogin
    });
}
exports.detailpet = async (req, res, next) => {
    let msg = '';
    let idP = req.params.idP;
    let Objpet = await mdpet.PetModel.findById(idP).populate('idCategoryP').populate('idShop');
    res.render('Pet/detailPet', { Objpet: Objpet, adminLogin: req.session.adLogin });
}

exports.deletepet = async (req, res, next) => {
    let message = ""
    let idP = req.params.idP;
    let Objpet = await mdpet.PetModel.findById(idP);
  
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

    res.render('Pet/deletePet', { message: message, Objpet: Objpet, adminLogin: req.session.adLogin });
}

