let mdShop = require('../model/Shop.model');
var moment = require('moment')
const fs = require("fs");
exports.listShop = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let filterSearch = {};
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                // Use a regex to match any username containing the search input character(s)
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { nameShop: new RegExp(searchTerm, 'i') };
            }

            let sortOption = {};
            const selectedSortOption = req.query.sortOption;
            if (selectedSortOption === 'az') {
                sortOption = { nameShop: 1 }; // 1 for ascending order (A-Z)
            } else if (selectedSortOption === 'za') {
                sortOption = { nameShop: -1 }; // -1 for descending order (Z-A)
            }

            const totalCount = await mdShop.ShopModel.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            // Validate the current page number to stay within the correct range
            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listShop = await mdShop.ShopModel.find(filterSearch).populate('idUserShop')
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);

            msg = 'Lấy danh sách Shop thành công';
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
    res.render('Shop/listShop', {
        msg: 'Không tìm thấy kết quả phù hợp',
        moment: moment
    });
}
exports.detailShop = async (req, res, next) => {
    let msg = '';
    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop).populate('idUserShop')
    res.render('Shop/detailShop', { ObjShop: ObjShop });
    console.log("objjjjj" + ObjShop);
}


// nameShop:{type:String,required:true},
// emailShop:{type:String,required:true},
// idUserShop:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserShopModel'},
// locationShop:{type:String,required:true},
// avatarShop:{type:Array,required:true},
// descriptionShop:{type:String,required:true}, 
// statusShop:{type:String,required:true}, 
// followers:{type:Array,required:false},
// hotlineShop:{type:Number,required:true},
// createdAt:{type:String,required:true},
// revenue:{type:Number,required:false}

exports.addShop = async (req, res, next) => {
    let msg = '';
    console.log("reqbody" + req.body.nameShop);
    let newObj = new mdShop.ShopModel();
    newObj.nameShop = req.body.nameShop;
    newObj.emailShop = req.body.emailShop;
    newObj.locationShop = req.body.locationShop;
    newObj.descriptionShop = req.body.descriptionShop;
    newObj.statusShop = req.body.statusShop;
    newObj.followers = req.body.followers;
    newObj.idUserShop = req.body.idUserShop;
    newObj.revenue = req.body.revenue;
    newObj.hotlineShop = req.body.hotlineShop;
    newObj.createdAt = new Date();

    if (req.file) {
            fs.renameSync(req.file.path, './public/upload/' + req.file.originalname);
            console.log("url:http://localhost:3000/upload/" + req.file.originalname);
            newObj.avatarShop = "http://localhost:3000/upload/" + req.file.originalname;
        } else {
            // Set a default image URL if the user didn't upload an image
            newObj.avatarShop = "http://localhost:3000/default-avatar.png";
        } 
    try {
        await newObj.save();
        return res.status(201).json({ success: true, data: newObj, message: 'Them thanh cong' });
    } catch (error) {
        console.log(error.message);


        if (
            !req.body.nameShop &
            !req.body.emailShop &
            !req.body.locationShop &
            !req.body.descriptionShop &
            !req.body.statusShop &
            !req.body.followers &
            !req.body.idUserShop &
            !req.body.revenue &
            !req.body.hotlineShop
        ) {
            return res.status(400).json({ message: 'Vui lòng không để trống!' });
        }

        else if (error.message.match(new RegExp('.+`nameShop` is require+.'))) {
            msg = 'Tên shop đang trống!';
        }
        else if (error.message.match(new RegExp('.+`emailShop` is require+.'))) {
            msg = 'Email shop đang trống!';
        } else if (error.message.match(new RegExp('`emailShop` is invalid+.'))) {
            msg = 'Email shop không đúng định dạng!';
        }
        else if (error.message.match(new RegExp('.+`locationShop` is require+.'))) {
            msg = 'Địa chỉ shop đang trống!';
        }
        else if (error.message.match(new RegExp('.+`descriptionShop` is require+.'))) {
            msg = 'Mô tả shop đang trống!';
        }
        else if (error.message.match(new RegExp('.+`statusShop` is require+.'))) {
            msg = 'Trạng thái đang trống!';
        }
        else if (error.message.match(new RegExp('.+`followers` is require+.'))) {
            msg = 'Số folower đang trống!';
        }
        else if (error.message.match(new RegExp('.+`revenue` is require+.'))) {
            msg = 'Doanh thu đang trống!';
        }
        else if (isNaN(newObj.revenue) || newObj.revenue <= 0) {
            msg = 'Doanh thu phải nhập số!';
            return res.status(400).json({ success: false, data: {}, message: msg });
        }
        else if (error.message.match(new RegExp('.+`hotlineShop` is require+.'))) {
            msg = 'Số điện thoại đang trống!';
        }
        else if (isNaN(newObj.hotlineShop) || newObj.hotlineShop <= 0) {
            msg = 'Số điện thoại phải nhập số!';
            return res.status(400).json({ success: false, data: {}, message: msg });
        }
        else if (newObj.hotlineShop.length !== 10) {
            msg = 'Số điện thoại phải có 10 chữ số!';
            return res.status(400).json({ success: false, data: {}, message: msg });
        }
        else {
            msg = error.message;
        }
        return res.status(500).json({ success: false, data: {}, message: msg });
    }
}
exports.deleteShop = async (req, res, next) => {
    let message = ""
    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop);
    console.log("idShop  " + idShop);
    if (req.method == 'POST') {
        try {
            await mdShop.ShopModel.findByIdAndDelete(idShop);
            console.log("xoa thành công");
            return res.redirect('/Shop');
        } catch (error) {
            console.log(error.message);
            console.log("falll");
        }
    }

    res.render('Shop/deleteShop', { message: message, ObjShop: ObjShop });
}