let mdShop = require("../../model/shop.model");
let mdPet = require("../../model/pet.model").PetModel;
let mdProduct = require("../../model/product.model").ProductModel;
let mdBill = require("../../model/billProduct.model").billProductModel;
let mdAppointment = require("../../model/appointment.model").AppointmentModel;
let mdShiper = require("../../model/shipper.model").ShipperModel;
const OTPEmailModel = require("../../model/otpemail.model").OTPEmailModel;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const moment = require("moment");
const { onUploadImages } = require("../../function/uploadImage");
const {
  encodeToSha256,
  encodeToAscii,
  decodeFromSha256,
  decodeFromAscii,
  removeVietnameseTones,
  encodeName,
} = require("../../function/hashFunction");

exports.listShop = async (req, res, next) => {
  let filterSearch = null;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch != "undefined" &&
        req.query.filterSearch.trim() != ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { fullName: new RegExp(searchTerm, "i") };
      }
      let listShop = await mdShop.ShopModel.find(filterSearch);
      return res.status(200).json({
        success: true,
        data: listShop,
        message: "Lấy danh sách shop thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: [], message: "Lỗi: " + error.message });
    }
  }
};

exports.listPet = async (req, res, next) => {
  let filterSearch = null;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch != "undefined" &&
        req.query.filterSearch.trim() != ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { fullName: new RegExp(searchTerm, "i") };
      }
      let listPetShow = await mdPet
        .find({ idShop: req.shop._id, status: 0 })
        .populate("idCategoryP")
        .sort({ createdAt: -1 });
      let listPetHide = await mdPet
        .find({ idShop: req.shop._id, status: 1 })
        .populate("idCategoryP")
        .sort({ createdAt: -1 });
      if (listPetShow && listPetHide) {
        return res.status(200).json({
          success: true,
          data: {
            dataShow: listPetShow,
            dataHide: listPetHide,
          },
          message: "Lấy dữ liệu thú cưng thành công!",
        });
      } else {
        return res.status(200).json({
          success: false,
          data: [],
          message: "Lỗi: Không lấy được dữ liệu thú cưng!",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: [], message: "Lỗi: " + error.message });
    }
  }
};

exports.listProduct = async (req, res, next) => {
  let filterSearch = null;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch != "undefined" &&
        req.query.filterSearch.trim() != ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { fullName: new RegExp(searchTerm, "i") };
      }
      let listProductShow = await mdProduct
        .find({ idShop: req.shop._id, status: 0 })
        .populate("idCategoryPr")
        .sort({ createdAt: -1 });
      let listProductHide = await mdProduct
        .find({ idShop: req.shop._id, status: 1 })
        .populate("idCategoryPr")
        .sort({ createdAt: -1 });
      if (listProductShow && listProductHide) {
        return res.status(200).json({
          success: true,
          data: {
            dataShow: listProductShow,
            dataHide: listProductHide,
          },
          message: "Lấy dữ liệu sản phẩm thành công!",
        });
      } else {
        return res.status(200).json({
          success: false,
          data: [],
          message: "Lỗi: Không lấy được dữ liệu sản phẩm!",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: [], message: "Lỗi: " + error.message });
    }
  }
};

exports.listBillAll = async (req, res, next) => {
  let filterSearch = null;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch != "undefined" &&
        req.query.filterSearch.trim() != ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { fullName: new RegExp(searchTerm, "i") };
      }
      let listBill = await getListBill(req.shop._id, {
        $gte: -5,
        $lte: 5,
      });
      if (listBill && listBill.length > 0) {
        let list = onFinalProcessingListBill(listBill);
        listBill = [...list];
      }
      let listCanConfirm = await mdBill
        .find({ idShop: req.shop._id, deliveryStatus: 0 })
        .count();
      let listCanCancel = await mdBill
        .find({ idShop: req.shop._id, deliveryStatus: { $gte: 0, $lte: 1 } })
        .count();
      return res.status(200).json({
        success: true,
        data: {
          listBill,
          canConfirmAll: listCanConfirm ? true : false,
          canCancelAll: listCanCancel ? true : false,
        },
        message: "Lấy danh sách đơn hàng thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: [], message: "Lỗi: " + error.message });
    }
  }
};

exports.listProcessBill = async (req, res, next) => {
  let filterSearch = null;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch != "undefined" &&
        req.query.filterSearch.trim() != ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { fullName: new RegExp(searchTerm, "i") };
      }
      let listBill = await getListBill(req.shop._id, {
        $gte: 0,
        $lte: 1,
      });
      if (listBill && listBill.length > 0) {
        let list = onFinalProcessingListBill(listBill);
        listBill = [...list];
      }
      let listCanConfirm = await mdBill
        .find({ idShop: req.shop._id, deliveryStatus: 0 })
        .count();
      let listCanCancel = await mdBill
        .find({ idShop: req.shop._id, deliveryStatus: { $gte: 0, $lte: 1 } })
        .count();
      return res.status(200).json({
        success: true,
        data: {
          listBill,
          canConfirmAll: listCanConfirm ? true : false,
          canCancelAll: listCanCancel ? true : false,
        },
        message: "Lấy danh sách đơn hàng thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: [], message: "Lỗi: " + error.message });
    }
  }
};

exports.listDeliveringBill = async (req, res, next) => {
  let filterSearch = null;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch != "undefined" &&
        req.query.filterSearch.trim() != ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { fullName: new RegExp(searchTerm, "i") };
      }
      let listBill = await getListBill(req.shop._id, 2);
      if (listBill && listBill.length > 0) {
        let list = onFinalProcessingListBill(listBill);
        listBill = [...list];
      }
      return res.status(200).json({
        success: true,
        data: listBill,
        message: "Lấy danh sách đơn hàng thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: [], message: "Lỗi: " + error.message });
    }
  }
};

exports.listDeliveredBill = async (req, res, next) => {
  let filterSearch = null;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch != "undefined" &&
        req.query.filterSearch.trim() != ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { fullName: new RegExp(searchTerm, "i") };
      }
      let listBill = await getListBill(req.shop._id, 3);
      if (listBill && listBill.length > 0) {
        let list = onFinalProcessingListBill(listBill);
        listBill = [...list];
      }
      return res.status(200).json({
        success: true,
        data: listBill,
        message: "Lấy danh sách đơn hàng thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: [], message: "Lỗi: " + error.message });
    }
  }
};

exports.listEvaluatedBill = async (req, res, next) => {
  let filterSearch = null;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch != "undefined" &&
        req.query.filterSearch.trim() != ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { fullName: new RegExp(searchTerm, "i") };
      }
      let listBill = await getListBill(req.shop._id, 5);
      if (listBill && listBill.length > 0) {
        let list = onFinalProcessingListBill(listBill);
        listBill = [...list];
      }
      return res.status(200).json({
        success: true,
        data: listBill,
        message: "Lấy danh sách đơn hàng thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: [], message: "Lỗi: " + error.message });
    }
  }
};

exports.listCancelledBill = async (req, res, next) => {
  let filterSearch = null;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch != "undefined" &&
        req.query.filterSearch.trim() != ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { fullName: new RegExp(searchTerm, "i") };
      }
      let listBill = await getListBill(req.shop._id, -1);
      if (listBill && listBill.length > 0) {
        let list = onFinalProcessingListBill(listBill);
        listBill = [...list];
      }
      return res.status(200).json({
        success: true,
        data: listBill,
        message: "Lấy danh sách đơn hàng thành công",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: [], message: "Lỗi: " + error.message });
    }
  }
};

exports.listAppointment = async (req, res, next) => {
  let listCheck = await mdAppointment.find({ idShop: req.shop._id });
  for (let i = 0; i < listCheck.length; i++) {
    const appointment = listCheck[i];
    if (
      new Date(appointment.appointmentDate) < new Date() &&
      appointment.status == 0
    ) {
      appointment.status = 2;
      await mdAppointment.findByIdAndUpdate(appointment._id, appointment);
    }
  }
  let listAppointment = await mdAppointment.aggregate([
    {
      $match: {
        idShop: req.shop._id,
      },
    },
    { $sort: { appointmentDate: -1 } },
    {
      $lookup: {
        from: "Pets",
        localField: "idPet",
        foreignField: "_id",
        as: "iPet",
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "idUser",
        foreignField: "_id",
        as: "iUser",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$appointmentDate" },
          month: { $month: "$appointmentDate" },
        },
        appointments: {
          $push: {
            _id: "$_id",
            idPet: "$iPet",
            idUser: "$iUser",
            idShop: "$iShop",
            amountPet: "$amountPet",
            location: "$location",
            deposits: "$deposits",
            status: "$status",
            appointmentDate: "$appointmentDate",
            createdAt: "$createdAt",
          },
        },
      },
    },
    { $project: { _id: "$_id", appointments: "$appointments" } },
    { $sort: { _id: -1 } },
  ]);
  if (listAppointment) {
    return res.status(200).json({
      success: true,
      data: listAppointment,
      message: "Lấy danh sách lịch hẹn thành công.",
    });
  } else {
    return res.status(500).json({
      success: false,
      data: [],
      message: "Không lấy được danh sách lịch hẹn",
    });
  }
};

exports.statisticsChartRevenue = async (req, res, next) => {
  try {
    const months = [];
    const totalBills = [];
    const endDate = new Date();
    const last6Month = new Date(
      endDate.getFullYear(),
      endDate.getMonth() - 5,
      1
    );
    let currentDate = new Date(last6Month);

    while (currentDate <= endDate) {
      let previusDate = currentDate.toISOString();
      let nowDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      ).toISOString();
      let date = currentDate.toLocaleString("vi", {
        month: "numeric",
        year: "numeric",
      });
      months.push(date.substring(0, 1).toLocaleUpperCase() + date.substring(1));
      currentDate.setMonth(currentDate.getMonth() + 1);

      let total = await getTotalBill(req.shop._id, previusDate, nowDate);
      totalBills.push(Number(total) / 1000000);
    }
    return res.status(200).json({
      success: true,
      data: {
        date: months,
        value: totalBills,
      },
      message: "Lấy thống kê thành công",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.statisticsChartSold = async (req, res, next) => {
  try {
    const months = [];
    const listTotalProduct = [];
    const listTotalPet = [];
    const endDate = new Date();
    const last6Month = new Date(
      endDate.getFullYear(),
      endDate.getMonth() - 5,
      1
    );
    let currentDate = new Date(last6Month);

    while (currentDate <= endDate) {
      let previusDate = currentDate.toISOString();
      let nowDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      ).toISOString();
      let date = currentDate.toLocaleString("vi", {
        month: "numeric",
        year: "numeric",
      });
      months.push(date.substring(0, 1).toLocaleUpperCase() + date.substring(1));
      currentDate.setMonth(currentDate.getMonth() + 1);

      let result = await getTotalProduct(req.shop._id, previusDate, nowDate);
      listTotalProduct.push(result?.totalProd);
      listTotalPet.push(result?.totalPet);
    }
    return res.status(200).json({
      success: true,
      data: {
        date: months,
        pet: listTotalPet,
        product: listTotalProduct,
      },
      message: "Lấy thống kê thành công ",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.statisticsYearRevenue = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const totalBills = [];
    let fullTotal = 0;
    const endDate = new Date(year, 11, 1);
    const firstDate = new Date(year - 1, 12, 1);
    let currentDate = new Date(firstDate);

    while (currentDate <= endDate) {
      let previusDate = currentDate.toISOString();
      let nowDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      ).toISOString();
      let date = currentDate.toLocaleString("vi", {
        month: "long",
      });
      let total = await getTotalBill(req.shop._id, previusDate, nowDate);
      fullTotal += total;
      totalBills.push({
        date: date.substring(0, 1).toLocaleUpperCase() + date.substring(1),
        value:
          currentDate.getMonth() <= new Date().getMonth()
            ? total.toLocaleString("en") + " ₫"
            : "Chưa có dữ liệu",
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return res.status(200).json({
      success: true,
      data: {
        list: totalBills,
        total: fullTotal.toLocaleString("en") + " ₫",
      },
      message: "Lấy thống kê thành công",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.statisticsYearSold = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const listTotalProduct = [];
    const listTotalPet = [];
    let totalProduct = 0;
    let totalPet = 0;
    const endDate = new Date(year, 11, 1);
    const firstDate = new Date(year - 1, 12, 1);
    let currentDate = new Date(firstDate);

    while (currentDate <= endDate) {
      let previusDate = currentDate.toISOString();
      let nowDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      ).toISOString();
      let date = currentDate.toLocaleString("vi", {
        month: "long",
      });

      let result = await getTotalProduct(req.shop._id, previusDate, nowDate);
      listTotalProduct.push({
        date: date.substring(0, 1).toLocaleUpperCase() + date.substring(1),
        value:
          currentDate.getMonth() <= new Date().getMonth()
            ? result?.totalProd
            : "Chưa có dữ liệu",
      });
      listTotalPet.push({
        date: date.substring(0, 1).toLocaleUpperCase() + date.substring(1),
        value:
          currentDate.getMonth() <= new Date().getMonth()
            ? result?.totalPet
            : "Chưa có dữ liệu",
      });
      totalPet += result?.totalPet;
      totalProduct += result?.totalProd;

      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return res.status(200).json({
      success: true,
      data: {
        pet: {
          list: listTotalPet,
          total: totalPet,
        },
        product: {
          list: listTotalProduct,
          total: totalProduct,
        },
      },
      message: "Lấy thống kê thành công ",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.detailShop = async (req, res, next) => {
  let idShop = req.params.idShop;
  try {
    let ObjShop = await mdShop.ShopModel.findById(idShop);
    return res.status(200).json({
      success: true,
      data: ObjShop,
      message: "Lấy dữ liệu chi tiết shop thành công",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.detailPet = async (req, res, next) => {
  if (req.method == "GET") {
    let pet = await mdPet.findById(req.params.idPet).populate({
      path: "idCategoryP",
      select: "nameCategory",
    });
    if (pet) {
      pet = pet.toObject();
      if (pet.sizePet != undefined) {
        switch (pet.sizePet) {
          case 0:
            pet.sizePet = "Nhỏ";
            break;
          case 1:
            pet.sizePet = "Vừa";
            break;
          case 2:
            pet.sizePet = "Lớn";
            break;

          default:
            break;
        }
      }
      if (pet.status != undefined) {
        switch (pet.status) {
          case 0:
            pet.status = "Đang bán";
            break;
          case 1:
            pet.status = "Đang ẩn";
            break;

          default:
            break;
        }
      }
      return res.status(200).json({
        success: true,
        data: pet,
        message: "Lấy thú cưng thành công.",
      });
    } else {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Không lấy được thú cưng" });
    }
  }
};

exports.detailProduct = async (req, res, next) => {
  if (req.method == "GET") {
    let product = await mdProduct.findById(req.params.idProd).populate({
      path: "idCategoryPr",
      select: "nameCategory",
    });
    if (product) {
      product = product.toObject();
      if (product.status != undefined) {
        switch (product.status) {
          case 0:
            product.status = "Đang bán";
            break;
          case 1:
            product.status = "Đang ẩn";
            break;

          default:
            break;
        }
      }
      return res.status(200).json({
        success: true,
        data: product,
        message: "Lấy sản phẩm thành công.",
      });
    } else {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Không lấy được sản phẩm" });
    }
  }
};

exports.detailAppointment = async (req, res, next) => {
  if (req.method == "GET") {
    let appointment = await mdAppointment
      .findById(req.params.idAppt)
      .populate({
        path: "idPet",
        populate: {
          path: "idCategoryP",
          select: "nameCategory",
        },
      })
      .populate({
        path: "idUser",
        populate: {
          path: "idAccount",
          select: ["phoneNumber", "emailAddress"],
        },
        select: ["avatarUser", "fullName", "locationUser", "idAccount"],
      });
    if (appointment) {
      appointment = appointment.toObject();
      if (
        new Date(appointment?.appointmentDate) < new Date() &&
        appointment?.status == 0
      ) {
        appointment.status = 2;
        await mdAppointment.findByIdAndUpdate(appointment._id, appointment);
        appointment.canConfirm = false;
        appointment.canCancel = false;
        appointment.nameStatus = "Đã lỡ hẹn";
        return res.status(200).json({
          success: true,
          data: appointment,
          message: "Lấy lịch hẹn thành công.",
        });
      }
      switch (String(appointment.status)) {
        case "-1":
          appointment.canAccept = true;
          appointment.canCancel = false;
          appointment.canConfirm = false;
          appointment.nameStatus = "Chờ xác nhận";
          break;
        case "0":
          appointment.canAccept = false;
          appointment.canCancel = true;
          appointment.canConfirm = true;
          appointment.nameStatus = "Đang hẹn";
          break;
        case "1":
          appointment.canAccept = false;
          appointment.canCancel = false;
          appointment.canConfirm = false;
          appointment.nameStatus = "Đã hẹn";
          break;
        case "2":
          appointment.canAccept = false;
          appointment.canCancel = false;
          appointment.canConfirm = false;
          appointment.nameStatus = "Đã lỡ hẹn";
          break;
        case "3":
          appointment.canAccept = false;
          appointment.canCancel = false;
          appointment.canConfirm = false;
          appointment.nameStatus = "Đã hủy hẹn";
          break;
        default:
          break;
      }
      return res.status(200).json({
        success: true,
        data: appointment,
        message: "Lấy lịch hẹn thành công.",
      });
    } else {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Không lấy được lịch hẹn" });
    }
  }
};

exports.confirmBill = async (req, res, next) => {
  if (req.method == "POST") {
    let { idBill, isConfirm } = req.body;
    if (idBill && isConfirm != undefined) {
      try {
        let billProduct = await mdBill.findOne({
          _id: idBill,
          idShop: req.shop._id,
        });
        if (!billProduct) {
          return res.status(500).json({
            success: false,
            data: {},
            message: "Không tìm thấy dữ liệu! ",
          });
        }
        if (isConfirm == 0) {
          billProduct.deliveryStatus = 1;
          billProduct.billDate.confirmedAt = new Date();
          await mdBill.findByIdAndUpdate(billProduct._id, billProduct);
          let statusBill = {};
          statusBill.status = 1;
          statusBill.colorStatus = "#001858";
          statusBill.nameStatus = "Đã xác nhận";
          statusBill.iconStatus = "timer-sand-complete";
          statusBill.descStatus =
            "Đơn hàng đã được xác nhận và đang chờ được giao.";
          return res.status(201).json({
            success: true,
            data: statusBill,
            message: "Xác nhận đơn hàng thành công.",
          });
          //Auto find shipper
        }
        if (isConfirm == 1) {
          billProduct.deliveryStatus = -1;
          await mdBill.findByIdAndUpdate(billProduct._id, billProduct);
          let statusBill = {};
          statusBill.status = -1;
          statusBill.colorStatus = "#FD3F3F";
          statusBill.nameStatus = "Đơn bị hủy";
          statusBill.iconStatus = "clipboard-remove-outline";
          statusBill.descStatus = "Đơn hàng đã bị hủy.";
          return res.status(201).json({
            success: true,
            data: statusBill,
            message: "Hủy nhận đơn hàng thành công.",
          });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, data: {}, message: "Lỗi: " + error.message });
      }
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Không đọc được dữ liệu tải lên! ",
      });
    }
  }
};

exports.confirmBillAll = async (req, res, next) => {
  if (req.method == "POST") {
    // bỏ cmt đoạn dưới này và call api ở postman để đổi toàn bộ status lại thành 0 để test
    // let billProduct = await mdBill.find({ idShop: req.shop._id });
    // if (billProduct) {
    //     for (let i = 0; i < billProduct.length; i++) {
    //         const bill = billProduct[i];
    //         bill.deliveryStatus = 0;
    //         await mdBill.findByIdAndUpdate(bill._id, bill);
    //     }
    // }
    // return res.status(201).json({ data: true })
    let { isConfirm } = req.body;
    if (isConfirm != undefined) {
      try {
        if (isConfirm == 0) {
          let billProduct = await mdBill.find({
            idShop: req.shop._id,
            deliveryStatus: 0,
          });
          if (!billProduct) {
            return res.status(500).json({
              success: false,
              data: {},
              message: "Không tìm thấy dữ liệu! ",
            });
          }
          for (let i = 0; i < billProduct.length; i++) {
            const bill = billProduct[i];
            bill.deliveryStatus = 1;
            bill.billDate.confirmedAt = new Date();
            await mdBill.findByIdAndUpdate(bill._id, bill);
          }
          return res.status(201).json({
            success: true,
            data: {},
            message: "Xác nhận tất cả đơn hàng thành công.",
          });
          //Auto find shipper
        }
        if (isConfirm == 1) {
          let billProduct = await mdBill.find({
            idShop: req.shop._id,
            deliveryStatus: { $gte: 0, $lte: 1 },
          });
          if (!billProduct) {
            return res.status(500).json({
              success: false,
              data: {},
              message: "Không tìm thấy dữ liệu! ",
            });
          }
          for (let i = 0; i < billProduct.length; i++) {
            const bill = billProduct[i];
            bill.deliveryStatus = -1;
            bill.billDate.cancelledAt = new Date();
            await mdBill.findByIdAndUpdate(bill._id, bill);
          }
          return res.status(201).json({
            success: true,
            data: {},
            message: "Hủy nhận tất cả đơn hàng thành công.",
          });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, data: {}, message: "Lỗi: " + error.message });
      }
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Không đọc được dữ liệu tải lên! ",
      });
    }
  }
};

exports.updateApm = async (req, res, next) => {
  try {
    let { status, idAppt } = req.body;
    if (req.method == "PUT") {
      if (status && idAppt) {
        const objAppt = await mdAppointment
          .findById(idAppt)
          .populate({
            path: "idPet",
            populate: {
              path: "idCategoryP",
              select: "nameCategory",
            },
          })
          .populate({
            path: "idUser",
            populate: {
              path: "idAccount",
              select: ["phoneNumber", "emailAddress"],
            },
            select: ["avatarUser", "fullName", "locationUser", "idAccount"],
          });
        if (!objAppt) {
          return res
            .status(500)
            .json({ success: false, message: "Không tìm thấy lịch hẹn." });
        }

        if (status == 0 || status == 1 || status == 2 || status == 3) {
          let mes = "";
          switch (String(status)) {
            case "0":
              mes = "Nhận lịch hẹn thành công.";
              break;
            case "1":
              mes = "Đổi trạng thái thành đã hẹn thành công.";
              break;
            case "2":
              mes = "Đổi trạng thái thành lỡ hẹn thành công.";
              break;
            case "3":
              if (objAppt.status == -1) {
                mes = "Hủy nhận lịch hẹn thành công.";
              } else {
                mes = "Hủy lịch hẹn thành công.";
              }
              break;

            default:
              break;
          }
          objAppt.status = status;

          await mdAppointment.findByIdAndUpdate(idAppt, objAppt);
          let appointment = objAppt.toObject();
          switch (String(appointment.status)) {
            case "-1":
              appointment.canAccept = true;
              appointment.canCancel = false;
              appointment.canConfirm = false;
              appointment.nameStatus = "Chờ xác nhận";
              break;
            case "0":
              appointment.canAccept = false;
              appointment.canCancel = true;
              appointment.canConfirm = true;
              appointment.nameStatus = "Đang hẹn";
              break;
            case "1":
              appointment.canAccept = false;
              appointment.canCancel = false;
              appointment.canConfirm = false;
              appointment.nameStatus = "Đã hẹn";
              break;
            case "2":
              appointment.canAccept = false;
              appointment.canCancel = false;
              appointment.canConfirm = false;
              appointment.nameStatus = "Đã lỡ hẹn";
              break;
            case "3":
              appointment.canAccept = false;
              appointment.canCancel = false;
              appointment.canConfirm = false;
              appointment.nameStatus = "Đã hủy hẹn";
              break;
            default:
              break;
          }
          return res
            .status(201)
            .json({ success: true, data: appointment, message: mes });
        } else {
          return res
            .status(500)
            .json({ success: false, message: "Trạng thái không hợp lệ." });
        }
      } else {
        return res.status(500).json({
          success: false,
          data: {},
          message: "Không đọc được giữ liệu tải lên!",
        });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: error.message });
  }
};

exports.myShopDetail = async (req, res, next) => {
  try {
    // let objShop = await mdShop.ShopModel.findById(req.shop._id);
    const { _id } = req.shop;
    let listBill = await mdBill.find({ idShop: _id });
    if (listBill) {
      req.shop = req?.shop.toObject();
      req.shop.billCount = listBill.length;
      const statusArray = [0, 1, 2, 3, 5];
      try {
        const pipeline = [
          {
            $match: {
              idShop: _id,
              deliveryStatus: { $in: statusArray },
            },
          },
          {
            $group: {
              _id: "$deliveryStatus",
              count: { $sum: 1 },
            },
          },
        ];

        const results = await mdBill.aggregate(pipeline);

        const statusCountObject = {};

        for (let i = 0; i < results.length; i++) {
          let result = results[i];
          if (result._id <= 1) {
            if (statusCountObject["0"]) {
              statusCountObject["0"] =
                Number(result.count) + Number(statusCountObject["0"]);
            } else {
              statusCountObject["0"] = result.count;
            }
          } else {
            if (result._id == 5) {
              statusCountObject["3"] = result.count;
            } else {
              statusCountObject[String(result._id - 1)] = result.count;
            }
          }
        }
        req.shop.objCountBills = statusCountObject;
        return res.status(200).json({
          success: true,
          data: req.shop,
          message: "Lấy dữ liệu chi tiết shop thành công",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          data: [],
          message: "Lấy danh sách hóa đơn thất bại",
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        data: req.shop,
        message: "Lấy dữ liệu chi tiết shop thành công",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.detailOwner = async (req, res, next) => {
  try {
    let objShop = await mdShop.ShopModel.findById(req.shop._id);
    if (!objShop) {
      return res.status(200).json({
        success: false,
        data: objShop,
        message: "Không tìm thấy dữ liệu cửa hàng!",
      });
    }
    let objOwner = {};

    const data = jwt.verify(req.shop.ownerIdentity, process.env.TOKEN_SEC_KEY);
    if (data) {
      if (data._id == objShop._id) {
        let encodeOwnerIdentity = data.ownerIdentity;
        let decodeData = await decodeFromAscii(encodeOwnerIdentity);
        let decodeObj = { ...JSON.parse(decodeData) };
        let nameIdentity = decodeFromSha256(decodeObj.nameIdentity);
        let numberIdentity = decodeFromSha256(decodeObj.numberIdentity);
        let dateIdentity = decodeFromSha256(decodeObj.dateIdentity);
        let nameCard = "VU TRONG HOANG LINH";
        let numberCard = "1234 5678 9101 1278";
        let nameBank = "MBBank";
        let expirationDate = "05/25";
        let createdAt = objShop.createdAt;
        objOwner = {
          nameIdentity: encodeName(removeVietnameseTones(nameIdentity)),
          numberIdentity:
            numberIdentity.substring(0, 2) +
            numberIdentity
              .substring(2, numberIdentity.length - 2)
              .replace(/[0-9]/g, "*") +
            numberIdentity.substring(numberIdentity.length - 2),
          dateIdentity: dateIdentity,
          nameCard: encodeName(removeVietnameseTones(nameCard)),
          numberCard:
            numberCard
              .substring(0, numberCard.length - 3)
              .replace(/[0-9]/g, "*") +
            numberCard.substring(numberCard.length - 3),
          nameBank: nameBank,
          expirationDate: expirationDate,
          createdAt: moment(createdAt).format("DD/MM/YYYY HH:mm A"),
        };
      }
    }
    return res.status(200).json({
      success: true,
      data: objOwner,
      message: "Lấy dữ liệu chi tiết shop thành công",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.detailShop = async (req, res, next) => {
  let idShop = req.params.idShop;
  try {
    let ObjShop = await mdShop.ShopModel.findById({ _id: idShop });
    return res.status(200).json({
      success: true,
      data: ObjShop,
      message: "Lấy dữ liệu chi tiết shop thành công",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.checkPhoneNumber = async (req, res, next) => {
  try {
    if (req.method == "POST") {
      let objHL = await mdShop.ShopModel.findOne({ hotline: req.body.hotline });
      if (objHL) {
        return res.status(201).json({
          success: false,
          data: objHL,
          message: "Số điện thoại đã được sử dụng.",
        });
      }
      if (req.body.userName) {
        let objUN = await mdShop.ShopModel.findOne({
          userName: req.body.userName,
        });
        if (objUN) {
          return res.status(201).json({
            success: false,
            data: objHL,
            message: "Tên đăng nhập đã được sử dụng.",
          });
        }
      }
      return res.status(201).json({
        success: true,
        data: objHL,
        message: "Số điện thoại chưa được sử dụng.",
      });
    }
    if (req.method == "PUT") {
      let objHL = await mdShop.ShopModel.findOne({ hotline: req.body.hotline });
      if (objHL) {
        return res.status(201).json({
          success: false,
          data: objHL,
          message: "Số điện thoại đã được sử dụng.",
        });
      }
      if (req.body.userName) {
        let objUN = await mdShop.ShopModel.findOne({
          userName: req.body.userName,
        });
        if (objUN) {
          return res.status(201).json({
            success: false,
            data: objHL,
            message: "Tên đăng nhập đã được sử dụng.",
          });
        }
      }
      return res.status(201).json({
        success: true,
        data: objHL,
        message: "Số điện thoại chưa được sử dụng.",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.checkEmail = async (req, res, next) => {
  try {
    let objU = await mdShop.ShopModel.findOne({ email: req.body.email });
    if (!objU) {
      return res.status(201).json({
        success: false,
        data: objU,
        message: "Email chưa được đăng ký.",
      });
    } else {
      return res
        .status(201)
        .json({ success: true, data: objU, message: "Email đã được đăng ký." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.autoLogin = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.shop.status,
      message: "Đăng nhập thành công.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};

exports.registerShop = async (req, res, next) => {
  if (req.method == "POST") {
    let newShop = new mdShop.ShopModel();
    newShop.nameShop = req.body.nameShop;
    newShop.email = req.body.email;
    newShop.locationShop = req.body.locationShop;
    newShop.userName = req.body.userName;
    const salt = await bcrypt.genSalt(10);
    newShop.passWord = await bcrypt.hash(req.body.passWord, salt);
    newShop.description = "";
    newShop.status = 0;
    newShop.followers = 0;
    newShop.revenue = 0;
    newShop.online = 1;
    newShop.hotline = req.body.hotline;
    newShop.createdAt = new Date();
    await newShop.generateAuthToken(newShop);
    let images = await onUploadImages(req.files, "shop");
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
    newShop.avatarShop = images[0];
    let ownerIdentity = JSON.stringify({
      nameIdentity: encodeToSha256(String(req.body.nameIdentity)),
      numberIdentity: encodeToSha256(String(req.body.numberIdentity)),
      dateIdentity: encodeToSha256(String(req.body.dateIdentity)),
      imageIdentity: [encodeToSha256(images[1]), encodeToSha256(images[2])],
    });
    await newShop.encodeOwnerIdentity(newShop, encodeToAscii(ownerIdentity));

    try {
      await newShop.save();
      return res
        .status(201)
        .json({ success: true, data: {}, message: "Thêm shop thanh công" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        data: {},
        message: JSON.stringify(error.message),
      });
    }
  }
};

exports.loginShop = async (req, res, next) => {
  if (req.method == "POST") {
    try {
      let objS = await mdShop.ShopModel.findByCredentials(
        req.body.userName,
        req.body.passWord
      );
      if (!objS) {
        return res
          .status(201)
          .json({ success: false, message: "Sai thông tin đăng nhập!" });
      }
      objS.online = 0;
      await mdShop.ShopModel.findByIdAndUpdate(objS._id, objS);
      return res.status(201).json({
        success: true,
        data: { shopStatus: objS.status },
        token: objS.token,
        message: "Đăng nhập thành công.",
      });
    } catch (error) {
      console.error("err: " + error.message);

      return res.status(500).json({
        success: false,
        data: {},
        message: error.message,
      });
    }
  }
};

exports.editShop = async (req, res, next) => {
  let msg = "";
  let idShop = req.params.idShop;
  if (req.method == "PUT") {
    // let ObjShop = await mdShop.ShopModel.findById(idShop);
    let newObj = new mdShop.ShopModel();
    newObj.nameShop = req.body.nameShop;
    newObj.email = req.body.email;
    newObj.locationShop = req.body.locationShop;
    let images = await onUploadImages(req.files, "shop");
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
    newObj.avatarShop = [...images];
    newObj.description = req.body.description;
    newObj.status = "Chưa được duyệt";
    newObj.followers = 0;
    newObj.idUserShop = req.body.idUserShop;
    newObj.revenue = 0;
    newObj.hotline = req.body.hotline;
    newObj.createdAt = new Date();
    newObj._id = idShop;

    try {
      await mdShop.ShopModel.findByIdAndUpdate(idShop, newObj);
      return res.status(201).json({
        success: true,
        data: newObj,
        message: "Cập nhật shop thành công",
      });
    } catch (error) {
      console.log(error.message);

      if (
        !req.body.nameShop &
        !req.body.email &
        !req.body.locationShop &
        !req.body.description &
        !req.body.status &
        !req.body.idUserShop &
        !req.body.hotline
      ) {
        msg = "Không để trống thông tin";
      } else if (error.message.match(new RegExp(".+`nameShop` is require+."))) {
        msg = "Tên shop đang trống!";
      } else if (error.message.match(new RegExp(".+`email` is require+."))) {
        msg = "Email shop đang trống!";
      } else if (!validator.validate(req.body.email)) {
        msg = "Email shop không đúng định dạng!";
      } else if (
        error.message.match(new RegExp(".+`locationShop` is require+."))
      ) {
        msg = "Địa chỉ shop đang trống!";
      } else if (
        error.message.match(new RegExp(".+`description` is require+."))
      ) {
        msg = "Mô tả shop đang trống!";
      } else if (error.message.match(new RegExp(".+`hotline` is require+."))) {
        msg = "Số điện thoại đang trống!";
      } else if (
        error.message.match(new RegExp('.+Number failed for value "+.'))
      ) {
        msg = "Số điện thoại phải nhập số dương!";
      } else {
        msg = error.message;
      }
      var phoneValidate = /^\d{10}$/;
      if (!phoneValidate.test(req.body.hotline)) {
        msg = "Số điện thoại chưa đúng định đạng 9 số!";
        return res.status(500).json({ success: false, data: {}, message: msg });
      }
      return res.status(500).json({ success: false, data: {}, message: msg });
    }
  }
};

exports.updateInfo = async (req, res, next) => {
  if (req.method == "PUT") {
    if (req.body.typeInfo) {
      try {
        switch (req.body.typeInfo) {
          case "nameShop":
            req.shop.nameShop = req.body.valueUpdate;
            await mdShop.ShopModel.findByIdAndUpdate(req.shop._id, req.shop);
            break;
          case "locationShop":
            req.shop.locationShop = req.body.valueUpdate;
            await mdShop.ShopModel.findByIdAndUpdate(req.shop._id, req.shop);
            break;
          case "description":
            req.shop.description = req.body.valueUpdate;
            await mdShop.ShopModel.findByIdAndUpdate(req.shop._id, req.shop);
            break;

          default:
            break;
        }
        return res.status(201).json({
          success: true,
          data: req.shop,
          message: "Cập nhật dữ liệu thành công.",
        });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, data: {}, message: "Lỗi: " + error.message });
      }
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Không đọc được dữ liệu tải lên! ",
      });
    }
  }
};

exports.updateAccount = async (req, res, next) => {
  if (req.method == "PUT") {
    if (req.body.typeInfo) {
      try {
        switch (req.body.typeInfo) {
          case "hotline":
            req.shop.hotline = req.body.valueUpdate;
            await mdShop.ShopModel.findByIdAndUpdate(req.shop._id, req.shop);
            return res.status(201).json({
              success: true,
              data: {},
              message: "Cập nhật dữ liệu thành công.",
            });
          case "email":
            req.shop.email = req.body.valueUpdate;
            await mdShop.ShopModel.findByIdAndUpdate(req.shop._id, req.shop);
            return res.status(201).json({
              success: true,
              data: {},
              message: "Cập nhật dữ liệu thành công.",
            });

          default:
            break;
        }
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, data: {}, message: "Lỗi: " + error.message });
      }
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Không đọc được dữ liệu tải lên! ",
      });
    }
  }
};

exports.updatePassword = async (req, res, next) => {
  if (req.method == "PUT") {
    let { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword || !req.body) {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Không đọc được dữ liệu tải lên!",
      });
    }
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      req.shop.passWord
    );
    if (!isPasswordMatch) {
      return res.status(201).json({
        success: false,
        data: {},
        message: "Mật khẩu hiện tại nhập sai!",
      });
    }
    req.shop.passWord = newPassword;
    await mdShop.ShopModel.findByIdAndUpdate(req.shop._id, req.shop);
    return res.status(201).json({
      success: true,
      data: {},
      message: "Cập nhật mật khẩu thành công.",
    });
  }
};

exports.changePassword = async (req, res, next) => {
  if (req.method == "PUT") {
    var body = req.body;
    if (body.typeUpdate && body.valueUpdate && body.newPassword) {
      try {
        let shop = {};
        if (body.typeUpdate == "email") {
          shop = await mdShop.ShopModel.findOne({ email: body.valueUpdate });
        } else {
          shop = await mdShop.ShopModel.findOne({ hotline: body.valueUpdate });
        }
        const salt = await bcrypt.genSalt(10);
        shop.passWord = await bcrypt.hash(body.newPassword, salt);
        await mdShop.ShopModel.findByIdAndUpdate(shop._id, shop);
        return res.status(201).json({
          success: true,
          data: {},
          message: "Đổi mật khẩu thành công.",
        });
      } catch (error) {
        console.log(error);
        return res
          .status(201)
          .json({ success: false, data: {}, message: "Lỗi: " + error.message });
      }
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message:
          "Đổi mật khẩu thất bại, không nhận được dữ liệu mật khẩu mới! ",
      });
    }
  }
};

exports.updateAvatar = async (req, res, next) => {
  if (req.method == "PUT") {
    try {
      let images = await onUploadImages(req.files, "shop");
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
      req.shop.avatarShop = images[0];
      await mdShop.ShopModel.findByIdAndUpdate(req.shop._id, req.shop);
      return res.status(201).json({
        success: true,
        data: {},
        message: "Cập nhật ảnh đại diện thành công.",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
};

exports.deleteShop = async (req, res, next) => {
  let idShop = req.params.idShop;
  let ObjShop = await mdShop.ShopModel.findById(idShop);

  if (req.method == "DELETE") {
    try {
      await mdShop.ShopModel.findByIdAndDelete(idShop);
      return res
        .status(203)
        .json({ success: true, data: {}, message: "Shop không còn tồn tại" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
};

exports.sendVerifyEmail = async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.email != undefined) {
      var data = await OTPEmailModel.find({
        email: req.body.email,
        typeUser: 1,
      });
      var newOTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await sendEmailOTP(req.body.email, newOTP, data, res);
    }
  }
};

exports.verifyCode = async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.email != undefined && req.body.otp != undefined) {
      var data = await OTPEmailModel.find({
        email: req.body.email,
        typeUser: 1,
      });
      if (data.length > 0) {
        if (data[0].code == Number(req.body.otp)) {
          var timeBetween =
            (new Date().getTime() - new Date(data[0].createdAt).getTime()) /
            1000;
          // console.log(date + "s");
          // console.log((date / 60) + "min");
          // console.log(new Date() - new Date(data[0].createdAt));
          if (timeBetween / 60 >= 5) {
            return res.status(201).json({
              success: false,
              data: {},
              message: "Mã xác minh quá hạn!",
            });
          } else {
            await OTPEmailModel.findByIdAndDelete(data[0]._id);
            return res.status(201).json({
              success: true,
              data: {},
              message: "Xác minh thành công!",
            });
          }
        } else {
          return res
            .status(500)
            .json({ success: false, data: {}, message: "Mã xác minh sai!" });
        }
      } else {
        return res.status(500).json({
          success: false,
          data: {},
          message: "Mã xác minh sai hoặc không tồn tại trong cơ sở dữ liệu",
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message: "Mã xác minh sai hoặc không tồn tại trong cơ sở dữ liệu",
      });
    }
  }
};

exports.sendResetPassword = async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.email != undefined) {
      var data = await OTPEmailModel.find({ email: req.body.email });
      var newOTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await sendEmailResetPassword(req.body.email, newOTP, data, res);
    }
  }
};

exports.verifyResetCode = async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.email != undefined && req.body.otp != undefined) {
      var data = await OTPEmailModel.find({ email: req.body.email });
      if (data.length > 0) {
        if (data[0].code == Number(req.body.otp)) {
          var timeBetween =
            (new Date().getTime() - new Date(data[0].createdAt).getTime()) /
            1000;
          // console.log(date + "s");
          // console.log((date / 60) + "min");
          // console.log(new Date() - new Date(data[0].createdAt));
          if (timeBetween / 60 >= 5) {
            return res.status(201).json({
              success: false,
              data: {},
              message: "Mã xác minh quá hạn!",
            });
          } else {
            await OTPEmailModel.findByIdAndDelete(data[0]._id);
            return res.status(201).json({
              success: true,
              data: {},
              message: "Xác minh thành công!",
            });
          }
        } else {
          return res
            .status(500)
            .json({ success: false, data: {}, message: "Mã xác minh sai!" });
        }
      } else {
        return res.status(500).json({
          success: false,
          data: {},
          message: "Mã xác minh sai hoặc không tồn tại trong cơ sở dữ liệu",
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        message: "OTP sai hoặc không tồn tại trong cơ sở dữ liệu",
      });
    }
  }
};

async function getListBill(idShop, billStatus) {
  try {
    let listbillProduct = await mdBill.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          idShop: idShop,
          deliveryStatus: billStatus,
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "idUser",
          foreignField: "_id",
          as: "userLookup",
        },
      },
      {
        $lookup: {
          from: "UserAccount",
          localField: "userLookup.idAccount",
          foreignField: "_id",
          as: "userAccLookup",
        },
      },
      {
        $lookup: {
          from: "Products",
          localField: "products.idProduct",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $lookup: {
          from: "CategoryProduct",
          localField: "productInfo.idCategoryPr",
          foreignField: "_id",
          as: "CtgProduct",
        },
      },
      {
        $lookup: {
          from: "Pets",
          localField: "products.idProduct",
          foreignField: "_id",
          as: "petInfo",
        },
      },
      {
        $lookup: {
          from: "CategoryPet",
          localField: "petInfo.idCategoryP",
          foreignField: "_id",
          as: "CtgPet",
        },
      },
      {
        $unwind: "$userAccLookup",
      },
      {
        $addFields: {
          "productInfo.idProduct": "$productInfo",
          "productInfo.amount": "$products.amount",
          "productInfo.discount": "$products.discount",
          "productInfo.price": "$products.price",
          "productInfo.category": "$CtgProduct",
          "petInfo.idPet": "$petInfo",
          "petInfo.amount": "$products.amount",
          "petInfo.discount": "$products.discount",
          "petInfo.price": "$products.price",
          "petInfo.category": "$CtgPet",
          "userLookup.phoneNumber": "$userAccLookup.phoneNumber",
          "userLookup.emailAddress": "$userAccLookup.emailAddress",
        },
      },
      {
        $group: {
          _id: "$_id",
          locationDetail: { $first: "$locationDetail" },
          total: { $first: "$total" },
          paymentMethods: { $first: "$paymentMethods" },
          purchaseDate: { $first: "$purchaseDate" },
          deliveryStatus: { $first: "$deliveryStatus" },
          discountBill: { $first: "$discountBill" },
          billDate: { $first: "$billDate" },
          productInfo: { $push: "$productInfo" },
          petInfo: { $first: "$petInfo" },
          userInfo: { $first: "$userLookup" },
        },
      },
      {
        $project: {
          locationDetail: 1,
          total: 1,
          paymentMethods: 1,
          purchaseDate: 1,
          deliveryStatus: 1,
          discountBill: 1,
          billDate: 1,
          "productInfo.idProduct": 1,
          "productInfo.amount": 1,
          "productInfo.price": 1,
          "productInfo.discount": 1,
          "productInfo.category": 1,
          "petInfo.idPet": 1,
          "petInfo.amount": 1,
          "petInfo.discount": 1,
          "petInfo.price": 1,
          "petInfo.category": 1,
          "userInfo.fullName": 1,
          "userInfo.avatarUser": 1,
          "userInfo.phoneNumber": 1,
          "userInfo.emailAddress": 1,
        },
      },
      { $sort: { purchaseDate: -1 } },
    ]);
    if (listbillProduct) {
      return listbillProduct;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

function onFinalProcessingListBill(listBill) {
  for (let i = 0; i < listBill.length; i++) {
    const bill = listBill[i];

    if (bill.deliveryStatus != undefined) {
      switch (String(bill.deliveryStatus)) {
        case "-2":
          bill.statusBill = {};
          bill.statusBill.status = Number(bill.deliveryStatus);
          bill.statusBill.colorStatus = "#FD3F3F";
          bill.statusBill.nameStatus = "Giao thất bại";
          bill.statusBill.iconStatus = "truck-remove-outline";
          bill.statusBill.descStatus =
            "Đơn hàng giao thất bại cho khách hàng của bạn.";
          break;
        case "-1":
          bill.statusBill = {};
          bill.statusBill.status = Number(bill.deliveryStatus);
          bill.statusBill.colorStatus = "#FD3F3F";
          bill.statusBill.nameStatus = "Đơn bị hủy";
          bill.statusBill.iconStatus = "clipboard-remove-outline";
          bill.statusBill.descStatus = "Đơn hàng đã bị hủy.";
          break;
        case "0":
          bill.statusBill = {};
          bill.statusBill.status = Number(bill.deliveryStatus);
          bill.statusBill.colorStatus = "#B59800";
          bill.statusBill.nameStatus = "Chờ xác nhận";
          bill.statusBill.iconStatus = "timer-sand";
          bill.statusBill.descStatus =
            "Đơn hàng đã được đặt và đang chờ được bạn xác nhận.";
          break;
        case "1":
          bill.statusBill = {};
          bill.statusBill.status = Number(bill.deliveryStatus);
          bill.statusBill.colorStatus = "#001858";
          bill.statusBill.nameStatus = "Đã xác nhận";
          bill.statusBill.iconStatus = "timer-sand-complete";
          bill.statusBill.descStatus =
            "Đơn hàng đã được xác nhận và đang chờ được giao.";
          break;
        case "2":
          bill.statusBill = {};
          bill.statusBill.status = Number(bill.deliveryStatus);
          bill.statusBill.colorStatus = "#001858";
          bill.statusBill.nameStatus = "Đang giao";
          bill.statusBill.iconStatus = "truck-fast-outline";
          bill.statusBill.descStatus =
            "Đơn hàng đang được giao đến khách hàng của bạn.";
          break;
        case "3":
          bill.statusBill = {};
          bill.statusBill.status = Number(bill.deliveryStatus);
          bill.statusBill.colorStatus = "#009A62";
          bill.statusBill.nameStatus = "Đã giao hàng";
          bill.statusBill.iconStatus = "truck-check-outline";
          bill.statusBill.descStatus =
            "Đơn hàng đã được giao cho khách hàng của bạn.";
          break;
        case "4":
          bill.statusBill = {};
          bill.statusBill.status = Number(bill.deliveryStatus);
          bill.statusBill.colorStatus = "#009A62";
          bill.statusBill.nameStatus = "Đã nhận hàng";
          bill.statusBill.iconStatus = "account-check-outline";
          bill.statusBill.descStatus =
            "Khách hàng đã nhận được sản phẩm của bạn.";
          break;
        case "5":
          bill.statusBill = {};
          bill.statusBill.status = Number(bill.deliveryStatus);
          bill.statusBill.colorStatus = "#001858";
          bill.statusBill.nameStatus = "Đã đánh giá";
          bill.statusBill.iconStatus = "star-check-outline";
          bill.statusBill.descStatus =
            "Khách hàng đã đánh giá sản phẩm của bạn.";
          break;
        default:
          break;
      }
    }
    if (bill.paymentMethods != undefined) {
      switch (String(bill.paymentMethods)) {
        case "0":
          bill.paymentMethods = "Thanh toán khi nhận hàng";
          break;
        case "1":
          bill.paymentMethods = "Thẻ Visa";
          break;
        default:
          break;
      }
    }
    if (bill.productInfo != undefined) {
      let arrProduct = bill?.productInfo[0];
      if (arrProduct.length > 0) {
        let total = 0;
        for (let i = 0; i < arrProduct.length; i++) {
          const element = arrProduct[i];
          total += Number(element?.price) * Number(element?.amount);
        }
        bill.totalProduct = total;
      }
    }
    listBill.splice(i, 1, bill);
  }
  return listBill;
}

async function getTotalBill(shopId, previusDate, nowDate) {
  var match_stage = {
    $match: {
      idShop: shopId,
      purchaseDate: {
        $gte: new Date(previusDate),
        $lte: new Date(nowDate),
      },
    },
  };
  var group_stage = {
    $group: { _id: null, sum: { $sum: "$total" } },
  };
  var project_stage = {
    $project: { _id: 0, total: "$sum" },
  };

  var pipeline = [match_stage, group_stage, project_stage];
  let sumTotal = await mdBill.aggregate(pipeline);
  if (sumTotal[0] != undefined) {
    return sumTotal[0].total;
  } else {
    return 0;
  }
}

async function getTotalProduct(shopId, previusDate, nowDate) {
  var match_stage = {
    $match: {
      idShop: shopId,
      purchaseDate: {
        $gte: new Date(previusDate),
        $lte: new Date(nowDate),
      },
    },
  };

  var lookup_stage = [
    {
      $set: {
        cloneProducts: "$products",
      },
    },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "Products",
        localField: "products.idProduct",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $lookup: {
        from: "Pets",
        localField: "products.idProduct",
        foreignField: "_id",
        as: "petInfo",
      },
    },
    {
      $set: {
        productMap: {
          $map: {
            input: "$productInfo",
            as: "product",
            in: {
              $mergeObjects: [
                "$$product",
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$cloneProducts",
                        cond: { $eq: ["$$this._id", "$$product.idProduct"] },
                      },
                    },
                    0,
                  ],
                },
              ],
            },
          },
        },
      },
    },
  ];

  var group_stage = {
    $group: {
      _id: null,
      productCount: { $push: "$productMap" },
      sumPet: { $sum: { $size: "$petInfo" } },
    },
  };

  var project_stage = {
    $project: {
      _id: 0,
      totalPet: "$sumPet",
      totalProd: "$sumProd",
      productCount: "$productCount",
    },
  };

  var pipeline = [match_stage, ...lookup_stage, group_stage, project_stage];
  let sumTotal = await mdBill.aggregate(pipeline);
  let totalProd = 0;
  if (
    sumTotal[0] != undefined &&
    sumTotal[0]?.productCount &&
    sumTotal[0]?.productCount.length > 0
  ) {
    for (let i = 0; i < sumTotal[0]?.productCount.length; i++) {
      const prCount = sumTotal[0]?.productCount[i];
      if (prCount[0] != undefined) {
        totalProd += prCount[0].amount;
      }
    }
  }
  if (sumTotal[0] != undefined) {
    return {
      totalPet: sumTotal[0].totalPet,
      totalProd: totalProd,
    };
  } else {
    return {
      totalPet: 0,
      totalProd: 0,
    };
  }
}

async function sendEmailOTP(email, otp, data, res) {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "petworld.server.email@gmail.com",
      pass: "rrcn tlju vwab vgts",
      // pass: 'Lorem1000.-.. --- .-. . -- .---- ----- ----- -----'
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var content = "";
  content += `
        <div style="padding: 7px; background-color: #003375; border-radius: 7px;">
            <div style="padding: 10px; background-color: white; border-radius: 7px;">
                <p>Xin chào!</p>
                <p>Mã xác minh cho email của bạn là ${otp}.</p>
                <p>Để bảo mật an toàn, Bạn tuyệt đối không cung cấp mã xác minh này cho bất kỳ ai.</p>
                <p>Mã xác minh có hiệu lực trong vòng 5 phút. Nếu hết thời gian cho yêu cầu này, Xin vui lòng thực hiện lại yêu cầu để nhận được mã xác minh mới.</p>
                <p>Nếu bạn không yêu cầu xác minh email nữa, bạn có thể bỏ qua email này.</p>
                <p>Cảm ơn bạn!</p>
                <p>OurPetSeller</p>
                <img src="cid:logo1" alt="logo-petworld.png"
                    width="150" height="auto" />
            </div>
        </div>
    `;
  var mainOptions = {
    from: {
      name: "noreply@petworld-server.serverapp.com",
      address: "petworld.server.email@gmail.com",
    },
    to: email,
    subject: "Xác minh email của bạn cho OurPetSeller",
    text:
      "Xin chào! Mã xác minh cho email của bạn là " +
      otp +
      ". Để bảo mật an toàn, Bạn tuyệt đối không cung cấp mã xác minh này cho bất kỳ ai.",
    html: content,
    attachments: [
      {
        filename: "logo.jpg",
        path: `public/upload/ourpet_logo.png`,
        cid: "logo1",
      },
    ],
  };
  transporter.sendMail(mainOptions, async function (err, info) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: {},
        message: "Gửi mã xác minh thất bại!",
      });
    } else {
      if (data.length > 0) {
        await OTPEmailModel.findByIdAndUpdate(data[0]._id, {
          _id: data[0]._id,
          email: data[0].email,
          code: otp,
          typeUser: 1,
          createdAt: new Date(),
        });
        return res.status(201).json({
          success: true,
          data: {},
          message: "Gửi mã xác minh thành công.",
        });
      } else {
        let newOTPEmail = new OTPEmailModel();
        newOTPEmail.email = email;
        newOTPEmail.code = otp;
        newOTPEmail.typeUser = 1;
        newOTPEmail.createdAt = new Date();

        await newOTPEmail.save();
        return res.status(201).json({
          success: true,
          data: {},
          message: "Gửi mã xác minh thành công.",
        });
      }
    }
  });
}

async function sendEmailResetPassword(email, otp, data, res) {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "petworld.server.email@gmail.com",
      pass: "rrcn tlju vwab vgts",
      // pass: 'Lorem1000.-.. --- .-. . -- .---- ----- ----- -----'
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var content = "";
  content += `
        <div style="padding: 7px; background-color: #003375; border-radius: 7px;">
            <div style="padding: 10px; background-color: white; border-radius: 7px;">
                <p>Xin chào!</p>
                <p>Mã xác minh cho email của bạn là ${otp}.</p>
                <p>Để bảo mật an toàn, Bạn tuyệt đối không cung cấp mã xác minh này cho bất kỳ ai.</p>
                <p>Mã xác minh có hiệu lực trong vòng 5 phút. Nếu hết thời gian cho yêu cầu này, Xin vui lòng thực hiện lại yêu cầu để nhận được mã xác minh mới.</p>
                <p>Nếu bạn không yêu cầu xác minh email nữa, bạn có thể bỏ qua email này.</p>
                <p>Cảm ơn bạn!</p>
                <p>OurPetSeller</p>
                <img src="cid:logo1" alt="logo-petworld.png"
                    width="150" height="auto" />
            </div>
        </div>
    `;
  var mainOptions = {
    from: {
      name: "noreply@petworld-server.serverapp.com",
      address: "petworld.server.email@gmail.com",
    },
    to: email,
    subject: "Đặt lại mật khẩu của bạn cho OurPetSeller",
    text:
      "Xin chào! Mã xác minh cho email của bạn là " +
      otp +
      ". Để bảo mật an toàn, Bạn tuyệt đối không cung cấp mã xác minh này cho bất kỳ ai.",
    html: content,
    attachments: [
      {
        filename: "logo.jpg",
        path: `public/upload/ourpet_logo.png`,
        cid: "logo1",
      },
    ],
  };
  transporter.sendMail(mainOptions, async function (err, info) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: {},
        message: "Gửi mã xác minh thất bại!",
      });
    } else {
      if (data.length > 0) {
        await OTPEmailModel.findByIdAndUpdate(data[0]._id, {
          _id: data[0]._id,
          email: data[0].email,
          code: otp,
          typeUser: 1,
          createdAt: new Date(),
        });
        return res.status(201).json({
          success: true,
          data: {},
          message: "Gửi mã xác minh thành công.",
        });
      } else {
        let newOTPEmail = new OTPEmailModel();
        newOTPEmail.email = email;
        newOTPEmail.code = otp;
        newOTPEmail.typeUser = 1;
        newOTPEmail.createdAt = new Date();

        await newOTPEmail.save();
        return res.status(201).json({
          success: true,
          data: {},
          message: "Gửi mã xác minh thành công.",
        });
      }
    }
  });
}
exports.addBillForShipper = async (req, res) => {
  try {
    const billData = {
      idBill: "6537c712230314629ef45e2e",
      status: 1,
      location: "Yên sơn,Tuyên Quang",
    };

    const conditions = {
      address: billData.location,
    };

    const aggregationPipeline = [
      {
        $match: conditions,
      },
      {
        $addFields: {
          billsCount: { $size: "$bills" },
        },
      },
      {
        $sort: { billsCount: 1 },
      },
      {
        $limit: 1,
      },
    ];

    const shipperWithMinBills = await mdShiper
      .aggregate(aggregationPipeline)
      .exec();

    const update = {
      $push: {
        bills: {
          idBill: billData.idBill,
          status: billData.status,
        },
      },
    };

    if (shipperWithMinBills[0]) {
      const updateShipper = await mdShiper.findByIdAndUpdate(
        shipperWithMinBills[0]._id,
        update,
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: updateShipper,
        message: "Thêm bill cho shipper thành công",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      message: "Thêm bill cho shipper thất bại",
    });
  }
};
