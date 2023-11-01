const unidecode = require("unidecode");
let mdProduct = require("../../model/product.model");
let mdPet = require("../../model/pet.model");

exports.searchApi = async (req, res, next) => {
  const searchTerm = req.params?.name;
  if (searchTerm) {
    try {
      // Tìm kiếm trong bảng Pet
      const pets = await mdPet.PetModel.find({
        $or: [
          { namePet: { $regex: searchTerm, $options: "i" } },
        ],
      }).limit(5).populate('idShop');

      // Tìm kiếm trong bảng Product
      const products = await mdProduct.ProductModel.find({
        $or: [
          { nameProduct: { $regex: searchTerm, $options: "i" } },
          { detailProduct: { $regex: searchTerm, $options: "i" } },
        ],
      }).limit(5).populate('idShop');
      const searchResults = [...pets, ...products];
      if (searchResults.length > 0) {
        res
          .status(200)
          .json({ success: true, data: searchResults, message: "" });
      }else {
        res
          .status(200)
          .json({ success: true, data: searchResults, message: "Không có dữ liệu" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  } else {
    res.status(500).json({ success: false, message: "Name error" });
  }
};
