let mdNoti = require('../../model/notice.model');
const { onUploadImages } = require('../../function/uploadImage');
exports.listAllNotice = async (req, res, next) => {
  const {_id}=req.user;
  try {
      let listAllNotice = await mdNoti.NoticeModel.find({idUser: _id});
      if (listAllNotice) {
          return res.status(200).json({ success: true, data: listAllNotice, message: "Lấy danh sách tất cả Notice thành công" });
      }
      else {
          return res.status(203).json({ success: false, message: "Không có dữ liệu blog" });
      }

  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
}

function validateNotificationData(notificationData) {
  const message = [];

  if (!notificationData.content || notificationData.content.trim().length === 0) {
    message.push('Vui lòng không bỏ trống nội dung!');
  }

  if (!notificationData.detail || notificationData.detail.trim().length === 0) {
    message.push('Vui lòng không bỏ trống chi tiết!');
  }

  if (typeof notificationData.status !== 'number' || ![0, 1, 2].includes(notificationData.status)) {
    message.push('Trạng thái không hợp lệ!');
  }

  // Kiểm tra các điều kiện khác cần thiết

  return message;
}
exports.addNoti = async (req, res, next) => {
    console.log("token" + req.user._id)
    let msg = '';


      let newObj = new mdNoti.NoticeModel();
      newObj.content = req.body.content;
      newObj.detail = req.body.detail;
      newObj.status = req.body.status;
      newObj.idUser = req.user._id;
      newObj.createdAt = new Date();
      let images = await onUploadImages(req.files, 'notice')
            if (images != [] && images[0] == false) {
                if (images[1].message.indexOf('File size too large.') > -1) {
                    return res.status(500).json({ success: false, data: {}, message: "Dung lượng một ảnh tối đa là 10MB!" });
                } else {
                    return res.status(500).json({ success: false, data: {}, message: images[1].message });
                }
            } 
            newObj.image = [...images];
      const validationErrors = validateNotificationData(newObj);

      if (validationErrors.length > 0) {
     // Xử lý lỗi nếu có
     return res.status(400).json({ errors: validationErrors });
}
      try {
        await newObj.save();
        
        return res.status(200).json({ success: true, data:newObj,  message :'Thêm thông báo thành công!'});
      } catch (error) {
        console.log(error.message);
    
          msg = error.message;
          return res.status(500).json({ success: false, data: {}, message: msg });
      }
    //   res.render('UserShop/addUserShop', { msg: msg });
    }
    
  
    exports.editNotice = async (req, res, next) => {
      console.log("đã chạy vào đây");
      console.log("lay user" + req.user);
      let msg = "";
      let idNotice = req.params.idNotice;
     
      // Lấy thông tin thông báo hiển thị lên giao diện
      var objNotice = await mdNoti.NoticeModel.findById(idNotice);
    
      // Xử lý POST
      if (req.method === "PUT") {
        let newObj = new mdNoti.NoticeModel();
        const validationErrors = validateNotificationData(newObj);

      if (validationErrors.length > 0) {
        // Xử lý lỗi nếu có
        return res.status(400).json({ errors: validationErrors });
   }
        try {
          // Kiểm tra giá trị boolean (ví dụ: true/false) từ query parameter
          const isStatusSetTo2 = req.body.status === "2"; // Đảm bảo kiểm tra giá trị "2"
    
          // Sửa trường status của đối tượng objNotice dựa trên giá trị boolean
          objNotice.status = isStatusSetTo2 ? 2 : 1;
    
          // Lưu lại thông báo đã sửa
          await objNotice.save();
          console.log("Sửa thành công");
          msg = "Đã sửa thành công";
          return res.status(200).json({ success: true,  message: "Đã sửa bài viết" });
        } catch (error) {
          msg = "Lỗi " + error.message;
          console.log(error);
          return res.status(500).json({ success: false, data: {}, message: msg });
        }
      }
      console.log(req.params.idNotice);
     
    };
    
    


    exports.deleteNotice = async (req, res, next) => {
      let idNotice = req.params.idNotice;
      if (req.method == 'DELETE') {
          try {
              await mdNoti.NoticeModel.findByIdAndDelete(idNotice);
              return res.status(203).json({ success: true, data: {}, message: "Thông báo này không còn tồn tại" });
          } catch (error) {
              return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
          }
      }
  }