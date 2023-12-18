let mdShipper = require('../model/shipper.model');
let mdUserAccount = require('../model/userAccount.model').UserAccountModel;
var bcrypt = require('bcrypt');
let { decodeFromSha256 } = require('../function/hashFunction');
let mdbillProduct = require("../model/billProduct.model");
let mdSever = require("../model/server.modal");
let mdTransaction = require("../model/transaction.modal");
let mdProduct = require("../model/product.model")
let mdPet = require("../model/pet.model")
const { sendFCMNotification } = require('../../function/notice');
let moment = require("moment");
exports.login = async (req, res, next) => {
  let msg = '';
  if (req.method == 'POST') {
    try {
      let objShipper = await mdShipper.ShipperModel.findOne({ userName: req.body.userName });
      if (objShipper != null) {
        let check_pass = await bcrypt.compare(req.body.passWord, objShipper.passWord);
        if (check_pass) {
          req.session.shipperLogin = objShipper;
          req.session.idShipper = objShipper.id;
          return res.redirect('/accountShipper/listBillProduct');
        } else {
          msg = 'Thông tin đăng nhập chưa đúng';
          return res.render('AccountShipper/loginShipper', { msg: msg });
        }
      } else {
        msg = 'Không tồn tại tài khoản này';
      }
    } catch (error) {
      msg = error.message;
    }
  }
  res.render('AccountShipper/loginShipper', { msg: msg });
}

exports.listBillProduct = async (req, res, next) => {
  let msg = '';
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;

  try {
    if (req.method === 'GET') {
      let idShipper = getIdShipperFromSession(req);
      console.log(idShipper);
      let shipper = await mdShipper.ShipperModel.findById(idShipper);
      if (!shipper) {
        msg = 'Không tìm thấy thông tin Shipper.';
        return res.render('OrderList/listBillProducts', {
          listBillProducts: [],
          msg: msg,
          countAllBillProducts: 0,
          countNowBillProducts: 0,
          currentPage: 1,
          totalPage: 1
        });
      }

      let billProducts = [];
      for (const bill of shipper.bills) {
        let billProduct = await mdbillProduct.billProductModel.findById(bill.idBill);
        if (billProduct && billProduct.deliveryStatus === 1) {
          billProducts.push(billProduct);
        }
      }

      const totalCount = await mdbillProduct.billProductModel.countDocuments({ idShipper: idShipper });
      const totalPage = Math.ceil(totalCount / perPage);

      return res.render('OrderList/listBillProducts', {
        listBillProducts: billProducts,
        countAllBillProducts: totalCount,
        countNowBillProducts: billProducts.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
  } catch (error) {
    msg = 'Error: ' + error.message;
    console.log('Error fetching billProduct list: ' + error.message);
    return res.render('OrderList/listBillProducts', {
      listBillProducts: [],
      msg: msg,
      countAllBillProducts: 0,
      countNowBillProducts: 0,
      currentPage: 1,
      totalPage: 1
    });
  }
};
exports.updateDeliveryStatus = async (req, res, next) => {
  let msg = '';
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBill = req.params.idBill;
  let newDeliveryStatus = 2;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBill).populate("idUser", "tokenDevice").populate("idShop", "tokenDevice");
    const totalCount = await mdbillProduct.billProductModel.countDocuments({ idBill: idBill });
    const totalPage = Math.ceil(totalCount / perPage);
    if (!ObjBillPr) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    ObjBillPr.billDate.deliveringAt = new Date()
    ObjBillPr.deliveryStatus = newDeliveryStatus;
    await ObjBillPr.save();
    const transactions = await mdTransaction.TransactionModal.find({ idBill: idBill });
    for (const transaction of transactions) {
      transaction.status = newDeliveryStatus;
      await transaction.save();
    }

    const shipper = await mdShipper.ShipperModel.findOne({ "bills.idBill": idBill });
    shipper.bills.forEach((bill) => {
      if (bill.idBill.equals(idBill)) {
        bill.status = newDeliveryStatus;
      }
    });
    await shipper.save();
    await sendFCMNotification(
      ObjBillPr?.idShop?.tokenDevice,
      'Đơn hàng của bạn đang được giao!',
      `Đơn hàng đã được chuyển cho shipper vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi tiến độ đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
      'SELLER',
      [],
      ObjBillPr?.idShop?._id,
    )
    await sendFCMNotification(
      ObjBillPr?.idUser?.tokenDevice,
      'Đơn hàng của bạn đang được giao!',
      `Đơn hàng đã được chuyển cho shipper vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi tiến độ đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
      'CLIENT',
      [],
      ObjBillPr?.idUser?._id,
    )

    return res.redirect("/accountShipper/listBillProduct")
  } catch (error) {
    return res.status(500).json({
      success: false,
      listBillProducts: [],
      message: "Lỗi: " + error.message,
    });
  }
};
exports.updateDeliveryStatus1 = async (req, res, next) => {
  let msg = '';
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBill = req.params.idBill;
  let newDeliveryStatus = 2;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBill).populate("idUser", "tokenDevice").populate("idShop", "tokenDevice");
    const totalCount = await mdbillProduct.billProductModel.countDocuments({ idBill: idBill });
    const totalPage = Math.ceil(totalCount / perPage);
    if (!ObjBillPr) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    ObjBillPr.billDate.deliveringAt = new Date()
    ObjBillPr.deliveryStatus = newDeliveryStatus;
    await ObjBillPr.save();
    const transactions = await mdTransaction.TransactionModal.find({ idBill: idBill });
    for (const transaction of transactions) {
      transaction.status = newDeliveryStatus;
      await transaction.save();
    }

    const shipper = await mdShipper.ShipperModel.findOne({ "bills.idBill": idBill });
    shipper.bills.forEach((bill) => {
      if (bill.idBill.equals(idBill)) {
        bill.status = newDeliveryStatus;
      }
    });
    await shipper.save();
    await sendFCMNotification(
      ObjBillPr?.idShop?.tokenDevice,
      'Đơn hàng của bạn đang được giao lại!',
      `Đơn hàng đã được chuyển cho shipper vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi tiến độ đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
      'SELLER',
      [],
      ObjBillPr?.idShop?._id,
    )
    await sendFCMNotification(
      ObjBillPr?.idUser?.tokenDevice,
      'Đơn hàng của bạn đang được giao lại!',
      `Đơn hàng đã được chuyển cho shipper vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi tiến độ đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
      'CLIENT',
      [],
      ObjBillPr?.idUser?._id,
    )
    return res.redirect("/accountShipper/listbillDeliveryFall")
  } catch (error) {
    return res.status(500).json({
      success: false,
      listBillProducts: [],
      message: "Lỗi: " + error.message,
    });
  }
};


exports.updateDeliveryStatusSuccset = async (req, res, next) => {
  let msg = '';
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBill = req.params.idBill;
  let newDeliveryStatus = 3;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBill).populate("idUser", "tokenDevice").populate("idShop", "tokenDevice");
    const totalCount = await mdbillProduct.billProductModel.countDocuments({ idBill: idBill });
    const totalPage = Math.ceil(totalCount / perPage);
    const serverRecord = await mdSever.serverModal.findOne();
    if (serverRecord) {
      serverRecord.totalOrderWasSuccessful += 1;
      await serverRecord.save();
    }
    ObjBillPr.deliveryStatus = newDeliveryStatus;
    ObjBillPr.billDate.deliveredAt = new Date()
    ObjBillPr.billDate.receivedAt = new Date()
    await ObjBillPr.save();
    const transactions = await mdTransaction.TransactionModal.find({ idBill: idBill });

    if (!transactions.length) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    for (const transaction of transactions) {
      transaction.status = newDeliveryStatus;
      await transaction.save();
    }

    const shipper = await mdShipper.ShipperModel.findOne({ "bills.idBill": idBill });
    console.log(shipper);
    if (!shipper || !shipper.bills) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    shipper.bills.forEach((bill) => {
      if (bill.idBill.equals(idBill)) {
        bill.status = newDeliveryStatus;
      }
    });
    await shipper.save();

    await sendFCMNotification(
      ObjBillPr?.idShop?.tokenDevice,
      'Đơn hàng của bạn đang được giao thành công!',
      `Đơn hàng đã được giao thành công vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
      'SELLER',
      [],
      ObjBillPr?.idShop?._id,
    )
    await sendFCMNotification(
      ObjBillPr?.idUser?.tokenDevice,
      'Đơn hàng của bạn đang được giao thành công!',
      `Đơn hàng đã được giao thành công vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi tiến độ đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
      'CLIENT',
      [],
      ObjBillPr?.idUser?._id,
    )
    return res.redirect("/accountShipper/listbillDelivering")


  } catch (error) {
    return res.status(500).json({
      success: false,
      listBillProducts: [],
      message: "Lỗi: " + error.message,
    });
  }
};
exports.updateDeliveryStatusFall = async (req, res, next) => {
  let msg = '';
  let perPage = 6;
  let discountBillFall = 0;

  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBill = req.params.idBill;
  let newDeliveryStatus = -2;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBill).populate("idUser", "tokenDevice").populate("idShop", "tokenDevice");
    const totalCount = await mdbillProduct.billProductModel.countDocuments({ idBill: idBill });
    const totalPage = Math.ceil(totalCount / perPage);
    if (!ObjBillPr) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    ObjBillPr.deliveryStatus = newDeliveryStatus;
    await ObjBillPr.save();
    const transactions = await mdTransaction.TransactionModal.find({ idBill: idBill });

    if (!transactions.length) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    for (const transaction of transactions) {
      transaction.status = newDeliveryStatus;
      await transaction.save();
    }

    const shipper = await mdShipper.ShipperModel.findOne({ "bills.idBill": idBill });
    if (!shipper || !shipper.bills) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    shipper.bills.forEach((bill) => {
      if (bill.idBill.equals(idBill)) {
        if (bill.discountBillFall) {
          discountBillFall = bill.discountBillFall;
          if (discountBillFall < 2) {
            discountBillFall++;
            bill.discountBillFall = discountBillFall;
          } else {
            newDeliveryStatus = -1;
            bill.discountBillFall = 0;
            bill.status = newDeliveryStatus;

          }
        } else {
          bill.discountBillFall = 1;
        }
      }
    });
    await shipper.save();
    await sendFCMNotification(
      ObjBillPr?.idShop?.tokenDevice,
      'Đơn hàng của bạn giao không thành công!',
      `Đơn hàng đã giao không thành công vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
      'SELLER',
      [],
      ObjBillPr?.idShop?._id,
    )
    await sendFCMNotification(
      ObjBillPr?.idUser?.tokenDevice,
      'Đơn hàng của bạn giao không thành công!',
      `Đơn hàng đã giao không thành công vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi tiến độ đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
      'CLIENT',
      [],
      ObjBillPr?.idUser?._id,
    )
    if (newDeliveryStatus === -1) {
      ObjBillPr.deliveryStatus = newDeliveryStatus;
      await ObjBillPr.save();
      const transactions = await mdTransaction.TransactionModal.find({ idBill: idBill });
      for (const transaction of transactions) {
        transaction.status = newDeliveryStatus;
        await transaction.save();
      }
      const serverRecord = await mdSever.serverModal.findOne();
      if (serverRecord) {
        serverRecord.totalOrderFailed += 1;
        await serverRecord.save();
      }
      if (ObjBillPr.products.length > 1) {
        for (let i = 0; i < ObjBillPr.products.length; i++) {
          const bill = ObjBillPr.products[i];
          let product = await mdProduct.ProductModel.findById(bill.idProduct);
          if (product) {
            product.quantitySold = Number(product.quantitySold) - (bill.amount);
            product.amountProduct = Number(product.amountProduct) + (bill.amount);
            await product.save();
          }
        }
      } else {
        if (ObjBillPr.products.length > 0) {
          let first = ObjBillPr.products[0];
          let product = await mdProduct.ProductModel.findById(first.idProduct);
          if (product) {
            product.quantitySold = Number(product.quantitySold) - (first.amount);
            product.amountProduct = Number(product.amountProduct) + (first.amount);
            await product.save();
          } else {
            let pet = await mdPet.PetModel.findById(first.idProduct);
            if (pet) {
              pet.quantitySold = Number(pet.quantitySold) - (first.amount);
              pet.amountPet = Number(pet.amountPet) + (first.amount);
              await pet.save();
            }
          }
        }
      }
      await sendFCMNotification(
        ObjBillPr?.idShop?.tokenDevice,
        'Đơn hàng của bạn đã được hủy!',
        `Đơn hàng đã được hủy vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
        'SELLER',
        [],
        ObjBillPr?.idShop?._id,
      )
      await sendFCMNotification(
        ObjBillPr?.idUser?.tokenDevice,
        'Đơn hàng của bạn đã được hủy!',
        `Đơn hàng đã được hủy vào lúc ${moment(new Date()).format('HH:mm:SS A - DD/MM/YYYY')}.\nBạn có thể theo dõi tiến độ đơn hàng ở Quản lý đơn hàng và Chi tiết đơn hàng.`,
        'CLIENT',
        [],
        ObjBillPr?.idUser?._id,
      )
    }
    return res.redirect("/accountShipper/listbillDelivering")

  } catch (error) {
    return res.status(500).json({
      success: false,
      listBillProducts: [],
      message: "Lỗi: " + error.message,
    });
  }
};
exports.updateDeliveryStatusCancel = async (req, res, next) => {
  let msg = '';
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBill = req.params.idBill;
  let newDeliveryStatus = -1;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBill);
    const totalCount = await mdbillProduct.billProductModel.countDocuments({ idBill: idBill });
    const totalPage = Math.ceil(totalCount / perPage);
    if (!ObjBillPr) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    ObjBillPr.deliveryStatus = newDeliveryStatus;
    await ObjBillPr.save();
    const transactions = await mdTransaction.TransactionModal.find({ idBill: idBill });

    if (!transactions.length) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    for (const transaction of transactions) {
      transaction.status = newDeliveryStatus;
      await transaction.save();
    }

    const shipper = await mdShipper.ShipperModel.findOne({ "bills.idBill": idBill });
    console.log(shipper);
    if (!shipper || !shipper.bills) {
      return res.render('OrderList/listOder', {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
    shipper.bills.forEach((bill) => {
      if (bill.idBill.equals(idBill)) {
        bill.status = newDeliveryStatus;
      }
    });
    await shipper.save();

    return res.render('OrderList/listOder', {
      listBillProducts: ObjBillPr,
      countAllBillProducts: totalCount,
      countNowBillProducts: ObjBillPr.length,
      msg: msg,
      currentPage: currentPage,
      totalPage: totalPage
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      listBillProducts: [],
      message: "Lỗi: " + error.message,
    });
  }
};

exports.listbillDelivering = async (req, res, next) => {
  try {
    let idShipper = getIdShipperFromSession(req);

    let listbillProduct = await mdbillProduct.billProductModel
      .find({ deliveryStatus: 2, "idShipper": idShipper })
      .populate("products.idProduct");

    if (listbillProduct && listbillProduct.length > 0) {
      return res.render('OrderList/listBillProductsDelivering', {
        listBillProducts: listbillProduct,
      });
    } else {
      return res.render('OrderList/listBillProductsDelivering', {
        listBillProducts: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.listbillDeliveryFall = async (req, res, next) => {
  try {
    let idShipper = getIdShipperFromSession(req);
    let listbillProduct = await mdbillProduct.billProductModel
      .find({ deliveryStatus: -2, "idShipper": idShipper })
      .populate("products.idProduct");

    if (listbillProduct && listbillProduct.length > 0) {
      return res.render('OrderList/listBillProductsFall', {
        listBillProducts: listbillProduct,
      });
    } else {
      return res.render('OrderList/listBillProductsFall', {
        listBillProducts: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.successfulDelivery = async (req, res, next) => {
  try {
    let idShipper = getIdShipperFromSession(req);

    let listbillProduct = await mdbillProduct.billProductModel
      .find({ deliveryStatus: 3, "idShipper": idShipper })
      .populate("products.idProduct");

    if (listbillProduct && listbillProduct.length > 0) {
      return res.render('OrderList/listBillProductsSucess', {
        listBillProducts: listbillProduct,
      });
    } else {
      return res.render('OrderList/listBillProductsSucess', {
        listBillProducts: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.cancelledDelivery = async (req, res, next) => {
  try {
    let idShipper = getIdShipperFromSession(req);

    let listbillProduct = await mdbillProduct.billProductModel
      .find({ deliveryStatus: -1, "idShipper": idShipper })
      .populate("products.idProduct");

    if (listbillProduct && listbillProduct.length > 0) {
      return res.render('OrderList/listBillProductsCancel', {
        listBillProducts: listbillProduct,
      });
    } else {
      return res.render('OrderList/listBillProductsCancel', {
        listBillProducts: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.verifyEmail = async (req, res, next) => {
  if (req.method == 'POST') {
    let decode = decodeFromSha256(req.params.encodeToSha256);
    try {
      var data = await mdUserAccount.findOne({ emailAddress: decode });
      if (data != null) {
        data.isVerifyEmail = 0;
        await mdUserAccount.findByIdAndUpdate(data._id, data);
        return res
          .status(200)
          .json({ success: true, data: {}, message: "Xác minh email thành công" });
      } else {
        return res
          .status(500)
          .json({ success: false, data: {}, message: "Xác minh email thất bại" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Xác minh email thất bại" });
    }
  }
  res.render('Account/verifyEmail')
}

exports.verifyResult = async (req, res, next) => {
  let isVerify = req.query.isVerify;
  res.render('Account/verifyResult', { isVerify: isVerify })
}
exports.detailShipper = async (req, res, next) => {
  let idShipper = getIdShipperFromSession(req);
  let objShipper = await mdShipper.ShipperModel.findById(idShipper);

  res.render('OrderList/proFileShipper', { objShipper: objShipper, idShipper: idShipper });
}
exports.updateShipper = async (req, res, next) => {
  let msg = '';
  let updatedShipper, selectedProvince, selectedDistrict, selectedWard;
  if (req.method == 'GET') {
    const idShipper = getIdShipperFromSession(req);
    try {
      updatedShipper = await mdShipper.ShipperModel.findById(idShipper);
      if (updatedShipper && updatedShipper.address) {
        console.log(updatedShipper.address);
        const addressParts = updatedShipper.address.split(', ');
        if (addressParts.length >= 3) {
          selectedProvince = addressParts[2];
          selectedDistrict = addressParts[1];
          selectedWard = addressParts[0];

          res.render('OrderList/updateProFileShipper', {
            updatedShipper: updatedShipper,
            selectedProvince: selectedProvince,
            selectedDistrict: selectedDistrict,
            selectedWard: selectedWard,
            msg: msg
          });
        } else {
          // Handle the case where addressParts length is less than 3
        }
      }
    } catch (error) {
      // Handle the error
    }
  }
  if (req.method === 'POST') {
    const idShipper = getIdShipperFromSession(req);
    try {
      updatedShipper = await mdShipper.ShipperModel.findById(idShipper);
      console.log(updatedShipper.fullName);
      if (!updatedShipper) {
        msg = 'Không tìm thấy Shipper để cập nhật!';
        return res.render('OrderList/updateProFileShipper', {
          msg: msg, updatedShipper: updatedShipper, selectedProvince: selectedProvince,
          selectedDistrict: selectedDistrict,
          selectedWard: selectedWard,
        });
      }
      updatedShipper.phoneNumber = req.body.phoneNumber;
      updatedShipper.email = req.body.email;
      updatedShipper.address2 = req.body.address2;
      selectedProvince = req.body.selectedProvince;
      selectedDistrict = req.body.selectedDistrict;
      selectedWard = req.body.selectedWard;
      const phoneNumberRegex = /^\+?[0-9]{8,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !phoneNumberRegex.test(updatedShipper.phoneNumber) ||
        !emailRegex.test(updatedShipper.email) ||
        !updatedShipper.phoneNumber ||
        !updatedShipper.email
      ) {
        msg = 'Vui lòng cung cấp thông tin hợp lệ cho số điện thoại và email!';
        return res.render('OrderList/updateProFileShipper', {
          msg: msg,
          updatedShipper: updatedShipper,
          selectedProvince: selectedProvince,
          selectedDistrict: selectedDistrict,
          selectedWard: selectedWard,
        });
      }

      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        msg = 'Vui lòng chọn đầy đủ thông tin về địa chỉ!';
        return res.render('OrderList/updateProFileShipper', {
          msg: msg, updatedShipper: updatedShipper, selectedProvince: selectedProvince,
          selectedDistrict: selectedDistrict,
          selectedWard: selectedWard,
        });
      }

      updatedShipper.address = `${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
      await updatedShipper.save();
      msg = 'Cập nhật Shipper thành công!';
      return res.redirect('/accountShipper/proFileShipper');
    } catch (error) {
      console.log(error.message);
      // Handle specific error cases if needed
      msg = 'Đã xảy ra lỗi khi cập nhật Shipper!';
    }

  }
}

function getIdShipperFromSession(req) {
  return req.session.idShipper;
}

exports.logoutShipper = async (req, res, next) => {
  // if (req.session != null)
  //   req.session.destroy((err) => {
  //     if (err) {
  //       return next(err);
  //     } else {
  res.redirect('/accountShipper/loginShipper');
  //   }
  // });
}
