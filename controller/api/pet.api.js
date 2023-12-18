let mdPet = require('../../model/pet.model');
let mdCategory = require('../../model/categoryPet.model').CategoryPetModel;
const fs = require('fs');
const {onUploadImages} = require('../../function/uploadImage');
let mdProduct = require('../../model/product.model');
let mdReview = require('../../model/review.model');
let mdFavorite = require('../../model/myfavoriteproduct.model');

exports.listpet = async (req, res, next) => {
  // if (req.method !== 'GET') {
  //   return res
  //     .status(400)
  //     .json({success: false, message: 'Method not allowed'});
  // }
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const totalCount = await mdPet.PetModel.countDocuments();
    const totalPage = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const pageRegex = /^[1-9]+$/;
    if (
      req.query.hasOwnProperty('BanChay') &&
      req.query.BanChay === '' &&
      req.query.hasOwnProperty('page')
    ) {
      const days = 7;
      const page = parseInt(req.query.page) || 1;

      if (isNaN(days) || days <= 0 || isNaN(page) || page <= 0) {
        return res.status(200).json({
          success: false,
          message: 'Số ngày hoặc số trang không hợp lệ',
        });
      }
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const startDate = moment().subtract(days, 'days').toDate();
      startDate.setDate(startDate.getDate() - days);

      const productCounts = await mdbillProduct.billProductModel
        .aggregate([
          {
            $match: {
              purchaseDate: {$gte: startDate},
            },
          },
          {
            $unwind: '$products',
          },
          {
            $group: {
              _id: '$products.idProduct',
              totalCount: {$sum: '$products.amount'},
            },
          },
          {
            $sort: {totalCount: -1},
          },
          {
            $lookup: {
              from: 'Pets',
              localField: '_id',
              foreignField: '_id',
              as: 'productDetails',
            },
          },
          {
            $unwind: '$productDetails',
          },
          {
            $replaceRoot: {newRoot: '$productDetails'},
          },
        ])
        .skip(startIndex)
        .limit(limit);

      if (productCounts && productCounts.length > 0) {
        return res.status(200).json({
          success: true,
          data: productCounts,
          message: `Pet được mua nhiều nhất trong thời gian qua ${days} ngày, trang ${page}`,
        });
      } else {
        return res.status(200).json({
          success: false,
          data: null,
          message: `Không tìm thấy Pet nào trong vòng ${days} ngày, trang ${page}`,
        });
      }
    } 
    else if (
      req.query.hasOwnProperty('KhuyenMai') &&
      req.query.KhuyenMai === '' &&
      req.query.hasOwnProperty('page')
    ) {
      const page = parseInt(req.query.page) || 1;

      // Validate page number
      if (page <= 0 || isNaN(page)) {
        return res.status(400).json({
          success: false,
          message: 'Số trang không hợp lệ.',
        });
      }

      const limit = 10;
      const startIndex = (page - 1) * limit;

      // Retrieve pets sorted by descending price
      const listPet = await mdPet.PetModel.find({status: 0})
        .sort({discount: -1}) 
        .select('idShop namePet imagesPet type discount rate pricePet')
        .populate('idShop', 'nameShop locationShop avatarShop status')
        .limit(limit)
        .skip(startIndex)
        .exec();

      if (listPet.length > 0) {
        return res.status(200).json({
          success: true,
          data: listPet,
          message: `Sắp xếp khuyến mãi thú cưng trang ${page}`,
        });
      } else {
        return res.status(200).json({
          success: false,
          data: [],
          message: 'Không có thú cưng nào',
        });
      }
    } 
    else if (
      req.query.hasOwnProperty('GiaGiamDan') &&
      req.query.GiaGiamDan === '' &&
      req.query.hasOwnProperty('page')
    ) {
      const page = parseInt(req.query.page) || 1;

      // Validate page number
      if (page <= 0 || isNaN(page)) {
        return res.status(400).json({
          success: false,
          message: 'Số trang không hợp lệ.',
        });
      }

      const limit = 10;
      const startIndex = (page - 1) * limit;

      // Retrieve pets sorted by descending price
      const listPet = await mdPet.PetModel.find({status: 0})
        .sort({pricePet: -1}) // Sort by descending price
        .select('idShop namePet imagesPet type discount rate pricePet')
        .populate('idShop', 'nameShop locationShop avatarShop status')
        .limit(limit)
        .skip(startIndex)
        .exec();

      if (listPet.length > 0) {
        return res.status(200).json({
          success: true,
          data: listPet,
          message: `Sắp xếp giảm dần theo giá thú cưng trang ${page}`,
        });
      } else {
        return res.status(200).json({
          success: false,
          data: [],
          message: 'Không có thú cưng nào',
        });
      }
    } else if (
      req.query.hasOwnProperty('GiaTangDan') &&
      req.query.GiaTangDan === '' &&
      req.query.hasOwnProperty('page')
    ) {
      const page = parseInt(req.query.page) || 1;

      // Validate page number
      if (page <= 0 || isNaN(page)) {
        return res.status(400).json({
          success: false,
          message: 'Số trang không hợp lệ.',
        });
      }

      const limit = 10;
      const startIndex = (page - 1) * limit;

      // Retrieve pets sorted by descending price
      const listPet = await mdPet.PetModel.find({status: 0})
        .sort({pricePet: 1}) // Sort by descending price
        .select('idShop namePet imagesPet type discount rate pricePet')
        .populate('idShop', 'nameShop locationShop avatarShop status')
        .limit(limit)
        .skip(startIndex)
        .exec();

      if (listPet.length > 0) {
        return res.status(200).json({
          success: true,
          data: listPet,
          message: `Sắp xếp giảm dần theo giá thú cưng trang ${page}`,
        });
      } else {
        return res.status(200).json({
          success: false,
          data: [],
          message: 'Không có thú cưng nào',
        });
      }
    } else {
      if (page <= 0) {
        return res.status(200).json({
          success: false,
          data: [],
          message: 'Số trang phải lớn hơn 0',
        });
      }
      if (page > totalPage) {
        return res.status(200).json({
          success: false,
          data: [],
          message: 'Số trang không tồn tại!',
        });
      }
      if (!pageRegex.test(page)) {
        return res.status(200).json({
          success: false,
          data: [],
          message: 'Số trang phải là số nguyên!',
        });
      }

      const listpet = await mdPet.PetModel.find({status: 0})
        .select('idShop namePet imagesPet type discount rate pricePet')
        .populate('idShop', 'nameShop locationShop avatarShop status')
        .limit(limit)
        .skip(startIndex)
        .exec();

      if (listpet.length > 0) {
        return res.status(200).json({
          success: true,
          data: listpet,
          message: 'Lấy danh sách thú cưng thành công',
        });
      } else {
        return res.status(200).json({
          success: false,
          data: [],
          message: 'Không có thú cưng nào',
        });
      }
    }
  } catch (error) {
    return res.status(200).json({
      success: false,
      data: [],
      message: error.message,
    });
  }
};

exports.listPetFromIdShop = async (req, res, next) => {
  let idShop = req.params.idShop;
  if (req.method == 'GET') {
    let listPet = await mdPet.PetModel.find({
      idShop: idShop,
      status: 0,
    }).select('namePet imagesPet type discount rate pricePet quantitySold');
    if (listPet) {
      return res.status(200).json({
        success: true,
        data: listPet,
        message: 'Lấy danh sách thú cưng theo shop thành công',
      });
    } else {
      return res.status(500).json({
        success: false,
        data: [],
        message: 'Không lấy được danh sách thú cưng',
      });
    }
  }
};
exports.detailpet = async (req, res, next) => {
  let idPR = req.params.idPet;
  let {_id} = req.user;
  let avgProduct = 0;
  let count = 0;
  let favorite = false;

  try {
    const myfavorite = await mdFavorite.FavoriteModel.findOne({idUser: _id});
    const listReview = await mdReview.ReviewModel.find({idProduct: idPR});
    if (listReview) {
      const sumReview = listReview.reduce(
        (pre, next) => pre + next.ratingNumber,
        0,
      );
      avgProduct = sumReview / listReview.length;
    }
    let ObjProduct = await mdPet.PetModel.findById(idPR)
      .populate('idShop')
      .lean();
    ObjProduct.avgProduct = avgProduct;

    if (ObjProduct) {
      let countProductShop = await mdProduct.ProductModel.countDocuments({
        idShop: ObjProduct.idShop._id,
        status: 0,
      });
      let countPetShop = await mdPet.PetModel.countDocuments({
        idShop: ObjProduct.idShop._id,
        status: 0,
      });
      count = countPetShop + countProductShop;
      if (myfavorite) {
        if (myfavorite.idProduct.includes(ObjProduct._id)) {
          favorite = true;
        }
      }
    }
    ObjProduct.idShop.count = count;
    ObjProduct.favorite = favorite;

    await calculateShopAverageRating(ObjProduct.idShop._id)
      .then(avgRating => {
        ObjProduct.idShop.avgRating = avgRating;
      })
      .catch(err => {
        console.error('Đã xảy ra lỗi:', err);
      });
    return res.status(200).json({
      success: true,
      data: ObjProduct,
      message: 'Lấy chi tiết thú cưng thành công',
    });
  } catch (error) {
    return res
      .status(500)
      .json({success: false, data: {}, message: 'Lỗi: ' + error.message});
  }
};

const calculateShopAverageRating = async idShop => {
  try {
    const products = await mdProduct.ProductModel.find({
      idShop: idShop,
    }).lean();
    const pets = await mdPet.PetModel.find({idShop: idShop}).lean();
    const list = [...products, ...pets];
    const productIds = list.map(product => product._id);

    const reviews = await mdReview.ReviewModel.find({
      idProduct: {$in: productIds},
    });

    if (reviews.length > 0) {
      const sumReview = reviews.reduce(
        (pre, next) => pre + next.ratingNumber,
        0,
      );
      const avgRating = sumReview / reviews.length;
      return avgRating;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Lỗi khi tính trung bình cộng đánh giá của shop:', error);
    throw error;
  }
};

exports.listCategory = async (req, res, next) => {
  try {
    let listCategory = await mdCategory.find();
    if (listCategory) {
      return res.status(200).json({
        success: true,
        data: listCategory,
        message: 'Lấy danh sách thể loại thành công.',
      });
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message: 'Lấy danh sách thể loại thất bại!',
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({success: false, data: {}, message: 'Lỗi: ' + error.message});
  }
};

exports.addpet = async (req, res, next) => {
  if (req.method == 'POST') {
    let {
      namePet,
      weight,
      height,
      price,
      discount,
      amount,
      size,
      category,
      detail,
    } = req.body;
    if (
      !namePet ||
      !weight ||
      !height ||
      !price ||
      !discount ||
      !amount ||
      !size ||
      !category ||
      !detail
    ) {
      return res.status(500).json({
        success: false,
        data: {},
        message: 'Không đọc được dữ liệu tải lên!',
      });
    }
    let newObj = new mdPet.PetModel();
    let images = await onUploadImages(req.files, 'pet');
    if (images != [] && images[0] == false) {
      if (images[1].message.indexOf('File size too large.') > -1) {
        return res.status(500).json({
          success: false,
          data: {},
          message: 'Dung lượng một ảnh tối đa là 10MB!',
        });
      } else {
        return res
          .status(500)
          .json({success: false, data: {}, message: images[1].message});
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
    newObj.status = 0;
    newObj.rate = 0;
    newObj.ratings = [];
    newObj.createdAt = new Date();

    try {
      await newObj.save();
      return res.status(201).json({
        success: true,
        data: newObj,
        message: 'Thêm thú cưng thành công.',
      });
    } catch (error) {
      console.log(error.message);
      let msg = '';
      if (error.message.match(new RegExp('.+`namePet` is require+.'))) {
        msg = 'Tên thú cưng không được trống!';
      } else if (
        error.message.match(new RegExp('.+`weightPet` is require+.'))
      ) {
        msg = 'Cân nặng không được trống!';
      } else if (isNaN(newObj.weightPet) || newObj.weightPet <= 0) {
        msg = 'Cân nặng cần lớn hơn 0!';
        return res.status(500).json({success: false, data: {}, message: msg});
      } else if (
        error.message.match(new RegExp('.+`heightPet` is require+.'))
      ) {
        msg = 'Chiều cao không được trống!';
      } else if (isNaN(newObj.heightPet) || newObj.heightPet <= 0) {
        msg = 'Chiều cao cần lớn hơn 0!';
        return res.status(500).json({success: false, data: {}, message: msg});
      } else if (error.message.match(new RegExp('.+`sizePet` is require+.'))) {
        msg = 'Kích cỡ không được trống!';
      } else if (error.message.match(new RegExp('.+`pricePet` is require+.'))) {
        msg = 'Giá bán không được trống!';
      } else if (isNaN(newObj.pricePet) || newObj.pricePet <= 0) {
        msg = 'Giá bán cần lớn hơn 0!';
        return res.status(500).json({success: false, data: {}, message: msg});
      } else if (
        error.message.match(new RegExp('.+`amountPet` is require+.'))
      ) {
        msg = 'Số lượng không được trống!';
      } else if (isNaN(newObj.amountPet) || newObj.amountPet <= 0) {
        msg = 'Số lượng cần lớn hơn 0!';
        return res.status(500).json({success: false, data: {}, message: msg});
      } else if (
        error.message.match(new RegExp('.+`detailPet` is require+.'))
      ) {
        msg = 'Mô tả không được trống!';
      } else if (
        error.message.match(new RegExp('.+`imagesPet` is require+.'))
      ) {
        msg = 'Ảnh thú cưng không được trống!';
      } else {
        msg = error.message;
      }
      return res.status(500).json({success: false, data: {}, message: msg});
    }
  }
};

exports.editPet = async (req, res, next) => {
  if (req.method == 'PUT') {
    let {
      id,
      namePet,
      weight,
      height,
      price,
      discount,
      amount,
      size,
      category,
      detail,
    } = req.body;
    if (
      !id ||
      !namePet ||
      !weight ||
      !height ||
      !price ||
      !discount ||
      !amount ||
      !size ||
      !category ||
      !detail
    ) {
      return res.status(500).json({
        success: false,
        data: {},
        message: 'Không đọc được dữ liệu tải lên!',
      });
    }
    let objPet = await mdPet.PetModel.findById(id);
    if (!objPet) {
      return res.status(500).json({
        success: false,
        data: {},
        message: 'Không tìm thấy dữ liệu thú cưng!',
      });
    }
    let images = await onUploadImages(req.files, 'pet');
    if (images != [] && images[0] == false) {
      if (images[1].message.indexOf('File size too large.') > -1) {
        return res.status(500).json({
          success: false,
          data: {},
          message: 'Dung lượng một ảnh tối đa là 10MB!',
        });
      } else {
        return res
          .status(500)
          .json({success: false, data: {}, message: images[1].message});
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
      return res.status(201).json({
        success: true,
        data: objPet,
        message: 'Sửa thú cưng thành công.',
      });
    } catch (error) {
      console.log(error.message);
      let msg = '';
      if (error.message.match(new RegExp('.+`namePet` is require+.'))) {
        msg = 'Tên thú cưng không được trống!';
      } else if (
        error.message.match(new RegExp('.+`weightPet` is require+.'))
      ) {
        msg = 'Cân nặng không được trống!';
      } else if (isNaN(newObj.weightPet) || newObj.weightPet <= 0) {
        msg = 'Cân nặng cần lớn hơn 0!';
        return res.status(500).json({success: false, data: {}, message: msg});
      } else if (
        error.message.match(new RegExp('.+`heightPet` is require+.'))
      ) {
        msg = 'Chiều cao không được trống!';
      } else if (isNaN(newObj.heightPet) || newObj.heightPet <= 0) {
        msg = 'Chiều cao cần lớn hơn 0!';
        return res.status(500).json({success: false, data: {}, message: msg});
      } else if (error.message.match(new RegExp('.+`sizePet` is require+.'))) {
        msg = 'Kích cỡ không được trống!';
      } else if (error.message.match(new RegExp('.+`pricePet` is require+.'))) {
        msg = 'Giá bán không được trống!';
      } else if (isNaN(newObj.pricePet) || newObj.pricePet <= 0) {
        msg = 'Giá bán cần lớn hơn 0!';
        return res.status(500).json({success: false, data: {}, message: msg});
      } else if (
        error.message.match(new RegExp('.+`amountPet` is require+.'))
      ) {
        msg = 'Số lượng không được trống!';
      } else if (isNaN(newObj.amountPet) || newObj.amountPet <= 0) {
        msg = 'Số lượng cần lớn hơn 0!';
        return res.status(500).json({success: false, data: {}, message: msg});
      } else if (
        error.message.match(new RegExp('.+`detailPet` is require+.'))
      ) {
        msg = 'Mô tả không được trống!';
      } else if (
        error.message.match(new RegExp('.+`imagesPet` is require+.'))
      ) {
        msg = 'Ảnh thú cưng không được trống!';
      } else {
        msg = error.message;
      }
      return res.status(500).json({success: false, data: {}, message: msg});
    }
  }
};

exports.unremovePet = async (req, res, next) => {
  let {idPet} = req.body;

  if (req.method == 'PUT') {
    try {
      let pet = await mdPet.PetModel.findById(idPet);
      if (!pet) {
        return res.status(201).json({
          success: false,
          data: {},
          message: 'Không tìm thấy thú cưng!',
        });
      }
      pet.status = 0;
      await mdPet.PetModel.findByIdAndUpdate(idPet, pet);
      return res.status(201).json({
        success: true,
        data: pet,
        message: 'Đăng thú cưng lên gian hàng thành công.',
      });
    } catch (error) {
      return res
        .status(500)
        .json({success: false, data: {}, message: 'Lỗi: ' + error.message});
    }
  }
};

exports.removePet = async (req, res, next) => {
  let {idPet} = req.body;

  if (req.method == 'PUT') {
    try {
      let pet = await mdPet.PetModel.findById(idPet);
      if (!pet) {
        return res.status(201).json({
          success: false,
          data: {},
          message: 'Không tìm thấy thú cưng!',
        });
      }
      pet.status = 1;
      await mdPet.PetModel.findByIdAndUpdate(idPet, pet);
      return res.status(201).json({
        success: true,
        data: pet,
        message: 'Gỡ thú cưng khỏi gian hàng thành công.',
      });
    } catch (error) {
      return res
        .status(500)
        .json({success: false, data: {}, message: 'Lỗi: ' + error.message});
    }
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    let pets = await mdPet.PetModel.find();
    let petsAfter = [];
    if (!pets) {
      return res.status(201).json({
        success: false,
        data: {},
        message: 'Không tìm thấy thú cưng!',
      });
    }
    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      pet.status = 0;
      await mdPet.PetModel.findByIdAndUpdate(pet._id, pet);
      petsAfter.push(pet);
    }
    return res.status(201).json({
      success: true,
      data: petsAfter,
      message: 'Gỡ thú cưng khỏi gian hàng thành công.',
    });
  } catch (error) {
    return res
      .status(500)
      .json({success: false, data: {}, message: 'Lỗi: ' + error.message});
  }
};

exports.deletepet = async (req, res, next) => {
  let idPet = req.params.idPet;

  if (req.method == 'DELETE') {
    try {
      await mdPet.PetModel.findByIdAndDelete(idPet);
      return res
        .status(203)
        .json({success: true, data: {}, message: 'Xóa thú cưng thành công.'});
    } catch (error) {
      return res
        .status(500)
        .json({success: false, data: {}, message: 'Lỗi: ' + error.message});
    }
  }
};
