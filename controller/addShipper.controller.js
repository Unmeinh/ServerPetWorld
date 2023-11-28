let mdAdmin = require('../model/admin.model');
let mdShipper = require("../../ServerPetWorld/model/shipper.model");
let mdbillProduct = require("../../ServerPetWorld/model/billProduct.model");

exports.listBillProduct = async (req, res, next) => {
  let msg = '';
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;

  try {
    if (req.method === 'GET') {
      let totalCount = await mdbillProduct.billProductModel.countDocuments(filterSearch);
      const totalPage = Math.ceil(totalCount / perPage);
      let skipCount = (perPage * (currentPage - 1));
      let listBillProducts = await mdbillProduct.billProductModel.find({})
        .skip(skipCount)
        .limit(perPage)
        .exec();

      return res.render('AddShipper/listBillProducts', {
        listBillProducts: listBillProducts,
        countAllBillProducts: totalCount,
        countNowBillProducts: listBillProducts.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
  } catch (error) {
    msg = 'Error: ' + error.message;
    console.log('Error fetching billProduct list: ' + error.message);
    return res.render('AddShipper/listBillProducts', {
      listBillProducts: [],
      msg: msg,
      countAllBillProducts: 0,
      countNowBillProducts: 0,
      currentPage: 1,
      totalPage: 1
    });
  }
};


exports.listShipper = async (req, res, next) => {
  let msg = '';
  let perPage = 6;
  let filterSearch = null;
  let currentPage = parseInt(req.query.page) || 1;
  let idBillProduct = req.params.idBillProduct;
  try {
    if (req.method === 'GET') {
      const billProduct = await mdbillProduct.billProductModel.findById(idBillProduct);
      let listBillProducts = await mdbillProduct.billProductModel.find();
      const location = billProduct.locationDetail.location;
      filterSearch = { address: { $regex: location, $options: 'i' } };

      let totalCount = await mdShipper.ShipperModel.countDocuments(filterSearch);
      const totalPage = Math.ceil(totalCount / perPage);
      let skipCount = (perPage * (currentPage - 1));
      let listShipper = await mdShipper.ShipperModel.find(filterSearch)
        .skip(skipCount)
        .limit(perPage)
        .exec();

      return res.render('AddShipper/listAddShipper', {
        listShipper: listShipper,
        listBillProducts: listBillProducts,
        countAllShipper: totalCount,
        countNowShipper: listShipper.length,
        msg: msg,
        currentPage: currentPage,
        totalPage: totalPage
      });
    }
  } catch (error) {
    msg = 'Error: ' + error.message;
    console.log('Error fetching admin list: ' + error.message);
    return res.render('AddShipper/listAddShipper', {
      listShipper: [],
      msg: msg,
      countAllShipper: 0,
      countNowShipper: 0,
      currentPage: 1,
      totalPage: 1
    });
  }
};
exports.addShipper = async (req, res) => {
  const idBillProduct = req.params.idBillProduct;
  const idShipper = req.body.idShipper;
  console.log(idShipper);
  console.log(idBillProduct);
  try {
    const billProduct = await mdbillProduct.billProductModel.findById(idBillProduct);

    if (!billProduct) {
      return res.status(404).json({ error: "Bill product not found" });
    }
    billProduct.idShipper = idShipper;
    await billProduct.save();

    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error); // Log the error to the console for debugging
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.detailAdmin = async (req, res) => {
  const idBillProduct = req.params.idBillProduct;
  const idShipper = req.params.idShipper;

  try {
    // Trước hết, bạn cần kiểm tra xem `idBillProduct` có tồn tại trong bảng `billProduct` hay không.
    const billProduct = await mdbillProduct.findById(idBillProduct);

    if (!billProduct) {
      return res.status(404).json({ error: "Bill product not found" });
    }

    // Sau đó, bạn có thể cập nhật trường `idShipper` của `billProduct`.
    billProduct.idShipper = idShipper;

    // Lưu trạng thái cập nhật vào cơ sở dữ liệu.
    await billProduct.save();

    return res.status(200).json({ message: "Shipper assigned to bill product" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.detailAdmin = async (req, res, next) => {

  let idAdmin = req.params.idAdmin;
  let objAd = await mdAdmin.AdminModel.findById(idAdmin);

  res.render('Admin/detailAdmin', { objAd: objAd });
}