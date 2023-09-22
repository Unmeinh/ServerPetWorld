let mdCart = require("../../model/cart.model");
exports.listCart = async (req, res, next) => {
  try {
    // console.log("req: "+req.user);
    let listCart = await mdCart.CartModel.find().populate('carts.idProduct');
    if (listCart) {
      return res.status(200).json({
        success: true,
        data: listCart,
        message: "Lấy danh sách giỏ hàng thành công",
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
exports.cartUser = async (req, res, next) => {
  const { _id } = req.user;
  const { idProduct, amount } = req.body;
  try {
    let listCartUser = await mdCart.CartModel.findOne({ idUser: _id }).populate('carts.idProduct');
    if (req.method == "POST") {
      if (!listCartUser) {
        let newCart = new mdCart.CartModel();
        newCart.idUser = _id;
        listCartUser = await newCart.save();
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
  const { idProduct, action } = req.body;
  if (req.method == "POST") {
    try {
      let listCartUser = await mdCart.CartModel.findOne({ idUser: _id }).populate('carts.idProduct');
      listCartUser.carts.map((item, index) => {
        if (item.idProduct == idProduct) {
          switch (action) {
            case "Increment":
              return (item.amount += 1);
            case "Decrement":
              if (item.amount > 1) {
                return (item.amount -= 1);
              } else {
                listCartUser.carts.splice(index, 1);
              }
            default:
              return item;
          }
        }
      });
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
