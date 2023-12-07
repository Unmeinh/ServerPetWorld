let mdShipper = require("../model/shipper.model");
let mdUserAccount = require("../model/userAccount.model").UserAccountModel;
var bcrypt = require("bcrypt");
let { decodeFromSha256 } = require("../function/hashFunction");
let mdbillProduct = require("../model/billProduct.model");
let mdSever = require("../model/server.modal");
let mdTransaction = require("../model/transaction.modal");
exports.login = async (req, res, next) => {
  let msg = "";
  if (req.method == "POST") {
    try {
      let objShipper = await mdShipper.ShipperModel.findOne({
        userName: req.body.userName,
      });
      if (objShipper != null) {
        let check_pass = await bcrypt.compare(
          req.body.passWord,
          objShipper.passWord
        );
        if (check_pass) {
          req.session.shipperLogin = objShipper;
          req.session.idShipper = objShipper.id;
          return res.redirect("/accountShipper/listBillProduct");
        } else {
          msg = "Thông tin đăng nhập chưa đúng";
          return res.render("AccountShipper/loginShipper", { msg: msg });
        }
      } else {
        msg = "Không tồn tại tài khoản này";
      }
    } catch (error) {
      msg = error.message;
    }
  }
  res.render("AccountShipper/loginShipper", { msg: msg });
};

exports.listBillProduct = async (req, res, next) => {
  let msg = "";
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;

  try {
    if (req.method === "GET") {
      let idShipper = getIdShipperFromSession(req);
      let shipper = await mdShipper.ShipperModel.findById(idShipper);
      if (!shipper) {
        msg = "Không tìm thấy thông tin Shipper.";
        return res.render("OrderList/listBillProducts", {
          listBillProducts: [],
          msg: msg,
          countAllBillProducts: 0,
          countNowBillProducts: 0,
          currentPage: 1,
          totalPage: 1,
        });
      }

      let billProducts = [];
      for (const bill of shipper.bills) {
        let billProduct = await mdbillProduct.billProductModel.findById(
          bill.idBill
        );
        if (billProduct && billProduct.deliveryStatus === 1) {
          billProducts.push(billProduct);
        }
      }

      const totalCount = await mdbillProduct.billProductModel.countDocuments({
        idShipper: idShipper,
      });
      const totalPage = Math.ceil(totalCount / perPage);

      return res.render("OrderList/listBillProducts", {
        listBillProducts: billProducts,
        countAllBillProducts: totalCount,
        countNowBillProducts: billProducts.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
  } catch (error) {
    msg = "Error: " + error.message;
    console.log("Error fetching billProduct list: " + error.message);
    return res.render("OrderList/listBillProducts", {
      listBillProducts: [],
      msg: msg,
      countAllBillProducts: 0,
      countNowBillProducts: 0,
      currentPage: 1,
      totalPage: 1,
    });
  }
};
exports.updateDeliveryStatus = async (req, res, next) => {
  let msg = "";
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBill = req.params.idBill;
  let newDeliveryStatus = 2;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBill);
    const totalCount = await mdbillProduct.billProductModel.countDocuments({
      idBill: idBill,
    });
    const totalPage = Math.ceil(totalCount / perPage);
    if (!ObjBillPr) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    ObjBillPr.billDate.deliveringAt = new Date();
    ObjBillPr.deliveryStatus = newDeliveryStatus;
    await ObjBillPr.save();
    const transactions = await mdTransaction.TransactionModal.find({
      idBill: idBill,
    });

    if (!transactions.length) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    for (const transaction of transactions) {
      transaction.status = newDeliveryStatus;
      await transaction.save();
    }

    const shipper = await mdShipper.ShipperModel.findOne({
      "bills.idBill": idBill,
    });
    if (!shipper || !shipper.bills) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    shipper.bills.forEach((bill) => {
      if (bill.idBill.equals(idBill)) {
        bill.status = newDeliveryStatus;
      }
    });
    await shipper.save();

    return res.render("OrderList/listOder", {
      listBillProducts: ObjBillPr,
      countAllBillProducts: totalCount,
      countNowBillProducts: ObjBillPr.length,
      msg: msg,
      currentPage: currentPage,
      totalPage: totalPage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      listBillProducts: [],
      message: "Lỗi: " + error.message,
    });
  }
};

exports.updateDeliveryStatusSuccset = async (req, res, next) => {
  let msg = "";
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBill = req.params.idBill;
  let newDeliveryStatus = 3;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBill);
    const totalCount = await mdbillProduct.billProductModel.countDocuments({
      idBill: idBill,
    });
    const totalPage = Math.ceil(totalCount / perPage);
    const serverRecord = await mdSever.serverModal.findOne();
    if (serverRecord) {
      serverRecord.totalOrderWasSuccessful += 1;
      await serverRecord.save();
    }
    if (!ObjBillPr) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    ObjBillPr.deliveryStatus = newDeliveryStatus;
    ObjBillPr.billDate.deliveredAt = new Date();
    ObjBillPr.billDate.receivedAt = new Date();
    await ObjBillPr.save();
    const transactions = await mdTransaction.TransactionModal.find({
      idBill: idBill,
    });

    if (!transactions.length) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    for (const transaction of transactions) {
      transaction.status = newDeliveryStatus;
      await transaction.save();
    }

    const shipper = await mdShipper.ShipperModel.findOne({
      "bills.idBill": idBill,
    });
    if (!shipper || !shipper.bills) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    shipper.bills.forEach((bill) => {
      if (bill.idBill.equals(idBill)) {
        bill.status = newDeliveryStatus;
      }
    });
    await shipper.save();

    return res.render("OrderList/listOder", {
      listBillProducts: ObjBillPr,
      countAllBillProducts: totalCount,
      countNowBillProducts: ObjBillPr.length,
      msg: msg,
      currentPage: currentPage,
      totalPage: totalPage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      listBillProducts: [],
      message: "Lỗi: " + error.message,
    });
  }
};
exports.updateDeliveryStatusFall = async (req, res, next) => {
  let msg = "";
  let perPage = 6;
  let discountBillFall = 0;

  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBill = req.params.idBill;
  let newDeliveryStatus = -2;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBill);
    const totalCount = await mdbillProduct.billProductModel.countDocuments({
      idBill: idBill,
    });
    const totalPage = Math.ceil(totalCount / perPage);
    if (!ObjBillPr) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    ObjBillPr.deliveryStatus = newDeliveryStatus;
    await ObjBillPr.save();
    const transactions = await mdTransaction.TransactionModal.find({
      idBill: idBill,
    });

    if (!transactions.length) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    for (const transaction of transactions) {
      transaction.status = newDeliveryStatus;
      await transaction.save();
    }

    const shipper = await mdShipper.ShipperModel.findOne({
      "bills.idBill": idBill,
    });
    if (!shipper || !shipper.bills) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
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
            // shouldUpdateStatus = false; // Không cần cập nhật status nếu discountBillFall = 3
          }
        } else {
          bill.discountBillFall = 1;
        }
        // Chỉ cập nhật status nếu shouldUpdateStatus là true
      }
    });
    await shipper.save();

    if (newDeliveryStatus === -1) {
      ObjBillPr.deliveryStatus = newDeliveryStatus;
      await ObjBillPr.save();

      const transactions = await mdTransaction.TransactionModal.find({
        idBill: idBill,
      });
      for (const transaction of transactions) {
        transaction.status = newDeliveryStatus;
        await transaction.save();
      }
      const serverRecord = await mdSever.serverModal.findOne();
      if (serverRecord) {
        serverRecord.totalOrderFailed += 1;
        await serverRecord.save();
      }
    }
    return res.render("OrderList/listOder", {
      listBillProducts: ObjBillPr,
      countAllBillProducts: totalCount,
      countNowBillProducts: ObjBillPr.length,
      msg: msg,
      currentPage: currentPage,
      totalPage: totalPage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      listBillProducts: [],
      message: "Lỗi: " + error.message,
    });
  }
};
exports.updateDeliveryStatusCancel = async (req, res, next) => {
  let msg = "";
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBill = req.params.idBill;
  let newDeliveryStatus = -1;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBill);
    const totalCount = await mdbillProduct.billProductModel.countDocuments({
      idBill: idBill,
    });
    const totalPage = Math.ceil(totalCount / perPage);
    if (!ObjBillPr) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    ObjBillPr.deliveryStatus = newDeliveryStatus;
    await ObjBillPr.save();
    const transactions = await mdTransaction.TransactionModal.find({
      idBill: idBill,
    });

    if (!transactions.length) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    for (const transaction of transactions) {
      transaction.status = newDeliveryStatus;
      await transaction.save();
    }

    const shipper = await mdShipper.ShipperModel.findOne({
      "bills.idBill": idBill,
    });
    if (!shipper || !shipper.bills) {
      return res.render("OrderList/listOder", {
        listBillProducts: [],
        countAllBillProducts: totalCount,
        countNowBillProducts: ObjBillPr.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage,
      });
    }
    shipper.bills.forEach((bill) => {
      if (bill.idBill.equals(idBill)) {
        bill.status = newDeliveryStatus;
      }
    });
    await shipper.save();

    return res.render("OrderList/listOder", {
      listBillProducts: ObjBillPr,
      countAllBillProducts: totalCount,
      countNowBillProducts: ObjBillPr.length,
      msg: msg,
      currentPage: currentPage,
      totalPage: totalPage,
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
    let idShipper = getIdShipperFromSession(req); // Đoạn này cần logic để lấy idShipper từ session

    let listbillProduct = await mdbillProduct.billProductModel
      .find({ deliveryStatus: 2, idShipper: idShipper }) // Filter theo deliveryStatus và idShipper
      .populate("products.idProduct");

    if (listbillProduct && listbillProduct.length > 0) {
      return res.render("OrderList/listBillProductsDelivering", {
        listBillProducts: listbillProduct,
      });
    } else {
      return res.render("OrderList/listBillProductsDelivering", {
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
      .find({ deliveryStatus: -2, idShipper: idShipper })
      .populate("products.idProduct");

    if (listbillProduct && listbillProduct.length > 0) {
      return res.render("OrderList/listBillProductsFall", {
        listBillProducts: listbillProduct,
      });
    } else {
      return res.render("OrderList/listBillProductsFall", {
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
      .find({ deliveryStatus: 3, idShipper: idShipper })
      .populate("products.idProduct");

    if (listbillProduct && listbillProduct.length > 0) {
      return res.render("OrderList/listBillProductsSucess", {
        listBillProducts: listbillProduct,
      });
    } else {
      return res.render("OrderList/listBillProductsSucess", {
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
      .find({ deliveryStatus: -1, idShipper: idShipper })
      .populate("products.idProduct");

    if (listbillProduct && listbillProduct.length > 0) {
      return res.render("OrderList/listBillProductsCancel", {
        listBillProducts: listbillProduct,
      });
    } else {
      return res.render("OrderList/listBillProductsCancel", {
        listBillProducts: [],
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyEmail = async (req, res, next) => {
  if (req.method == "POST") {
    let decode = decodeFromSha256(req.params.encodeToSha256);
    try {
      var data = await mdUserAccount.findOne({ emailAddress: decode });
      if (data != null) {
        data.isVerifyEmail = 0;
        await mdUserAccount.findByIdAndUpdate(data._id, data);
        return res
          .status(200)
          .json({
            success: true,
            data: {},
            message: "Xác minh email thành công",
          });
      } else {
        return res
          .status(500)
          .json({
            success: false,
            data: {},
            message: "Xác minh email thất bại",
          });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Xác minh email thất bại" });
    }
  }
  res.render("Account/verifyEmail");
};

exports.verifyResult = async (req, res, next) => {
  let isVerify = req.query.isVerify;
  res.render("Account/verifyResult", { isVerify: isVerify });
};
exports.detailShipper = async (req, res, next) => {
  let idShipper = getIdShipperFromSession(req);
  let objShipper = await mdShipper.ShipperModel.findById(idShipper);

  res.render("OrderList/proFileShipper", { objShipper: objShipper });
};

exports.updateShipperInformation = async (req, res, next) => {
  try {
    let idShipper = getIdShipperFromSession(req);
    let updatedFields = {
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
    };
    let objShipper = await mdShipper.ShipperModel.findByIdAndUpdate(
      idShipper,
      updatedFields,
      { new: true }
    );
    res.render("OrderList/proFileShipper", { objShipper: objShipper });
  } catch (error) {
    res.render("OrderList/updateProFileShipper");
  }
};

function getIdShipperFromSession(req) {
  return req.session.idShipper;
}
