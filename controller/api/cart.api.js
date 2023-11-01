let mdCart = require("../../model/cart.model");
let mdUser = require("../../model/user.model");
exports.cartUser = async (req, res, next) => {
  const { _id } = req.user;
  const { idProduct, amount } = req.body;
  try {
    let listCartUser = await mdCart.CartModel.findOne({ idUser: _id }).populate(
      "carts.idProduct",
      "idShop arrProduct discount type priceProduct nameProduct amountProduct"
    );
    if (req.method == "POST") {
      if (!listCartUser) {
        let newCart = new mdCart.CartModel();
        newCart.idUser = _id;
        listCartUser = await newCart.save();
      }
      let result = listCartUser.carts.some(
        (item) => item.idProduct._id.toString() === idProduct.toString()
      );
      if (result) {
        return res.status(201).json({
          success: false,
          data: [],
          message: "Sản phẩm đã có trong giỏ hàng",
        });
      }
      const itemCart = {
        idProduct,
        amount,
        createAt: new Date(),
        isSelected: true,
      };
      const cartBefore = [...listCartUser.carts, itemCart];
      listCartUser.carts = cartBefore;
      try {
        await mdCart.CartModel.findByIdAndUpdate(
          { _id: listCartUser._id },
          listCartUser
        );
        return res.status(200).json({
          success: true,
          data: listCartUser,
          message: "Thêm sản phẩm vào giỏ hàng thành công",
        });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    }

    if (listCartUser) {
      return res.status(200).json({
        success: true,
        data: listCartUser,
        message: "Lấy danh sách giỏ hàng của người dùng thành công",
      });
    } else {
      return res.status(203).json({
        success: false,
        data: [],
        message: "Không có dữ liệu giỏ hàng",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.editCart = async (req, res, next) => {
  const { _id } = req.user;
  const data = JSON.parse(req.body?.data);
  if (req.method == "POST") {
    try {
      let listCartUser = await mdCart.CartModel.findOne({ idUser: _id });
      let newCart = [];
      listCartUser.carts.map((itemOld) => {
        data.map((itemNew) => {
          if (itemNew.idProduct._id === itemOld.idProduct.toString()) {
            itemOld.isSelected = itemNew.isSelected;
            itemOld.amount = itemNew.amount;
            newCart.push(itemOld);
          }
        });
      });
      listCartUser.carts = newCart;
      await mdCart.CartModel.findByIdAndUpdate(
        { _id: listCartUser._id },
        listCartUser
      );
      return res.status(200).json({
        success: true,
        data: listCartUser,
        message: "Cật nhật giỏ hàng thành công",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
exports.checkProduct = async (req, res, next) => {
  const { _id } = req.user;
  const idProduct = req.params.id;
  // console.log(idProduct);
  try {
    let listCartUser = await mdCart.CartModel.findOne({ idUser: _id });
    let result = listCartUser.carts.some(
      (item) => item.idProduct.toString() === idProduct.toString()
    );
    return res.status(200).json({
      success: true,
      data: result,
      message: "Sản phẩm đã có trong giỏ hàng",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      message: err.message,
    });
  }
};
exports.updateLocaions = async (req, res) => {
  const { _id } = req.user;
  const body = req.body;
  res.json({ _id, body });
};
exports.addLocations = async (req, res) => {
  const { _id } = req.user;
  const { fullName, phoneNumber, location, isSelected } = req.body;
  try {
    if (fullName && phoneNumber && location && req.method === "POST") {
      const user = await mdUser.UserModel.findById(_id);
      if (user) {
        user.locationDelivery = [...user.locationDelivery, req.body];
        await mdUser.UserModel.findByIdAndUpdate({ _id }, user);
        res.status(201).json({
          success: true,
          data: user,
          message: "Thêm địa chỉ thành công",
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Lỗi 500:Không tìm thấy user" });
      }
    } else {
      res.status(500).json({ success: false, message: "Lỗi 500" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.editLocationSelect = async (req, res) => {
  const { _id } = req.user;
  const idLocation = req.params.id;
  try {
    if (req.method === "POST") {
      if (idLocation) {
        const user = await mdUser.UserModel.findById(_id);
        user.locationDelivery.map((item, index) => {
          return item._id.toString() === idLocation
            ? (item.isSelected = true)
            : (item.isSelected = false);
        });
        await mdUser.UserModel.findByIdAndUpdate({ _id }, user);
        res.status(201).json({
          success: true,
          data: user,
          message: "chỉnh sửa địa chỉ thành công",
        });
      }
    } else {
      res.status(500).json({ success: false, message: "Lỗi 500" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.editLocation = async (req, res) => {
  const { _id } = req.user;
  const { fullName, phoneNumber, location, idLocation } = JSON.parse(
    req.body.data
  );
  console.log(JSON.parse(req.body.data));
  try {
    if (
      fullName &&
      phoneNumber &&
      location &&
      idLocation &&
      req.method === "POST"
    ) {
      const user = await mdUser.UserModel.findById(_id);
      user.locationDelivery.map((item) => {
        if (item._id.toString() === idLocation) {
          (item.location = location), (item.fullName = fullName);
          item.phoneNumber = phoneNumber;
        }
      });
      await mdUser.UserModel.findByIdAndUpdate({ _id }, user);
      res.status(201).json({
        success: true,
        data: user,
        message: "chỉnh sửa địa chỉ thành công",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
