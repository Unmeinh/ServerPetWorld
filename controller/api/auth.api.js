const { onUploadImages, onCheckNSFW } = require("../../function/uploadImage");

exports.checkImageNSFW = async (req, res, next) => {
  try {
    let response = await onCheckNSFW(req.file, req.body);
    if (response) {
      return res.status(201).json({
        success: true,
        data: response,
        message: "Kiểm tra ảnh thành công",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
