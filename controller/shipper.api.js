let mdShipper = require('../model/shipper.model');
let mdBillProduct  = require('../model/billProduct.model');
let bcrypt = require('bcrypt');
const { onUploadImages } = require("../function/uploadImage");

exports.listShipper = async (req, res, next) => {
  let msg = '';
  let filterSearch = null;
  let sortOption = null;
  let perPage = 6;
  let currentPage = parseInt(req.query.page) || 1;

  try {
      if (req.method === 'GET') {
          if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
              const searchTerm = req.query.filterSearch.trim();
              filterSearch = { fullName: new RegExp(searchTerm, 'i') };
          }

          // Determine the sorting option based on the selected option
          if (req.query.sortOption === '1') {
              sortOption = { fullName: 1 }; // Sort by fullName in ascending order (A-Z)
          } else if (req.query.sortOption === '-1') {
              sortOption = { fullName: -1 }; // Sort by fullName in descending order (Z-A)
          } else {
              // Default sorting by fullName in ascending order (A-Z)
              sortOption = { fullName: 1 };
          }

          // Case-insensitive collation for sorting
          const collation = { locale: 'en', strength: 2 }; // 'en' for English, strength: 2 for case-insensitive

          let totalCount = await mdShipper.ShipperModel.countDocuments(filterSearch);
          const totalPage = Math.ceil(totalCount / perPage);

          let skipCount = (perPage * (currentPage - 1)); // Shipperjust skip count based on current page

          let listShipper = await mdShipper.ShipperModel.find(filterSearch)
              .sort(sortOption)
              .collation(collation) // Apply collation for case-insensitive sorting
              .skip(skipCount)
              .limit(perPage)
              .exec();
          return res.render('Shipper/listShipper', {
              listShipper: listShipper,
              countAllShipper: totalCount,
              countNowShipper: listShipper.length,
              msg: msg,
              currentPage: currentPage,
              totalPage: totalPage,
              adminLogin: req.session.adLogin,
          });
      }
  } catch (error) {
      msg = 'Error: ' + error.message;
      console.log('Error fetching Shipper list: ' + error.message);
      return res.render('Shipper/listShipper', {
          listShipper: [],
          countAllShipper: 0,
          countNowShipper: 0,
          msg: msg,
          currentPage: 1,
          totalPage: 1
      });
  }
};
exports.addShipper = async (req, res, next) => {
    let msg = '';
    let formData = req.body;
  
    if (req.method === 'POST') {
      if (req.body.re_passWord !== req.body.passWord) {
        msg = "Mật khẩu không trùng khớp";
        return res.render('Shipper/addShipper', { msg: msg, formData: formData });
      }
  
      if (req.body.passWord === '') {
        msg = "Mật khẩu đang trống";
        return res.render('Shipper/addShipper', { msg: msg, formData: formData });
      }
  
      try {
        let newObj = new mdShipper.ShipperModel();
        let images = await onUploadImages(req.files, "blog");
        
        if (images != [] && images[0] === false) {
          if (images[1].message.indexOf("File size too large.") > -1) {
            return res.status(500).json({
              success: false,
              data: {},
              message: "Dung lượng một ảnh tối đa là 10MB!",
            });
          } else {
            return res.status(500).json({
              success: false,
              data: {},
              message: images[1].message
            });
          }
        }
  
        newObj.avatarShipper = [...images];
        newObj.fullName = req.body.fullName;
        newObj.userName = req.body.userName;
        newObj.phoneNumber = req.body.phoneNumber;
        newObj.email = req.body.email;
        const province = req.body.selectedProvinceCode;
        const district = req.body.selectedDistrictCode; 
        const ward = req.body.selectedWardCode; 
        newObj.address = `${ward}, ${district}, ${province}`;
        newObj.address2 = req.body.address2; 
        newObj.createdAt = new Date();
  
        let salt = await bcrypt.genSalt(10);
        newObj.passWord = await bcrypt.hash(req.body.passWord, salt);
  
        const existingUsername = await mdShipper.ShipperModel.findOne({
          userName: req.body.userName
        });
  
        if (existingUsername) {
          msg = 'Tên đăng nhập đã tồn tại - Chọn tên khác!';
          return res.render('Shipper/addShipper', { msg: msg, formData: formData });
        }
        const phoneNumberRegex = /^0\d{9}$/; 
        if (!phoneNumberRegex.test(req.body.phoneNumber)) {
          msg = 'Số điện thoại phải có 10 số và bắt đầu bằng số 0!';
          return res.render('Shipper/addShipper', { msg: msg, formData: formData });
        }
        const existingPhone = await mdShipper.ShipperModel.findOne({
          phoneNumber: req.body.phoneNumber
        });
  
        if (existingPhone) {
          msg = 'Số điện thoại đã tồn tại - Nhập số khác!';
          return res.render('Shipper/addShipper', { msg: msg, formData: formData });
        }
  
        await newObj.save();
        msg = 'Thêm Shipper thành công!';
        return res.redirect('/Shipper');
      } catch (error) {
        if (error.message.match(new RegExp('.+`userName` is require+.'))) {
          msg = 'Tên đăng nhập đang trống!';
          return res.render('Shipper/addShipper', { msg: msg, formData: formData });
        }
        else if (error.message.match(new RegExp('.+`email` is require+.'))) {
          msg = 'Email đang trống!';
          return res.render('Shipper/addShipper', { msg: msg, formData: formData });
        }
  
        msg = error.message;
      }
    }
  
    res.render('Shipper/addShipper', { msg: msg, adminLogin: req.session.adLogin, formData: formData });
  }
  

exports.updateShipperStatus = async (req, res, next) => {
    try {
        const idBill = req.params.idBill;
        const newStatus = 2;
        const shipper = await mdShipper.ShipperModel.findOneAndUpdate(
            { "bills.idBill": idBill },
            { $set: { "bills.$.status": newStatus } },
            { new: true }
        );
  
        if (!shipper) {
            // Xử lý khi không tìm thấy shipper hoặc idBill không tồn tại trong mảng bills
            return res.status(404).json({ error: 'Không tìm thấy Shipper hoặc idBill không tồn tại trong mảng bills.' });
        }
  
        // Redirect hoặc trả về dữ liệu cập nhật thành công
        res.redirect('OrderList/listBillProducts');
    } catch (error) {
        // Xử lý lỗi
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
exports.deleteShipper = async (req, res, next) => {
    let msg = '';
    let listShipper = await mdShipper.ShipperModel.find().count();
    let idShipper = req.params.idShipper;
    let objShipper = await mdShipper.ShipperModel.findById(idShipper);
    if (req.method == "POST") {

        try {
            if (listShipper == 1) {
                msg = 'Danh sách Shipper tối thiểu phải là 1';
                return res.render('Shipper/deleteShipper', { msg: msg, objShipper: objShipper });
            }
            await mdShipper.ShipperModel.findByIdAndDelete(idShipper);
            res.redirect('/Shipper');
        } catch (error) {
            console.log(error.message);
        }
    }
    res.render('Shipper/deleteShipper', { msg: msg, objShipper: objShipper,adminLogin: req.session.adLogin,
    });

}
exports.detailShipper = async (req, res, next) => {

    let idShipper = req.params.idShipper;
    let objShipper = await mdShipper.ShipperModel.findById(idShipper);
  
    res.render('Shipper/detailShipper', { objShipper: objShipper,adminLogin: req.session.adLogin,
    });
  }


