let mdCatProduct = require('../../model/categoryProduct.model');
let mdCatPet = require('../../model/categoryPet.model');
let mdPet = require('../../model/pet.model');
let mdProduct = require('../../model/product.model');

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
exports.listAllFromIdCategory = async (req, res, next) => {
    let idCategory = req.params.idCategory;
    if (req.method == 'GET') {
        let listProduct = await mdProduct.ProductModel.find({ idCategoryPr: idCategory }).populate('idCategoryPr').populate('idShop');
        let listPet = await mdPet.PetModel.find({ idCategoryP: idCategory }).populate('idCategoryP').populate('idShop');
        if (listProduct.length>0 || listPet.length>0) {
            return res.status(200).json({ success: true, data: listProduct || listPet, message: 'Lấy danh sách sản phẩm và pet theo thể loại thành công' });
        }
        else {
            return res.status(500).json({ success: false, data: [], message: 'Không lấy được danh sách sản phẩm' });
        }
    }
}