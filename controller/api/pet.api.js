let mdPet = require('../../model/pet.model');
const fs = require("fs");

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

exports.addpet = async (req, res, next) => {
    if (req.method == 'POST') {

        let newObj = new mdPet.PetModel();
        newObj.namePet = req.body.namePet;
        // newObj.speciesPet = req.body.speciesPet;
        newObj.weightPet = req.body.weightPet;
        newObj.heightPet = req.body.heightPet;
        newObj.sizePet = req.body.sizePet;
        newObj.idCategoryP = req.body.idCategoryP;
        newObj.pricePet = req.body.pricePet;
        newObj.disCount=0;
        newObj.amountPet = req.body.amountPet;
        newObj.detailPet = req.body.detailPet;
        newObj.idShop = req.body.idShop;
        newObj.type = 0;
        newObj.createdAt = new Date();
        newObj.rate=0;
        if (req.files != undefined) {
            console.log("check " + req.files);
            req.files.map((file, index, arr) => {

                if (file != {}) {
                    fs.renameSync(file.path, './public/upload/' + file.originalname);
                    let imagePath = 'http://localhost:3000/upload/' + file.originalname;
                    newObj.imagesPet.push(imagePath);
                }
            })
        }

        try {
            await newObj.save();
            return res.status(201).json({ success: true, data: newObj, message: 'Thêm thú cưng thành công' });
        } catch (error) {
            console.log(error.message);
            if (error.message.match(new RegExp('.+`namePet` is require+.'))) {
                msg = 'Tên thú cưng đang trống!';
            }
            else if (error.message.match(new RegExp('.+`weightPet` is require+.'))) {
                msg = 'Cân nặng Pet đang trống!';
            }
            else if (isNaN(newObj.weightPet) || newObj.weightPet <= 0) {
                msg = 'Cân nặng phải nhập số lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`heightPet` is require+.'))) {
                msg = 'Chiều cao Pet đang trống!';
            }
            else if (isNaN(newObj.heightPet) || newObj.heightPet <= 0) {
                msg = 'Chiều cao phải nhập số lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`sizePet` is require+.'))) {
                msg = 'Kích cỡ Pet đang trống!';
            }
            else if (error.message.match(new RegExp('.+`pricePet` is require+.'))) {
                msg = 'giá sản phẩm đang trống!';
            }
            else if (isNaN(newObj.pricePet) || newObj.pricePet <= 0) {
                msg = 'Giá Pet phải nhập số lớn hơn 0!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`amountPet` is require+.'))) {
                msg = 'Số lượng Pet đang trống!';
            }
            else if (isNaN(newObj.amountPet) || newObj.amountPet <= 0) {
                msg = 'Số lượng Pet phải nhập số!';
                return res.status(500).json({ success: false, data: {}, message: msg });
            }
            else if (error.message.match(new RegExp('.+`detailPet` is require+.'))) {
                msg = 'Chi tiết Pet đang trống!';
            }
            else if (error.message.match(new RegExp('.+`speciesPet` is require+.'))) {
                msg = 'Loài Pet đang trống!';
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

}
exports.editPet = async (req, res, next) => {
}
exports.deletepet = async (req, res, next) => {
    let idPet = req.params.idPet;

    if (req.method == 'DELETE') {
        try {
            await mdPet.PetModel.findByIdAndDelete(idPet);
            return res.status(203).json({ success: true, data: {}, message: "Thú cưng không còn trong shop" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
        }
    }
}