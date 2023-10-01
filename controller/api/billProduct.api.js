let mdbillProduct = require("../../model/billProduct.model");
let mdCart = require("../../model/cart.model");
exports.listbillProduct = async (req, res, next) => {
  try {
    // console.log("req: "+req.user);
    let listbillProduct = await mdbillProduct.billProductModel.find().populate('products.idProduct');
    if (listbillProduct) {
      return res.status(200).json({
        success: true,
        data: listbillProduct,
        message: "Lấy danh sách hóa đơn thành công",
      });
    } else {
      return res.status(203).json({
        success: false,
        data: [],
        message: "Không có dữ hóa đơn",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.billProductUser = async (req, res, next) => {
  console.log(req.body)
  const { _id } = req.user;
  const { products: { idProduct, amount, price, discount }, location, total, paymentMethods, deliveryStatus, discountBill, type } = req.body;
  if (req.method == "POST") {
    let newbillProduct = new mdbillProduct.billProductModel();
    newbillProduct.idUser = _id;
    newbillProduct.location = location;
    newbillProduct.total = total;
    newbillProduct.paymentMethods = paymentMethods;
    newbillProduct.purchaseDate = new Date();
    newbillProduct.deliveryStatus = deliveryStatus;
    newbillProduct.discountBill = discountBill;
    if (type == 1) {
      let listCartUser = await mdCart.CartModel.findOne({ idUser: _id }).populate("carts.idProduct");
      let billProduct = [];
      listCartUser.carts.map((item) => {
        if (item.isSelected) {
          const product = {
            idProduct: item.idProduct._id,
            amount: item.amount,
            price: item.idProduct.priceProduct,
            discount: item.idProduct.discount
          }
          billProduct.push(product);
        }
      })
      newbillProduct.products = billProduct;
    } else if (type == 0) {
      const itembillProduct = {
        idProduct,
        amount,
        price,
        discount
      };
      newbillProduct.products = [itembillProduct];
    }
    try {
      const data = await newbillProduct.save();
      res.status(201).json({ success: true, message: "tạo hóa đơn thành công!", data: data })
    } catch (error) {
      if (error.message.match(new RegExp('.+`location` is require+.'))) {
        msg = 'Địa chỉ đang trống!';
      }
      else if (error.message.match(new RegExp('.+`total` is require+.'))) {
        msg = 'Tổng tiền đang trống!';
      }
      if (typeof newbillProduct.total != 'number' || isNaN(newbillProduct.total) || newbillProduct.total <= 0) {
        msg = 'Tổng tiền phải nhập số dương!';
      }
      else if (error.message.match(new RegExp('.+`paymentMethods` is require+.'))) {
        msg = ' phương thức thanh toán đang trống!';
      }
      else if (error.message.match(new RegExp('.+`deliveryStatus` is require+.'))) {
        msg = 'Trạng thái giao hàng đang trống!';
      }
      else if (error.message.match(new RegExp('.+`discountBill` is require+.'))) {
        msg = 'Tổng số lượng hóa đơn đang trống!';
      }
      else if (isNaN(newbillProduct.discountBill) || newbillProduct.discountBill <= 0) {
        msg = 'Tổng số lượng hóa đơn phải nhập số!';
      }
      else if (error.message.match(new RegExp('.+`idProduct` is require+.'))) {
        msg = 'Id sản phẩm đang trống!';
      }
      else if (error.message.match(new RegExp('.+`amount` is require+.'))) {
        msg = 'Số lượng sản phẩm đang trống!';
      }
      else if (isNaN(newbillProduct.amount) || newbillProduct.amount <= 0) {
        msg = 'Số lượng sản phẩm phải nhập số!';
        return res.status(500).json({ success: false, data: {}, message: msg });
      }
      else if (error.message.match(new RegExp('.+`discount` is require+.'))) {
        msg = 'Tổng Số lượng sản phẩm đang trống!';
      }
      else if (isNaN(newbillProduct.discount) || newbillProduct.discount <= 0) {
        msg = 'Tổng Số lượng sản phẩm phải nhập số!';
      }
      else {
        msg = error.message;
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  };


  exports.detailBillProduct = async (req, res, next) => {

    let idBillPr = req.params.idBillPr;
    try {
        let ObjBillPr = await mdbillProduct.billProductModel.findById(idBillPr);
        return res.status(200).json({ success: true, data: ObjBillPr, message: "Lấy dữ liệu chi tiết hóa đơn thành công" });

    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}
  exports.editbillProduct = async (req, res, next) => {
    // const { _id } = req.user;
    // const { idProduct, action } = req.body;
    // if (req.method == "POST") {
    //   try {
    //     let listbillProductUser = await mdbillProduct.billProductModel.findOne({ idUser: _id }).populate('billProducts.idProduct');
    //     listbillProductUser.billProducts.map((item, index) => {
    //       if (item.idProduct == idProduct) {
    //         switch (action) {
    //           case "Increment":
    //             return (item.amount += 1);
    //           case "Decrement":
    //               if(item.amount > 1){
    //                   return (item.amount -= 1);
    //               }else{
    //                   listbillProductUser.billProducts.splice(index, 1);
    //               }
    //           default:
    //             return item;
    //         }
    //       }
    //     });
    //     await mdbillProduct.billProductModel.findByIdAndUpdate(
    //       { _id: listbillProductUser._id },
    //       listbillProductUser
    //     );
    //     return res.status(200).json({
    //       success: true,
    //       data: listbillProductUser,
    //       message: "Cật nhật giỏ hàng thành công",
    //     });
    //   } catch (error) {
    //     console.log(error.message);
    //     return res.status(500).json({ success: false, message: error.message });

    //   }
    // }
  }
