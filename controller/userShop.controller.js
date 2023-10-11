let mdUserShop = require('../model/userShop.model');
let moment = require('moment');
let bcrypt = require('bcrypt');
const { onUploadImages } = require("../../function/uploadImage");
const fs = require("fs");

exports.listUserShop = async (req, res, next) => {
  const perPage = 6;
  let msg = '';
  let filterSearch = {};
  let currentPage = parseInt(req.query.page) || 1;

  if (req.method == 'GET') {
    try {
      if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {

        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { userName: new RegExp(searchTerm, 'i') };
      }

      let sortOption = {};
      const selectedSortOption = req.query.sortOption;
      if (selectedSortOption === 'az') {
        sortOption = { userName: 1 }; // 1 for ascending order (A-Z)
      } else if (selectedSortOption === 'za') {
        sortOption = { userName: -1 }; // -1 for descending order (Z-A)
      }

      const totalCount = await mdUserShop.UserShopModel.countDocuments(filterSearch);
      const totalPages = Math.ceil(totalCount / perPage);

      // Validate the current page number to stay within the correct range
      if (currentPage < 1) currentPage = 1;
      if (currentPage > totalPages) currentPage = totalPages;

      const skipCount = (currentPage - 1) * perPage;
      let listUserShop = await mdUserShop.UserShopModel.find(filterSearch)
        .sort(sortOption)
        .skip(skipCount)
        .limit(perPage);

      msg = 'Lấy danh sách user shop thành công';
      return res.render('UserShop/listUserShop', {
        listUserShop: listUserShop,
        countNowUserShop: listUserShop.length,
        countAllUserShop: totalCount,
        moment: moment,
        msg: msg,
        currentPage: currentPage,
        totalPages: totalPages,
      });
    } catch (error) {
      msg = '' + error.message;
      console.log('Không lấy được danh sách user shop: ' + msg);
    }
  }
};

exports.addUserShop = async (req, res, next) => {
  let msg = '';
  if (req.method == 'POST') {
    if (req.body.tendaydu.trim().length == 0) {
      msg = 'Vui lòng không bỏ trống tên đầy đủ!';
      return res.render('UserShop/addUserShop', { msg: msg });
    }
    if (req.body.email.trim().length == 0) {
      msg = "Vui lòng không bỏ trống email";
      return res.render('UserShop/addUserShop', { msg: msg });
    }
    if (!isValidEmail(req.body.email)) {
      msg = "Email không hợp lệ";
      return res.render('UserShop/addUserShop', { msg: msg });
    }

    if (req.body.confirmmatkhau != req.body.matkhau) {
      msg = "Mật khẩu không trùng khớp";
      return res.render('UserShop/addUserShop', { msg: msg });
    }

    let newObj = new mdUserShop.UserShopModel();
    newObj.fullName = req.body.tendaydu;
    newObj.userName = req.body.tendangnhap;
    newObj.passWord = req.body.matkhau;
    newObj.email = req.body.email;
    newObj.createdAt = new Date();
    let images = await onUploadImages(req.files, 'usershop')
            if (images != [] && images[0] == false) {
                if (images[1].message.indexOf('File size too large.') > -1) {
                    return res.status(500).json({ success: false, data: {}, message: "Dung lượng một ảnh tối đa là 10MB!" });
                } else {
                    return res.status(500).json({ success: false, data: {}, message: images[1].message });
                }
            } 
            newObj.avatarUserShop = [...images];
    try {
      await newObj.save();
      message = 'Thêm người dùng shop thành công!';
      return res.redirect('/user-shop');
    } catch (error) {
      console.log(error.message);
      if (error.message.match(new RegExp('.+`userName` is require+.'))) {
        msg = 'Vui lòng không bỏ trống tên đăng nhập!';
      }
      else if (error.message.match(new RegExp('.+`passWord` is require+.'))) {
        msg = 'Vui lòng không bỏ trống mật khẩu!';
      }

      else if (error.message.match(new RegExp('.+index: userName+.'))) {
        msg = 'Username này đã tồn tại - Vui lòng nhập username mới!';
      }
      else if (error.message.match(new RegExp('.+index: email+.'))) {
        msg = 'Email này đã tồn tại - Vui lòng nhập email mới!';
      }

      else {
        msg = error.message;
      }
    }
  }
  res.render('UserShop/addUserShop', { msg: msg });
}
function isValidEmail(email) {
  // Regular expression to match email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regex
  return emailRegex.test(email);
}

exports.deleteUserShop = async (req, res, next) => {
  let msg = '';
  let listUS = await mdUserShop.UserShopModel.find().count();
  let idUS = req.params.idUS;
  let objUS = await mdUserShop.UserShopModel.findById(idUS);
  if (req.method == 'POST') {

    try {
      if (listUS == 1) {
        msg = 'Danh sách user shop tối thiểu phải là 1';
        return res.render('UserShop/deleteUserShop', { msg: msg, objUS: objUS });
      }
      await mdUserShop.UserShopModel.findByIdAndDelete(idUS);
      res.redirect('/user-shop');

    } catch (error) {
      msg = error.message;

    }

  }
  res.render('UserShop/deleteUserShop', { msg: msg, objUS: objUS });
  // 
  //  
  //   let idAdmin = req.params.idAdmin;
  //   let objAd = await mdAdmin.AdminModel.findById(idAdmin);
  //   if (req.method == "POST") {

  //       try {
  //           if (listAdmin == 1) {
  //               msg = 'Bạn không thể xóa admin vì admin tối thiểu phải là 1';
  //               return res.render('Admin/deleteAdmin', { msg: msg, objAd: objAd });
  //           }
  //           await mdAdmin.AdminModel.findByIdAndDelete(idAdmin);
  //           res.redirect('/admin');
  //       } catch (error) {
  //           console.log(error.message);
  //       }
  //   }
  //   res.render('Admin/deleteAdmin', { msg: msg, objAd: objAd });
};
exports.detailUserShop = async (req, res, next) => {
  let idUS = req.params.idUS;
  let objUS = await mdUserShop.UserShopModel.findById(idUS);
  res.render('UserShop/detailUserShop', { objUS: objUS, moment: moment });
}