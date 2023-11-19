let mdShop = require('../model/shop.model');
var moment = require('moment')
const jwt = require('jsonwebtoken')
const string_word_secret = process.env.TOKEN_SEC_KEY;
const { decodeFromSha256, decodeFromAscii } = require("../function/hashFunction");
const fs = require("fs");

exports.updateShopStatus = async (req, res, next) => {
    let message = ""
    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop);
    console.log("idShop  " + idShop);
    if (req.method == 'POST') {
        try {
            const shop = await mdShop.ShopModel.findById(idShop);
            shop.status = 1;
            await shop.save();

            return res.redirect('/shop');
        } catch (error) {
            message = error.message;
            console.log(message);
        }
    }

    res.render('Shop/updateShop', { message: message, ObjShop: ObjShop });
}



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
                filterSearch = {
                    $or: [
                        { nameShop: { $regex: searchTerm, $options: 'i' } },
                        { email: { $regex: searchTerm, $options: 'i' } }
                    ]
                };
            }
            
            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { fullName: req.query.sortOption };
            }

            const totalCount = await mdShop.ShopModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listShop = await mdShop.ShopModel.find({
                ...filterSearch,
                status: 1 // Thêm điều kiện trạng thái
            }).populate('idUserShop')
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);
            msg = 'Lấy danh sách shop thành công';
            return res.render('Shop/listShop', {
                listShop: listShop,
                countNowShop: listShop.length,
                countAllShop: totalCount,
                msg: msg,
                currentPage: currentPage,
                totalPages: totalPages,
                moment: moment,
                adminLogin:req.session.adLogin
            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách Shop: ' + msg);
        }
    }
    res.render('Shop/listShop', { msg: msg });
}

exports.listShopConfirm = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = null;
    let sortOption = null;
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = {
                    $or: [
                        { nameShop: { $regex: searchTerm, $options: 'i' } },
                        { email: { $regex: searchTerm, $options: 'i' } }
                    ]
                };
            }

            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { fullName: req.query.sortOption };
            }

            const totalCount = await mdShop.ShopModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listShop = await mdShop.ShopModel.find({
                ...filterSearch,
                status: 0 // Thêm điều kiện trạng thái
            }).populate('idUserShop')
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);
            msg = 'Lấy danh sách shop thành công';
            return res.render('Shop/confirmShop', {
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
    res.render('Shop/confirmShop', { msg: msg });
}
exports.detailShop = async (req, res, next) => {

    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop)
    res.render('Shop/detailShop', { ObjShop: ObjShop, moment: moment, adminLogin:req.session.adLogin });
}

exports.detailOwner = async (req, res, next) => {
    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop);
    let objOwner = {};

    if (ObjShop) {
        const data = jwt.verify(ObjShop.ownerIdentity, string_word_secret);
        if (data) {
            if (data._id == idShop) {
                let encodeOwnerIdentity = data.ownerIdentity;
                let decodeData = await decodeFromAscii(encodeOwnerIdentity);
                let decodeObj = { ...JSON.parse(decodeData) };
                let images = [];
                for (let i = 0; i < decodeObj.imageIdentity.length; i++) {
                    const image = decodeFromSha256(decodeObj.imageIdentity[i]);
                    images.push(image);
                }
                decodeObj.imageIdentity = [...images];
                decodeObj.nameIdentity = decodeFromSha256(decodeObj.nameIdentity);
                decodeObj.numberIdentity = decodeFromSha256(decodeObj.numberIdentity);
                decodeObj.dateIdentity = decodeFromSha256(decodeObj.dateIdentity);
                objOwner = { ...decodeObj };
            }
        }
    }
    res.render('Shop/detailOwner', { objOwner: objOwner, moment: moment, adminLogin:req.session.adLogin });
}

exports.deleteShop = async (req, res, next) => {
    let message = ""
    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop);
    if (req.method == 'POST') {
        try {
            await mdShop.ShopModel.findByIdAndDelete(idShop);
            console.log("Xóa thành công");
            return res.redirect('/shop');
        } catch (error) {
            message = error.message;
            console.log(message);
        }
    }

    res.render('Shop/deleteShop', { message: message, ObjShop: ObjShop, adminLogin:req.session.adLogin });
}