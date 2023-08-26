let mdpet = require('../model/pet.model');
var moment = require('moment')
const fs = require("fs");
const multer = require('multer');
exports.listpet = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = {};
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                // Use a regex to match any username containing the search input character(s)
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { namepet: new RegExp(searchTerm, 'i') };
            }

            let sortOption = {};
            const selectedSortOption = req.query.sortOption;
            if (selectedSortOption === 'az') {
                sortOption = { namepet: 1 }; // 1 for ascending order (A-Z)
            } else if (selectedSortOption === 'za') {
                sortOption = { namepet: -1 }; // -1 for descending order (Z-A)
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

exports.addpet = async (req, res, next) => {
    let msg = '';
    // if (
    //     !req.body.namePet ||
    //     !req.body.speciesPet ||
    //     !req.body.detailPet ||
    //     !req.body.sizePet ||
    //     !req.body.heightPet ||
    //     !req.body.idCategoryP ||
    //     !req.body.weightPet ||
    //     !req.body.pricePet ||
    //     !req.body.amountPet
    // ) {
    //     msg = 'Vui lòng không để trống!';
    //     return res.status(400).json({ message: msg });
    // }
        console.log("reqbody"+req.body.namePet);
        let newObj = new mdpet.PetModel();
        newObj.namePet = req.body.namePet;
        newObj.speciesPet = req.body.speciesPet;
        newObj.detailPet = req.body.detailPet;
        newObj.sizePet = req.body.sizePet;
        newObj.heightPet = req.body.heightPet;
        newObj.weightPet = req.body.weightPet;
        newObj.idCategoryP = req.body.idCategoryP;
        newObj.idShop = req.body.idShop;
        newObj.pricePet = req.body.pricePet;
        newObj.amountPet = req.body.amountPet;
        newObj.createdAt = new Date();
    
        if (req.files && req.files.length > 0) {
            newObj.imagesPet = req.files.map(file => "http://localhost:3000/upload/"  + file.originalname); // Lưu đường link + tên tệp vào mảng
        } else {
            newObj.imagesPet = []; // Mảng rỗng nếu không có ảnh được tải lên
        }

        try {
            await newObj.save();
            return res.status(201).json({ success: true, data: newObj, message: 'Them thanh cong' });
        } catch (error) {
            console.log(error.message);
            if (error.message.match(new RegExp('.+`namePet` is require+.'))) {
                msg = 'Tên sản phẩm đang trống!';
            }
            else if (error.message.match(new RegExp('.+`pricePet` is require+.'))) {
                msg = 'giá sản phẩm đang trống!';
            }
            else if (isNaN(newObj.pricePet) || newObj.pricePet <= 0) {
                msg = 'Giá Pet phải nhập số!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`detailPet` is require+.'))) {
                msg = 'Chi tiết Pet đang trống!';
            }
            else if (error.message.match(new RegExp('.+`speciesPet` is require+.'))) {
                msg = 'Loài Pet đang trống!';
            }
            else if (error.message.match(new RegExp('.+`sizePet` is require+.'))) {
                msg = 'Kích cỡ Pet đang trống!';
            }
            else if (error.message.match(new RegExp('.+`heightPet` is require+.'))) {
                msg = 'Chiều cao Pet đang trống!';
            }
            else if (isNaN(newObj.heightPet) || newObj.heightPet <= 0) {
                msg = 'Chiều cao phải nhập số!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`weightPet` is require+.'))) {
                msg = 'Cân nặng Pet đang trống!';
            }
            else if (isNaN(newObj.weightPet) || newObj.weightPet <= 0) {
                msg = 'Cân nặng phải nhập số!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`amountPet` is require+.'))) {
                msg = 'Số lượng Pet đang trống!';
            }
            
            else if (isNaN(newObj.amountPet) || newObj.amountPet <= 0) {
                msg = 'Số lượng Pet phải nhập số!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`imagesPet` is require+.'))) {
                msg = 'ảnh sản phẩm đang trống!';
            }
            else {
                msg = error.message;
            }
            return res.status(500).json({ success: false, data: {}, message: msg });
        }
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