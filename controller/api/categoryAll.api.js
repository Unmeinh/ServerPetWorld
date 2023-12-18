let mdCatProduct = require('../../model/categoryProduct.model');
let mdCatPet = require('../../model/categoryPet.model');
let mdPet = require('../../model/pet.model');
let mdProduct = require('../../model/product.model');

exports.listCategory = async (req, res, next) => {
  try {
    let listCatProduct = await mdCatProduct.CategoryProductModel.find();
    let listCatPet = await mdCatPet.CategoryPetModel.find();

    let listAllCat = [...listCatProduct, ...listCatPet];

    if (listAllCat) {
      return res.status(200).json({
        success: true,
        data: listAllCat,
        message: 'Lấy danh sách thể loại thành công',
      });
    } else {
      return res
        .status(404)
        .json({success: false, data: [], message: 'Không có dữ liệu nào!'});
    }
  } catch (error) {
    return res
      .status(500)
      .json({success: false, data: [], message: 'Lỗi: ' + error.message});
  }
};
exports.listAllFromIdCategory = async (req, res, next) => {
  let idCategory = req.params.idCategory;
  if (req.method == 'GET' && idCategory != undefined) {
    try {
      let listProduct = await mdProduct.ProductModel.find({
        idCategoryPr: idCategory,
      }).select('arrProduct nameProduct priceProduct discount type idShop');
      let listPet = await mdPet.PetModel.find({
        idCategoryP: idCategory,
      }).select('namePet imagesPet type discount rate pricePet');

      if (listProduct.length > 0 || listPet.length > 0) {
        const data = [...(listProduct ?? null), ...(listPet ?? null)];

        return res.status(200).json({
          success: true,
          data: data,
          message: 'Lấy danh sách sản phẩm và pet theo thể loại thành công',
        });
      } else {
        return res.status(500).json({
          success: false,
          data: [],
          message: 'Không lấy được danh sách sản phẩm',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: [],
        message: 'Không lấy được danh sách sản phẩm' + error.message,
      });
    }
  }
};

exports.listCategorySort = async (req, res, next) => {
  const idCategory = req.params.idCategory;
  const sortBy = req.query.hasOwnProperty('sortBy')
    ? req.query.sortBy
    : undefined;

  // Validate and parse the page parameter
  const page = req.query.hasOwnProperty('page') ? parseInt(req.query.page) : 1;

  // Check if the parsed page is a valid integer
  if (isNaN(page) || page < 1) {
    return res.status(400).json({
      success: false,
      data: [],
      message:
        'Invalid page parameter. Please provide a valid positive integer.',
    });
  }

  const limit = 10;

  if (req.method === 'GET' && idCategory !== undefined) {
    try {
      const startIndex = (page - 1) * limit;

      const totalProducts = await mdProduct.ProductModel.countDocuments({
        idCategoryPr: idCategory,
      });

      // if (startIndex >= totalProducts) {
      //   return res.status(500).json({
      //     success: false,
      //     data: [],
      //     message: `No data available for page ${page}`,
      //   });
      // }

      let listProduct = await mdProduct.ProductModel.find({
        idCategoryPr: idCategory,
      })
        .select(
          'arrProduct nameProduct priceProduct discount quantitySold type idShop',
        )
        .skip(startIndex)
        .limit(limit);

      let listPet = await mdPet.PetModel.find({
        idCategoryP: idCategory,
      })
        .select('namePet imagesPet type discount rate quantitySold pricePet')
        .skip(startIndex)
        .limit(limit);

      let data = [...listProduct, ...listPet];

      if (data.length > 0) {
        if (sortBy === 'BanChay') {
          data.sort((a, b) => (a.quantitySold > b.quantitySold ? -1 : 1));
        } else if (sortBy === 'KhuyenMai') {
          data.sort((a, b) => (a.discount > b.discount ? -1 : 1));
        } else if (sortBy === 'GiaGiamDan') {
          data.sort(
            (a, b) =>
              (b.priceProduct || b.pricePet) - (a.priceProduct || a.pricePet),
          );
        } else if (sortBy === 'GiaTangDan') {
          data.sort(
            (a, b) =>
              (a.priceProduct || a.pricePet) - (b.priceProduct || b.pricePet),
          );
        }

        return res.status(200).json({
          success: true,
          data: data,
          message: `Lấy danh sách sản phẩm và pet theo thể loại thành công (trang ${page})`,
        });
      } else {
        return res.status(500).json({
          success: false,
          data: [],
          message: 'Không lấy được danh sách sản phẩm',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: [],
        message: 'Không lấy được danh sách sản phẩm' + error.message,
      });
    }
  }
};
