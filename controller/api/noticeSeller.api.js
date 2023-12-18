let mdNotiSeller = require("../../model/noticeSeller.model");
const { onUploadImages } = require("../../function/uploadImage");
exports.listAllNoticeSeller = async (req, res, next) => {
  const { _id } = req.shop;
  const { status } = req.params;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  try {
    if (page <= 0 || isNaN(page) || limit <= 0 || isNaN(limit)) {
      return res.status(400).json({
        success: false,
        message: "Số trang và số mục trên mỗi trang không hợp lệ.",
      });
    }

    const startIndex = (page - 1) * limit;

    const query =
      status == 0 ? { idShop: _id } : { idShop: _id, status: status };
    console.log(query, status);
    const listAllNotice = await mdNotiSeller.NoticeSellerModel.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    if (listAllNotice) {
      return res.status(200).json({
        success: true,
        data: listAllNotice,
        message: "Lấy danh sách tất cả Notice thành công",
      });
    } else {
      return res.status(203).json({
        success: false,
        message: "Không có dữ liệu ",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

function validateNotificationData(notificationData) {
  const message = [];

  if (
    !notificationData.content ||
    notificationData.content.trim().length === 0
  ) {
    message.push("Vui lòng không bỏ trống nội dung!");
  }

  if (!notificationData.detail || notificationData.detail.trim().length === 0) {
    message.push("Vui lòng không bỏ trống chi tiết!");
  }

  if (
    typeof notificationData.status !== "number" ||
    ![0, 1, 2].includes(notificationData.status)
  ) {
    message.push("Trạng thái không hợp lệ!");
  }

  return message;
}
exports.addNotiSeller = async (req, res, next) => {
  console.log("token" + req.shop._id);
  let msg = "";

  let newObj = new mdNotiSeller.NoticeSellerModel();
  newObj.content = req.body.content;
  newObj.detail = req.body.detail;
  newObj.status = req.body.status;
  newObj.idShop = req.shop._id;
  newObj.createdAt = new Date();
  let images = await onUploadImages(req.files, "notice");
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
  newObj.image = [...images];
  const validationErrors = validateNotificationData(newObj);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }
  try {
    await newObj.save();

    return res.status(200).json({
      success: true,
      data: newObj,
      message: "Thêm thông báo thành công!",
    });
  } catch (error) {
    console.log(error.message);

    msg = error.message;
    return res.status(500).json({ success: false, data: {}, message: msg });
  }
  //   res.render('ShopShop/addShopShop', { msg: msg });
};

exports.editNoticeSeller = async (req, res, next) => {
  const { id } = req.shop;
  const listNotice = await mdNotiSeller.NoticeSellerModel.find({
    idShop: id,
    status: { $ne: 2 },
  });
  if (listNotice) {
    await Promise.all(
      listNotice.map(async (item) => {
        item.status = 2;
        await item.save();
        return item;
      })
    );
    return res.status(200).json({ success: true, message: "Đã sửa thông báo" });
  } else {
    return res.status(500).json({ success: false, data: {}, message: msg });
  }
};

exports.deleteNoticeSeller = async (req, res, next) => {
  let idNotice = req.params.idNotice;
  if (req.method == "DELETE") {
    try {
      await mdNotiSeller.NoticeSellerModel.findByIdAndDelete(idNotice);
      return res.status(203).json({
        success: true,
        data: {},
        message: "Thông báo này không còn tồn tại",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
};

exports.onReadingNotice = async (req, res, next) => {
  let idNotice = req.body.idNotice;
  if (req.method == "POST" && idNotice) {
    try {
      let notice = await mdNotiSeller.NoticeSellerModel.findById(idNotice);
      if (!notice) {
        return res.status(201).json({
          success: false,
          data: {},
          message: "Không tìm thấy thông báo!",
        });
      }
      notice.status = 2;
      notice.save();
      return res.status(201).json({
        success: true,
        data: {},
        message: "Xem thông báo thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
}