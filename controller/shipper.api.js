let mdShipper = require('../model/shipper.model');
let mdBillProduct  = require('../model/billProduct.model');
let bcrypt = require('bcrypt');

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

  if (req.method == 'POST') {
    if (req.body.re_passWord != req.body.passWord) {
      msg = "Mật khẩu không trùng khớp";
      return res.render('Shipper/addShipper', { msg: msg });
    }

    if (req.body.passWord == '') {
      msg = "Mật khẩu đang trống";
      return res.render('Shipper/addShipper', { msg: msg });
    }
    try {
      let newObj = new mdShipper.ShipperModel();
      if (req.file) {
        newObj.avatarShipper = req.file.path;
      } else {
        msg = "Ảnh đại diện không được tải lên";
        return res.render('Shipper/addShipper', { msg: msg });
      }
      console.log(req.file.path);
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
      await newObj.save();
      msg = 'Thêm Shipper thành công!';
      return res.redirect('/Shipper');
    } catch (error) {
      console.log(error.message);
      if (error.message.match(new RegExp('.+`userName` is require+.'))) {
        msg = 'Tên đăng nhập đang trống!';
    }
    else if (error.message.match(new RegExp('.+`email` is require+.'))) {
        msg = 'Email đang trống!';
    }
    else if (error.message.match(new RegExp('.+`passWord` is require+.'))) {
        msg = 'Mật khẩu đang trống!';
    }
    else if (error.message.match(new RegExp('.+index: userName+.'))) {
        msg = 'Username đã tồn tại - Nhập lại username!';
    }
    else if (error.message.match(new RegExp('.+index: email+.'))) {
        msg = 'Email đã tồn tại - Nhập lại email!';
    }
    else {
        msg = error.message;
    }
    }
  }

  res.render('Shipper/addShipper', { msg: msg,adminLogin: req.session.adLogin,
 });
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


