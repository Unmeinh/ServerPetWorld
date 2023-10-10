let mdShop = require('../../model/shop.model');
let fs = require("fs");
let validator = require('email-validator');
var phoneValidate = /^\d{9}$/

exports.listShop = async (req, res, next) => {
    let filterSearch = null;

    if (req.method == 'GET') {
        try {
            if (typeof (req.query.filterSearch) != 'undefined' && req.query.filterSearch.trim() != '') {
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { fullName: new RegExp(searchTerm, 'i') };
            }
            let listShop = await mdShop.ShopModel.find(filterSearch).populate('idUserShop');
            return res.status(200).json({ success: true, data: listShop, message: 'Lấy danh sách shop thành công' });
        } catch (error) {
            return res.status(500).json({ success: false, data: [], message: 'Lỗi: ' + error.message });
        }
    }

}
exports.detailShop = async (req, res, next) => {

    let idShop = req.params.idShop;
    try {
        let ObjShop = await mdShop.ShopModel.findById(idShop).populate('idUserShop');
        return res.status(200).json({ success: true, data: ObjShop, message: "Lấy dữ liệu chi tiết shop thành công" });

    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.addShop = async (req, res, next) => {
    let msg = '';
    if (req.method == 'POST') {
        let newObj = new mdShop.ShopModel();
        newObj.nameShop = req.body.nameShop;
        newObj.email = req.body.email;
        newObj.locationShop = req.body.locationShop;
        if (req.file) {
            fs.renameSync(req.file.path, './public/upload/' + req.file.originalname);
            newObj.avatarShop = "http://localhost:3000/upload/" + req.file.originalname;
        } else {
            // Set a default image URL if the user didn't upload an image
            newObj.avatarShop = "http://localhost:3000/upload/avatar_null.png";
        }
        newObj.description = req.body.description;
        newObj.status = 'Chưa được duyệt';
        newObj.followers = 0;
        newObj.idUserShop = req.body.idUserShop;
        newObj.revenue = 0;
        newObj.hotline = req.body.hotline;
        newObj.createdAt = new Date();

        try {
            await newObj.save();
            return res.status(201).json({ success: true, data: newObj, message: 'Thêm shop thanh công' });
        } catch (error) {
            console.log(error.message);

            if (
                !req.body.nameShop &
                !req.body.email &
                !req.body.locationShop &
                !req.body.description &
                !req.body.status &
                !req.body.idUserShop &
                !req.body.hotline
            ) {
                msg = 'Không để trống thông tin'
            }

            else if (error.message.match(new RegExp('.+`nameShop` is require+.'))) {
                msg = 'Tên shop đang trống!';
            }
            else if (error.message.match(new RegExp('.+`email` is require+.'))) {
                msg = 'Email shop đang trống!';
            }
            else if (!validator.validate(req.body.email)) {
                msg = 'Email shop không đúng định dạng!';
            }
            else if (error.message.match(new RegExp('.+`locationShop` is require+.'))) {
                msg = 'Địa chỉ shop đang trống!';
            }
            else if (error.message.match(new RegExp('.+`description` is require+.'))) {
                msg = 'Mô tả shop đang trống!';
            }
            else if (error.message.match(new RegExp('.+`hotline` is require+.'))) {
                msg = 'Số điện thoại đang trống!';
            }
            else if (error.message.match(new RegExp('.+Number failed for value \"+.'))) {
                msg = 'Số điện thoại phải nhập số dương!';
            }

            else {
                msg = error.message;
            }
           
            if (!phoneValidate.test(req.body.hotline)) {
                msg = 'Số điện thoại chưa đúng định đạng 9 số!';
                return res.status(500).json({ success: false, data: {}, message: msg });

            }
            return res.status(500).json({ success: false, data: {}, message: msg });
        }
    }

}

exports.editShop = async (req, res, next) => {
    let msg = '';
    let idShop = req.params.idShop;
    if (req.method == 'PUT') {
        // let ObjShop = await mdShop.ShopModel.findById(idShop);
        let newObj = new mdShop.ShopModel();
        newObj.nameShop = req.body.nameShop;
        newObj.email = req.body.email;
        newObj.locationShop = req.body.locationShop;
        if (req.file) {
            fs.renameSync(req.file.path, './public/upload/' + req.file.originalname);
            newObj.avatarShop = "http://localhost:3000/upload/" + req.file.originalname;
        } else {
            // Set a default image URL if the user didn't upload an image
            newObj.avatarShop = "http://localhost:3000/upload/avatar_null.png";
        }
        newObj.description = req.body.description;
        newObj.status = 'Chưa được duyệt';
        newObj.followers = 0;
        newObj.idUserShop = req.body.idUserShop;
        newObj.revenue = 0;
        newObj.hotline = req.body.hotline;
        newObj.createdAt = new Date();
        newObj._id = idShop;

        try {
            await mdShop.ShopModel.findByIdAndUpdate(idShop, newObj);
            return res.status(201).json({ success: true, data: newObj, message: 'Cập nhật shop thành công' });
        } catch (error) {
            console.log(error.message);

            if (
                !req.body.nameShop &
                !req.body.email &
                !req.body.locationShop &
                !req.body.description &
                !req.body.status &
                !req.body.idUserShop &
                !req.body.hotline
            ) {
                msg = 'Không để trống thông tin'
            }

            else if (error.message.match(new RegExp('.+`nameShop` is require+.'))) {
                msg = 'Tên shop đang trống!';
            }
            else if (error.message.match(new RegExp('.+`email` is require+.'))) {
                msg = 'Email shop đang trống!';
            }
            else if (!validator.validate(req.body.email)) {
                msg = 'Email shop không đúng định dạng!';
            }
            else if (error.message.match(new RegExp('.+`locationShop` is require+.'))) {
                msg = 'Địa chỉ shop đang trống!';
            }
            else if (error.message.match(new RegExp('.+`description` is require+.'))) {
                msg = 'Mô tả shop đang trống!';
            }
            else if (error.message.match(new RegExp('.+`hotline` is require+.'))) {
                msg = 'Số điện thoại đang trống!';
            }
            else if (error.message.match(new RegExp('.+Number failed for value \"+.'))) {
                msg = 'Số điện thoại phải nhập số dương!';
            }

            else {
                msg = error.message;
            }
            var phoneValidate = /^\d{10}$/
            if (!phoneValidate.test(req.body.hotline)) {
                msg = 'Số điện thoại chưa đúng định đạng 9 số!';
                return res.status(500).json({ success: false, data: {}, message: msg });

            }
            return res.status(500).json({ success: false, data: {}, message: msg });
        }
    }
}

exports.deleteShop = async (req, res, next) => {
    let idShop = req.params.idShop;
    let ObjShop = await mdShop.ShopModel.findById(idShop);

    if (req.method == 'DELETE') {
        try {
            await mdShop.ShopModel.findByIdAndDelete(idShop);
            return res.status(203).json({ success: true, data: {}, message: "Shop không còn tồn tại" });

        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });

        }
    }

}