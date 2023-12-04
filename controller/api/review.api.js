let mdReview = require("../../model/review.model");
let mdProduct = require("../../model/product.model");
const mdBill = require("../../model/billProduct.model");
const { onUploadImages } = require("../../function/uploadImage");

exports.listReviewProduct = async (req, res, next) => {
  const idProduct = req.params.idProduct;
  const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Số lượng phần tử trên mỗi trang, mặc định là 10
  let count = 0;
  let sum = 0;

  if (req.method === "GET") {
    try {
      const totalReviews = await mdReview.ReviewModel.countDocuments({
        idProduct: idProduct,
      });
      const totalPages = Math.ceil(totalReviews / pageSize);

      // Calculator AVG ratings
      let listRating = await mdReview.ReviewModel.find({
        idProduct: idProduct,
      });
      if (listRating) {
        sum = listRating.reduce((pre, cur) => pre + cur.ratingNumber, 0);
      }

      //Avg this product
      const avgProduct = sum / totalReviews;

      const listReviewProduct = await mdReview.ReviewModel.find({
        idProduct: idProduct,
      })
        .populate({
          path: "idUser",
          select: "_id fullName avatarUser",
        })
        .select("-idProduct")
        .sort({ ratingNumber: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      if (listReviewProduct.length > 0) {
        return res.status(200).json({
          success: true,
          data: listReviewProduct,
          message: "Danh sách đánh giá của sản phẩm này",
          avgProduct: avgProduct,
          currentPage: page,
          totalPages: totalPages,
        });
      } else {
        return res.status(200).json({
          success: false,
          data: [],
          message: "Không có đánh giá nào!",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy dữ liệu đánh giá sản phẩm.",
      });
    }
  }
};

exports.addReview = async (req, res, next) => {
  let idProduct = req.body.idProduct;
  let idBill = req.params.idBill;
  if (req.method == "POST") {
    //Validate ratingNumber null

    try {
      if (Array.isArray(idProduct)) {
        if (Array.isArray(idProduct)) {
          await Promise.all(
            idProduct.map(async (item) => {
              let newObj = new mdReview.ReviewModel();
              newObj.idProduct = item;
              newObj.idUser = req.user._id;

              let images = await onUploadImages(req.files, "review");
              if (images.length > 0 && images[0] === false) {
                if (images[1].message.indexOf("File size too large.") > -1) {
                  throw new Error("Dung lượng một ảnh tối đa là 10MB!");
                }
              }
              newObj.imageReview = [...images];

              newObj.contentReview = req.body.contentReview;
              newObj.ratingNumber = req.body.ratingNumber;
              newObj.createdAt = new Date();
              await newObj.save();
              await Promise.all(item);
            })
          );
          await mdBill.billProductModel.findByIdAndUpdate(idBill, {
            statusReview: true,
          });

          return res.status(201).json({
            success: true,
            message: "Bạn đã đánh giá thành công",
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "idProduct phải là một mảng",
          });
        }
      } else {
        if (req.body.ratingNumber == 0) {
          return res
            .status(500)
            .json({ success: false, message: "Bạn chưa có đánh giá sản phẩm" });
        }
        let newObj = new mdReview.ReviewModel();
        newObj.idProduct = idProduct;
        newObj.idUser = req.user._id;
        /** Image review */
        let images = await onUploadImages(req.files, "review");
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
        newObj.imageReview = [...images];
        newObj.contentReview = req.body.contentReview;
        newObj.ratingNumber = req.body.ratingNumber;
        newObj.createdAt = new Date();
        await mdBill.billProductModel.findByIdAndUpdate(idBill, {
          statusReview: true,
        });
        try {
          await newObj.save();

          let findProduct = await mdProduct.ProductModel.find({
            _id: idProduct,
          });
          if (findProduct.length > 0) {
            let objProduct = findProduct[0];
            objProduct.ratings.push(newObj);

            await mdProduct.ProductModel.findByIdAndUpdate(
              idProduct,
              objProduct
            );
          }

          return res
            .status(201)
            .json({ success: true, message: "Bạn đã đánh giá thành công" });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Đánh giá thất bại rồi " + error.message,
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};
