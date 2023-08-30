let mdCatProduct = require('../../model/categoryProduct.model');
let mdCatPet = require('../../model/categoryPet.model');
exports.listCategory = async (req, res, next) => {
    try {
        let listCatProduct = await mdCatProduct.CategoryProductModel.find();
        let listCatPet = await mdCatPet.CategoryPetModel.find();

       let listAllCat = [...listCatProduct,...listCatPet];
    
        if (listAllCat) {
            return res.status(200).json({ success: true, data: listAllCat, message: "Lấy danh sách thể loại thành công" });
        }
        else {
            return res.status(404).json({ success: false, data: [], message: "Không có dữ liệu nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, data: [], message: "Lỗi: " + error.message });
    }

}