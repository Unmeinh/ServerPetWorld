let mdPet = require('../../model/pet.model');
let mdCategory = require('../../model/categoryPet.model').CategoryPetModel;
const fs = require("fs");
const { onUploadImages } = require('../../function/uploadImage');
exports.listpet = async (req, res, next) => {
    if (req.method !== 'GET') {
        return res.status(400).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const totalCount = await mdPet.PetModel.countDocuments();
        const totalPage = Math.ceil(totalCount / limit);
        const startIndex = (page - 1) * limit;
        const pageRegex = /^[1-9]+$/;
        if (page <= 0) {
            return res.status(400).json({ success: false, message: 'Số trang phải lớn hơn 0' });
        }
        if (page > totalPage) {
            return res.status(404).json({ success: false, message: 'Số trang không tồn tại!' });
        }
        if (!pageRegex.test(page)) {
            return res.status(500).json({ success: false, message: "Số trang phải là số nguyên!" });
        }
        const listpet = await mdPet.PetModel
            .find()
            .populate('idCategoryP')
            .populate('idShop')
            .limit(limit)
            .skip(startIndex)
            .exec();

        if (listpet.length > 0) {
            return res.status(200).json({ success: true, data: listpet, message: 'Lấy danh sách sản phẩm thành công' });
        } else {
            return res.status(404).json({ success: false, message: 'Không có sản phẩm nào' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.listPetFromIdShop = async (req, res, next) => {
    let idShop = req.params.idShop;
    if (req.method == 'GET') {

        let listPet = await mdPet.PetModel.find({ idShop: idShop }).populate('idCategoryP').populate('idShop');
        if (listPet) {
            return res.status(200).json({ success: true, data: listPet, message: 'Lấy danh sách thú cưng theo shop thành công' });
        }
        else {
            return res.status(500).json({ success: false, data: [], message: 'Không lấy được danh sách thú cưng' });
        }
    }
}
exports.detailpet = async (req, res, next) => {
    let idPet = req.params.idPet;
    try {
        let objPet = await mdPet.PetModel.findById(idPet).populate('idCategoryP').populate('idShop');
        return res.status(200).json({ success: true, data: objPet, message: "Lấy chi tiết thú cưng thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.listCategory = async (req, res, next) => {
    try {
        let listCategory = await mdCategory.find();
        if (listCategory) {
            return res.status(200).json({ success: true, data: listCategory, message: "Lấy danh sách thể loại thành công." });
        } else {
            return res.status(500).json({ success: false, data: {}, message: "Lấy danh sách thể loại thất bại!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.addpet = async (req, res, next) => {
    if (req.method == 'POST') {
        let { namePet, weight, height, price, discount, amount, size, category, detail } = req.body;
        if (!namePet || !weight || !height || !price ||
            !discount || !amount || !size || !category || !detail
        ) {
            return res.status(500).json({ success: false, data: {}, message: 'Không đọc được dữ liệu tải lên!' });
        }
        let newObj = new mdPet.PetModel();
        let images = await onUploadImages(req.files, 'pet')
        if (images != [] && images[0] == false) {
            if (images[1].message.indexOf('File size too large.') > -1) {
                return res.status(500).json({ success: false, data: {}, message: "Dung lượng một ảnh tối đa là 10MB!" });
            } else {
                return res.status(500).json({ success: false, data: {}, message: images[1].message });
            }
        }
        newObj.namePet = namePet;
        newObj.imagesPet = [...images];
        // newObj.speciesPet = speciesPet;
        newObj.weightPet = Number(weight);
        newObj.heightPet = Number(height);
        newObj.sizePet = Number(size);
        newObj.idCategoryP = category;
        newObj.pricePet = Number(price);
        newObj.discount = Number(discount);
        newObj.quantitySold = 0;
        newObj.amountPet = Number(amount);
        newObj.detailPet = detail;
        newObj.idShop = req.shop._id;
        newObj.type = 0;
        newObj.rate = 0;
        newObj.ratings = [];
        newObj.createdAt = new Date();

        try {
            await newObj.save();
            return res.status(201).json({ success: true, data: newObj, message: 'Thêm thú cưng thành công.' });
        } catch (error) {
            console.log(error.message);
            let msg = "";
            if (error.message.match(new RegExp('.+`namePet` is require+.'))) {
                msg = 'Tên thú cưng không được trống!';
            }
            else if (error.message.match(new RegExp('.+`weightPet` is require+.'))) {
                msg = 'Cân nặng không được trống!';
            }
            else if (isNaN(newObj.weightPet) || newObj.weightPet <= 0) {
                msg = 'Cân nặng cần lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`heightPet` is require+.'))) {
                msg = 'Chiều cao không được trống!';
            }
            else if (isNaN(newObj.heightPet) || newObj.heightPet <= 0) {
                msg = 'Chiều cao cần lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`sizePet` is require+.'))) {
                msg = 'Kích cỡ không được trống!';
            }
            else if (error.message.match(new RegExp('.+`pricePet` is require+.'))) {
                msg = 'Giá bán không được trống!';
            }
            else if (isNaN(newObj.pricePet) || newObj.pricePet <= 0) {
                msg = 'Giá bán cần lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`amountPet` is require+.'))) {
                msg = 'Số lượng không được trống!';
            }
            else if (isNaN(newObj.amountPet) || newObj.amountPet <= 0) {
                msg = 'Số lượng cần lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`detailPet` is require+.'))) {
                msg = 'Mô tả không được trống!';
            }
            else if (error.message.match(new RegExp('.+`imagesPet` is require+.'))) {
                msg = 'Ảnh thú cưng không được trống!';
            }
            else {
                msg = error.message;
            }
            return res.status(500).json({ success: false, data: {}, message: msg });
        }
    }
}

exports.editPet = async (req, res, next) => {
    if (req.method == 'PUT') {
        let { id, namePet, weight, height, price, discount, amount, size, category, detail } = req.body;
        if (!id || !namePet || !weight || !height || !price ||
            !discount || !amount || !size || !category || !detail
        ) {
            return res.status(500).json({ success: false, data: {}, message: 'Không đọc được dữ liệu tải lên!' });
        }
        let objPet = await mdPet.PetModel.findById(id);
        if (!objPet) {
            return res.status(500).json({ success: false, data: {}, message: 'Không tìm thấy dữ liệu thú cưng!' });
        }
        let images = await onUploadImages(req.files, 'pet')
        if (images != [] && images[0] == false) {
            if (images[1].message.indexOf('File size too large.') > -1) {
                return res.status(500).json({ success: false, data: {}, message: "Dung lượng một ảnh tối đa là 10MB!" });
            } else {
                return res.status(500).json({ success: false, data: {}, message: images[1].message });
            }
        }
        objPet.namePet = namePet;
        if (JSON.parse(req.body.oldImages) != []) {
            objPet.imagesPet = [...JSON.parse(req.body.oldImages), ...images];
        } else {
            objPet.imagesPet = [...images];
        }
        objPet.weightPet = Number(weight);
        objPet.heightPet = Number(height);
        objPet.sizePet = Number(size);
        objPet.idCategoryP = category;
        objPet.pricePet = Number(price);
        objPet.discount = Number(discount);
        objPet.amountPet = Number(amount);
        objPet.detailPet = detail;

        try {
            await mdPet.PetModel.findByIdAndUpdate(id, objPet);
            return res.status(201).json({ success: true, data: objPet, message: 'Sửa thú cưng thành công.' });
        } catch (error) {
            console.log(error.message);
            let msg = "";
            if (error.message.match(new RegExp('.+`namePet` is require+.'))) {
                msg = 'Tên thú cưng không được trống!';
            }
            else if (error.message.match(new RegExp('.+`weightPet` is require+.'))) {
                msg = 'Cân nặng không được trống!';
            }
            else if (isNaN(newObj.weightPet) || newObj.weightPet <= 0) {
                msg = 'Cân nặng cần lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`heightPet` is require+.'))) {
                msg = 'Chiều cao không được trống!';
            }
            else if (isNaN(newObj.heightPet) || newObj.heightPet <= 0) {
                msg = 'Chiều cao cần lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`sizePet` is require+.'))) {
                msg = 'Kích cỡ không được trống!';
            }
            else if (error.message.match(new RegExp('.+`pricePet` is require+.'))) {
                msg = 'Giá bán không được trống!';
            }
            else if (isNaN(newObj.pricePet) || newObj.pricePet <= 0) {
                msg = 'Giá bán cần lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`amountPet` is require+.'))) {
                msg = 'Số lượng không được trống!';
            }
            else if (isNaN(newObj.amountPet) || newObj.amountPet <= 0) {
                msg = 'Số lượng cần lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`detailPet` is require+.'))) {
                msg = 'Mô tả không được trống!';
            }
            else if (error.message.match(new RegExp('.+`imagesPet` is require+.'))) {
                msg = 'Ảnh thú cưng không được trống!';
            }
            else {
                msg = error.message;
            }
            return res.status(500).json({ success: false, data: {}, message: msg });
        }
    }
}

exports.deletepet = async (req, res, next) => {
    let idPet = req.params.idPet;

    if (req.method == 'DELETE') {
        try {
            await mdPet.PetModel.findByIdAndDelete(idPet);
            return res.status(203).json({ success: true, data: {}, message: "Xóa thú cưng thành công." });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
        }
    }
}