let mdProduct = require("../../model/product.model");
let mdbillProduct = require("../../model/billProduct.model");
let mdReview = require("../../model/review.model");
let mdPet = require("../../model/pet.model");
let mdFavorite = require("../../model/myfavoriteproduct.model");
let mdCategory =
  require("../../model/categoryProduct.model").CategoryProductModel;
const fs = require("fs");
const { match } = require("assert");
const moment = require("moment");
const { onUploadImages } = require("../../function/uploadImage");
exports.listProduct = async (req, res, next) => {
  try {
    if (req.query.hasOwnProperty("page") && req.query.hasOwnProperty("day")) {
      const page = parseInt(req.query.page) || 1;
      const days = parseInt(req.query.day, 10);

      // Validate page and days
      if (page <= 0 || isNaN(page) || days <= 0 || isNaN(days)) {
        return res.status(400).json({
          success: false,
          message: "Số trang và số ngày không hợp lệ.",
        });
      }

      const limit = 10;
      const startIndex = (page - 1) * limit;
      const startDate = moment().subtract(days, "days").toDate();

      // Get product IDs based on page and within the specified days
      const productIds = await mdProduct.ProductModel.find()
        .limit(limit)
        .skip(startIndex)
        .select("_id")
        .exec();

      // Get product details for the retrieved product IDs within the specified days
      const productDetails = await mdbillProduct.billProductModel.aggregate([
        {
          $match: {
            purchaseDate: { $gte: startDate },
            status: 0,
            "products.idProduct": { $in: productIds.map((id) => id._id) },
          },
        },
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: "$products.idProduct",
            totalCount: { $sum: "$products.amount" },
          },
        },
        {
          $sort: { totalCount: -1 },
        },
        {
          $lookup: {
            from: "Products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },

        {
          $unwind: "$productDetails",
        },
        {
          $replaceRoot: { newRoot: "$productDetails" }, // Replace the root with productDetails
        },
        {
          $lookup: {
            from: "Shop",
            localField: "idShop",
            foreignField: "_id",
            as: "idShop",
          },
        },
        {
          $unwind: "$idShop",
        },
        {
          $project: {
            arrProduct: 1,
            nameProduct: 1,
            priceProduct: 1,
            discount: 1,
            type: 1,
            "idShop.nameShop": 1,
            "idShop.locationShop": 1,
            "idShop.avatarShop": 1,
            "idShop.status": 1,
          },
        },
      ]);

      if (productDetails && productDetails.length > 0) {
        return res.status(200).json({
          success: true,
          data: productDetails,
          message: `Sản phẩm được mua nhiều nhất trong thời gian qua ${days} ngày trên trang ${page}`,
        });
      } else {
        return res.status(203).json({
          success: false,
          data: null,
          message: `Không tìm thấy sản phẩm nào được mua trong vòng ${days} ngày trên trang ${page}`,
        });
      }
    } else if (req.query.hasOwnProperty("page")) {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const totalCount = await mdProduct.ProductModel.countDocuments();
      const totalPage = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const pageRegex = /^[0-9]+$/;

      if (page <= 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Số trang phải lớn hơn 0",
        });
      }

      if (!pageRegex.test(page)) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Số trang phải là số nguyên!",
        });
      }

      if (page > totalPage) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Số trang không tồn tại!",
        });
      }

      // const listProduct = await mdProduct.ProductModel.find({ status: 0 })
      //   .select("idShop nameProduct arrProduct type discount rate priceProduct")
      //   .populate("idShop", "nameShop locationShop avatarShop status")
      //   .limit(limit)
      //   .skip(startIndex)
      //   .exec();

      const listProduct = await mdProduct.ProductModel.aggregate([
        {
          $match: { status: 0 }, // Lọc các sản phẩm có status là 0
        },
        {
          $lookup: {
            from: "Review", // Tên của collection chứa đánh giá
            localField: "_id",
            foreignField: "idProduct",
            as: "reviews",
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$reviews.ratingNumber" }, // Tính toán trung bình đánh giá
          },
        },
        {
          $project: {
            idShop: 1,
            nameProduct: 1,
            arrProduct: 1,
            type: 1,
            discount: 1,
            rate: "$averageRating", // Sử dụng trung bình đánh giá làm rate
            priceProduct: 1,
          },
        },
        {
          $lookup: {
            from: "shops", // Tên của collection chứa thông tin cửa hàng
            localField: "idShop",
            foreignField: "_id",
            as: "shop",
          },
        },
        {
          $project: {
            idShop: 1,
            nameProduct: 1,
            arrProduct: 1,
            type: 1,
            discount: 1,
            rate: 1,
            priceProduct: 1,
            shop: {
              $arrayElemAt: ["$shop", 0],
            },
          },
        },
        {
          $project: {
            idShop: "$shop._id",
            nameShop: "$shop.nameShop",
            locationShop: "$shop.locationShop",
            avatarShop: "$shop.avatarShop",
            statusShop: "$shop.status",
            nameProduct: 1,
            arrProduct: 1,
            type: 1,
            discount: 1,
            rate: 1,
            priceProduct: 1,
          },
        },
        {
          $limit: limit,
        },
        {
          $skip: startIndex,
        },
      ]);

      if (listProduct.length > 0) {
        return res.status(200).json({
          success: true,
          data: listProduct,
          message: "Lấy danh sách sản phẩm thành công",
        });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Không có sản phẩm nào" });
      }
    } else if (req.query.hasOwnProperty("day")) {
      const days = parseInt(req.query.day, 10);

      if (isNaN(days) || days <= 0) {
        return res.status(200).json({
          success: false,
          message: "Số ngày không hợp lệ hoặc bị thiếu (trang)",
        });
      }

      const startDate = moment().subtract(days, "days").toDate();

      const productCounts = await mdbillProduct.billProductModel.aggregate([
        {
          $match: {
            status: 0,
            purchaseDate: { $gte: startDate },
          },
        },
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: "$products.idProduct",
            totalCount: { $sum: "$products.amount" },
          },
        },
        {
          $sort: { totalCount: -1 },
        },
        {
          $lookup: {
            from: "Products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $replaceRoot: { newRoot: "$productDetails" }, // Replace the root with productDetails
        },
      ]);

      if (productCounts && productCounts.length > 0) {
        return res.status(200).json({
          success: true,
          data: productCounts,
          message: `Sản phẩm được mua nhiều nhất trong thời gian qua ${days} ngày`,
        });
      } else {
        return res.status(203).json({
          success: false,
          data: null,
          message: `Không tìm thấy idSản phẩm nào trong vòng ${days} ngày`,
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message:
          'Invalid request. Please provide either "page" or "day" parameter.',
      });
    }
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};

exports.listProductFromIdShop = async (req, res, next) => {
  let idShop = req.params.idShop;
  if (req.method == "GET") {
    let listProduct = await mdProduct.ProductModel.find({
      idShop: idShop,
      status: 0,
    }).select("type discount priceProduct nameProduct arrProduct quantitySold");

    if (listProduct) {
      return res.status(200).json({
        success: true,
        data: listProduct,
        message: "Lấy danh sách sản phẩm theo shop thành công",
      });
    } else {
      return res.status(500).json({
        success: false,
        data: [],
        message: "Không lấy được danh sách sản phẩm",
      });
    }
  }
};

exports.detailProduct = async (req, res, next) => {
  let idPR = req.params.idPR;
  let { _id } = req.user;
  let avgProduct = 0;
  let count = 0;
  let favorite = false;
  try {
    const myfavorite = await mdFavorite.FavoriteModel.findOne({ idUser: _id });
    const listReview = await mdReview.ReviewModel.find({ idProduct: idPR });
    if (listReview) {
      const sumReview = listReview.reduce(
        (pre, next) => pre + next.ratingNumber,
        0
      );
      avgProduct = sumReview / listReview.length;
    }
    let ObjProduct = await mdProduct.ProductModel.findById(idPR)
      .populate("idShop")
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

      if (myfavorite && myfavorite?.idProduct?.includes(ObjProduct._id)) {
        favorite = true;
      }
    }
    ObjProduct.idShop.count = count;
    ObjProduct.favorite = favorite;

    await calculateShopAverageRating(ObjProduct.idShop._id)
      .then((avgRating) => {
        ObjProduct.idShop.avgRating = avgRating;
      })
      .catch((err) => {
        console.error("Đã xảy ra lỗi:", err);
      });
    return res.status(200).json({
      success: true,
      data: ObjProduct,
      message: "Lấy chi tiết sản phẩm thành công",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.listCategory = async (req, res, next) => {
  try {
    let listCategory = await mdCategory.find();
    if (listCategory) {
      return res.status(200).json({
        success: true,
        data: listCategory,
        message: "Lấy danh sách thể loại thành công.",
      });
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Lấy danh sách thể loại thất bại!",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.addProduct = async (req, res, next) => {
  let msg = "";
  if (req.method == "POST") {
    let { nameProduct, price, discount, amount, category, detail } = req.body;
    if (
      !nameProduct ||
      !price ||
      !discount ||
      !amount ||
      !category ||
      !detail
    ) {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Không đọc được dữ liệu tải lên!",
      });
    }

    let newObj = new mdProduct.ProductModel();
    let images = await onUploadImages(req.files, "product");
    if (images != [] && images[0] == false) {
      if (images[1].message.indexOf("File size too large.") > -1) {
        return res.status(500).json({
          success: false,
          data: {},
          message: "Dung lượng một ảnh tối đa là 10MB!",
        });
      } else {
        return res
          .status(500)
          .json({ success: false, data: {}, message: images[1].message });
      }
    }
    newObj.nameProduct = nameProduct;
    newObj.arrProduct = [...images];
    newObj.priceProduct = Number(price);
    newObj.discount = Number(discount);
    newObj.idCategoryPr = category;
    newObj.idShop = req.shop._id;
    newObj.amountProduct = Number(amount);
    newObj.detailProduct = detail;
    newObj.quantitySold = 0;
    newObj.type = 1;
    newObj.status = 0;
    newObj.rate = 0;
    newObj.ratings = [];
    newObj.createdAt = new Date();

    try {
      await newObj.save();
      return res.status(201).json({
        success: true,
        data: newObj,
        message: "Thêm sản phẩm thành công.",
      });
    } catch (error) {
      console.log(error.message);
      if (error.message.match(new RegExp(".+`nameProduct` is require+."))) {
        msg = "Tên sản phẩm không được trống!";
      } else if (
        error.message.match(new RegExp(".+`priceProduct` is require+."))
      ) {
        msg = "Giá sản phẩm không được trống!";
      } else if (
        error.message.match(
          new RegExp(".+priceProduct: Cast to Number failed for value+.")
        )
      ) {
        msg = "Giá sản phẩm phải nhập số!";
      } else if (newObj.priceProduct <= 0) {
        msg = "Giá sản phẩm cần lớn hơn 0!";
      } else if (
        error.message.match(new RegExp(".+`amountProduct` is require+."))
      ) {
        msg = "Số lượng sản phẩm không được trống!";
      } else if (
        error.message.match(
          new RegExp(".+amountProduct: Cast to Number failed for value+.")
        )
      ) {
        msg = "Số lượng sản phẩm phải nhập số!";
      } else if (newObj.amountProduct <= 0) {
        msg = "Số lượng sản phẩm cần lớn hơn 0!";
      } else if (
        error.message.match(new RegExp(".+`detailProduct` is require+."))
      ) {
        msg = "Chi tiết sản phẩm không được trống!";
      } else if (
        error.message.match(new RegExp(".+`quantitySold` is require+."))
      ) {
        msg = "Số lượng bán không được trống!";
      } else if (isNaN(newObj.amountProduct) || newObj.amountProduct <= 0) {
        msg = "Giá sản phẩm phải nhập số!";
        return res.status(400).json({ success: false, data: {}, message: msg });
      } else {
        msg = error.message;
      }
      return res.status(500).json({ success: false, data: {}, message: msg });
    }
  }
};

exports.editProduct = async (req, res, next) => {
  if (req.method == "PUT") {
    let { id, nameProduct, price, discount, amount, category, detail } =
      req.body;
    if (
      !id ||
      !nameProduct ||
      !price ||
      !discount ||
      !amount ||
      !category ||
      !detail
    ) {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Không đọc được dữ liệu tải lên!",
      });
    }

    let objProduct = await mdProduct.ProductModel.findById(id);
    if (!objProduct) {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Không tìm thấy dữ liệu sản phẩm!",
      });
    }
    let images = await onUploadImages(req.files, "product");
    if (images != [] && images[0] == false) {
      if (images[1].message.indexOf("File size too large.") > -1) {
        return res.status(500).json({
          success: false,
          data: {},
          message: "Dung lượng một ảnh tối đa là 10MB!",
        });
      } else {
        return res
          .status(500)
          .json({ success: false, data: {}, message: images[1].message });
      }
    }
    objProduct.nameProduct = nameProduct;
    if (JSON.parse(req.body.oldImages) != []) {
      objProduct.arrProduct = [...JSON.parse(req.body.oldImages), ...images];
    } else {
      objProduct.arrProduct = [...images];
    }
    objProduct.priceProduct = Number(price);
    objProduct.discount = Number(discount);
    objProduct.idCategoryPr = category;
    objProduct.idShop = req.shop._id;
    objProduct.amountProduct = Number(amount);
    objProduct.detailProduct = detail;

    try {
      await mdProduct.ProductModel.findByIdAndUpdate(id, objProduct);
      return res.status(201).json({
        success: true,
        data: objProduct,
        message: "Cập nhật sản phẩm thành công.",
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ success: false, data: {}, message: error.message });
    }
  }
};

exports.unremoveProduct = async (req, res, next) => {
  let { idProduct } = req.body;

  if (req.method == "PUT") {
    try {
      let product = await mdProduct.ProductModel.findById(idProduct);
      if (!product) {
        return res.status(201).json({
          success: false,
          data: {},
          message: "Không tìm thấy sản phẩm!",
        });
      }
      product.status = 0;
      await mdProduct.ProductModel.findByIdAndUpdate(idProduct, product);
      return res.status(201).json({
        success: true,
        data: product,
        message: "Đăng sản phẩm lên gian hàng thành công.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
};

exports.removeProduct = async (req, res, next) => {
  let { idProduct } = req.body;

  if (req.method == "PUT") {
    try {
      let product = await mdProduct.ProductModel.findById(idProduct);
      if (!product) {
        return res.status(201).json({
          success: false,
          data: {},
          message: "Không tìm thấy sản phẩm!",
        });
      }
      product.status = 1;
      await mdProduct.ProductModel.findByIdAndUpdate(idProduct, product);
      return res.status(201).json({
        success: true,
        data: product,
        message: "Gỡ sản phẩm khỏi gian hàng thành công.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    let products = await mdProduct.ProductModel.find();
    let productsAfter = [];
    if (!products) {
      return res.status(201).json({
        success: false,
        data: {},
        message: "Không tìm thấy thú cưng!",
      });
    }
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.status = 0;
      await mdProduct.ProductModel.findByIdAndUpdate(product._id, product);
      productsAfter.push(product);
    }
    return res.status(201).json({
      success: true,
      data: productsAfter,
      message: "Gỡ thú cưng khỏi gian hàng thành công.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.deleteProduct = async (req, res, next) => {
  let idProduct = req.params.idProduct;

  if (req.method == "DELETE") {
    try {
      await mdProduct.ProductModel.findByIdAndDelete(idProduct);
      return res
        .status(203)
        .json({ success: true, data: {}, message: "Xóa sản phẩm thành công." });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
};

const calculateShopAverageRating = async (idShop) => {
  try {
    const products = await mdProduct.ProductModel.find({
      idShop: idShop,
    }).lean();
    const pets = await mdPet.PetModel.find({ idShop: idShop }).lean();
    const list = [...products, ...pets];
    const productIds = list.map((product) => product._id);

    const reviews = await mdReview.ReviewModel.find({
      idProduct: { $in: productIds },
    });

    if (reviews.length > 0) {
      const sumReview = reviews.reduce(
        (pre, next) => pre + next.ratingNumber,
        0
      );
      const avgRating = sumReview / reviews.length;
      return avgRating;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Lỗi khi tính trung bình cộng đánh giá của shop:", error);
    throw error;
  }
};
