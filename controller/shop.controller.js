let mdShop = require('../model/shop.model');
var moment = require('moment')
const fs = require("fs");
exports.listShop = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = null;
    let sortOption = null;
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { fullName: new RegExp(searchTerm, 'i') };
            }

            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { fullName: req.query.sortOption };
            }

            const totalCount = await mdShop.ShopModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listShop = await mdShop.ShopModel.find(filterSearch).populate('idUserShop')
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);

            msg = 'Lấy danh sách shop thành công';
            console.log('lisstDhsHOP '+listShop);
            return res.render('Shop/listShop', {
                listShop: listShop,
                countNowShop: listShop.length,
                countAllShop: totalCount,
                msg: msg,
                currentPage: currentPage,
                totalPages: totalPages,
                moment: moment
            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách Shop: ' + msg);
        }
    }

    // If no search results are found, render a message
    res.render('Shop/listShop', {msg: msg});
}
exports.detailShop = async (req, res, next) => {
   
    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop).populate('idUserShop')
    res.render('Shop/detailShop', { ObjShop: ObjShop ,moment:moment});
    console.log("objjjjj" + ObjShop);
}

exports.deleteShop = async (req, res, next) => {
    let message = ""
    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop);
    console.log("idShop  " + idShop);
    if (req.method == 'POST') {
        try {
            await mdShop.ShopModel.findByIdAndDelete(idShop);
            console.log("Xóa thành công");
            return res.redirect('/shop');
        } catch (error) {
            message=error.message;
            console.log(message);
        }
    }

    res.render('Shop/deleteShop', { message: message, ObjShop: ObjShop });
}