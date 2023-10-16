let mdbillProduct = require("../../model/billProduct.model");
let mdCart = require("../../model/cart.model");
let mdTransition = require("../../model/transaction.modal");
let mdServer = require("../../model/server.modal");
let mdNoti = require("../../model/notice.model");
let mdPet = require("../../model/pet.model");
let mdProduct = require("../../model/product.model");
exports.listbillProduct = async (req, res, next) => {
  try {
    // console.log("req: "+req.user);
    let listbillProduct = await mdbillProduct.billProductModel
      .find()
      .populate("products.idProduct");
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
// exports.billProductUser = async (req, res, next) => {
//   const { _id } = req.user;
//   const {
//     products,
//     location,
//     total,
//     paymentMethods,
//     discountBill,
//     type,
//     detailCard,
//     moneyShip,
//   } = req.body;
//   const { idProduct, amount, price, discount } = products ?? {
//     idProduct: "",
//     amount: "",
//     price: "",
//     discount: "",
//   };
//   try {
//     if (req.method == "POST") {
//       let newbillProduct = new mdbillProduct.billProductModel();
//       newbillProduct.idUser = _id;
//       newbillProduct.location = location;
//       newbillProduct.total = total;
//       newbillProduct.paymentMethods = paymentMethods;
//       newbillProduct.moneyShip = moneyShip;
//       newbillProduct.detailCard = paymentMethods == 1 ? detailCard : null;
//       newbillProduct.purchaseDate = new Date();
//       newbillProduct.deliveryStatus = 0;
//       newbillProduct.discountBill = discountBill;
//       if (type == 1) {
//         let listCartUser = await mdCart.CartModel.findOne({
//           idUser: _id,
//         }).populate("carts.idProduct");
//         let billProduct = [];
//         let newCartItems = [];
//         listCartUser.carts.map((item, index) => {
//           if (item.isSelected) {
//             const product = {
//               idProduct: item.idProduct._id,
//               amount: item.amount,
//               price: item.idProduct.priceProduct,
//               discount: item.idProduct.discount,
//             };
//             billProduct.push(product);
//           } else {
//             newCartItems.push(item);
//           }
//         });
//         listCartUser.carts = newCartItems;
//         await mdCart.CartModel.findByIdAndUpdate(
//           { _id: listCartUser._id },
//           listCartUser
//         );
//         newbillProduct.products = billProduct;
//       } else if (type == 0) {
//         const itembillProduct = {
//           idProduct,
//           amount,
//           price,
//           discount,
//         };
//         newbillProduct.products = [itembillProduct];
//       }
//       try {
//         const createNotice = new mdNoti.NoticeModel({
//           detail: `Bạn vừa đơn hàng trị giá ${total?.toLocaleString(
//             "vi-VN"
//           )}đ thành công`,
//           idUser: _id,
//           content: "Bạn vừa đặt đơn hàng thành công !",
//           status: 0,
//           createdAt: new Date(),
//         });
//         const server = await mdServer.serverModal.findOne({});
//         const createTransition = new mdTransition.TransactionModal({
//           fee: (newbillProduct.total / 100) * server.fee,
//           idBill: newbillProduct._id,
//           idCustommer: _id,
//           paymentMethod: paymentMethods,
//           status: newbillProduct.deliveryStatus,
//           total:
//             newbillProduct.total - (newbillProduct.total / 100) * server.fee,
//         });

//         const data = await newbillProduct.save();
//         data.products.map(async (item) => {
//           const pet = await mdPet.PetModel.findById(item?.idProduct);
//           const product = await mdProduct.ProductModel.findById(
//             item?.idProduct
//           );
//           if (pet) {
//             pet.quantitySold += item.amount;
//             pet.amountPet -= item.amount;
//             await pet.save();
//           }
//           if (product) {
//             product.quantitySold += item.amount;
//             product.amountProduct -= item.amount;
//             await product.save();
//           }
//         });
//         await createNotice.save();
//         server.totalNumberOfOrdersSold = server.totalNumberOfOrdersSold + 1;
//         await mdServer.serverModal.findByIdAndUpdate(
//           { _id: server._id },
//           server
//         );
//         await createTransition.save();
//         res.status(201).json({
//           success: true,
//           message: "Tạo hóa đơn thành công!",
//           data: data,
//         });
//       } catch (error) {
//         console.log(error);

//         if (error.message.match(new RegExp(".+`location` is require+."))) {
//           msg = "Địa chỉ đang trống!";
//         } else if (error.message.match(new RegExp(".+`total` is require+."))) {
//           msg = "Tổng tiền đang trống!";
//         }
//         if (
//           typeof newbillProduct.total != "number" ||
//           isNaN(newbillProduct.total) ||
//           newbillProduct.total <= 0
//         ) {
//           msg = "Tổng tiền phải nhập số dương!";
//         } else if (
//           error.message.match(new RegExp(".+`paymentMethods` is require+."))
//         ) {
//           msg = " phương thức thanh toán đang trống!";
//         } else if (
//           error.message.match(new RegExp(".+`deliveryStatus` is require+."))
//         ) {
//           msg = "Trạng thái giao hàng đang trống!";
//         } else if (
//           error.message.match(new RegExp(".+`discountBill` is require+."))
//         ) {
//           msg = "Tổng số lượng hóa đơn đang trống!";
//         } else if (
//           isNaN(newbillProduct.discountBill) ||
//           newbillProduct.discountBill <= 0
//         ) {
//           msg = "Tổng số lượng hóa đơn phải nhập số!";
//         } else if (
//           error.message.match(new RegExp(".+`idProduct` is require+."))
//         ) {
//           msg = "Id sản phẩm đang trống!";
//         } else if (error.message.match(new RegExp(".+`amount` is require+."))) {
//           msg = "Số lượng sản phẩm đang trống!";
//         } else if (isNaN(newbillProduct.amount) || newbillProduct.amount <= 0) {
//           msg = "Số lượng sản phẩm phải nhập số!";
//           return res
//             .status(500)
//             .json({ success: false, data: {}, message: msg });
//         } else if (
//           error.message.match(new RegExp(".+`discount` is require+."))
//         ) {
//           msg = "Tổng Số lượng sản phẩm đang trống!";
//         } else if (
//           isNaN(newbillProduct.discount) ||
//           newbillProduct.discount <= 0
//         ) {
//           msg = "Tổng Số lượng sản phẩm phải nhập số!";
//         } else {
//           msg = error.message;
//         }
//         return res.status(500).json({ success: false, message: error.message });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.detailBillProduct = async (req, res, next) => {
  let idBillPr = req.params.idBillPr;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBillPr);
    return res.status(200).json({
      success: true,
      data: ObjBillPr,
      message: "Lấy dữ liệu chi tiết hóa đơn thành công",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "Lỗi: " + error.message });
  }
};
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
};
exports.cancelBill = async (req, res) => {
  const idBill = req.params.id;
  const { _id } = req.user;
  try {
    const updatedBill = await mdbillProduct.billProductModel.findByIdAndUpdate(
      idBill,
      { $set: { deliveryStatus: -1 } }
    );
    if (!updatedBill) {
      res.status(500).json({
        success: false,
        message: "Lỗi không xác định vui lòng thử lại",
      });
    }
    const transition = await mdTransition.TransactionModal.findOneAndUpdate(
      { idBill: idBill },
      { $set: { status: -1 } }
    );
    if (!transition) {
      res.status(500).json({
        success: false,
        message: "Lỗi không xác định vui lòng thử lại",
      });
    }
    const createNotice = new mdNoti.NoticeModel({
      detail: `Bạn vừa hủy đơn hàng trị giá ${updatedBill?.total?.toLocaleString(
        "vi-VN"
      )}đ thành công ${
        updatedBill?.paymentMethods == 1
          ? "Số tiền sẽ của bạn sẽ được hoản trả trong 24h tới"
          : ""
      }`,
      idUser: _id,
      content: "Bạn vừa huỷ đơn hàng thành công !",
      status: 0,
      createdAt: new Date(),
    });
    const server = await mdServer.serverModal.findOne({});
    server.totalOrderFailed = server.totalOrderFailed + 1;
    await createNotice.save();
    await server.save();
    res.status(200).json({ success: true, message: "Hủy đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.billProductUser = async (req, res) => {
  const { _id } = req.user;
  const { products, location, paymentMethods, detailCard } = req.body;
  if (req.method === "POST") {
    try {
      products?.forEach(async (item) => {
        try {
          let newbillProduct = new mdbillProduct.billProductModel({
            idUser: _id,
            location: location ?? '',
            total: item?.total,
            deliveryStatus: 0,
            discountBill: item.discountBill,
            moneyShip: item?.moneyShip,
            products: item?.items,
            idShop: item?.idShop,
            paymentMethods: paymentMethods ?? 0,
            detailCard: paymentMethods == 1 ? detailCard : null,
            purchaseDate: new Date(),
          });
          const server = await mdServer.serverModal.findOne({});
          const createTransition = new mdTransition.TransactionModal({
            fee: (newbillProduct.total / 100) * server.fee,
            idBill: newbillProduct._id,
            idShop: newbillProduct.idShop,
            idCustommer: _id,
            paymentMethod: paymentMethods,
            status: newbillProduct.deliveryStatus,
            total:
              newbillProduct.total - (newbillProduct.total / 100) * server.fee,
          });
          await newbillProduct.save();
          await createTransition.save();
          server.totalNumberOfOrdersSold += 1;
          await mdServer.serverModal.findByIdAndUpdate(
            { _id: server._id },
            server
          );
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message,
            data: [],
          });
        }
      });
      res.status(201).json({
        success: true,
        message: "Tạo hóa đơn thành công!",
        data: [],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: [],
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "Tạo hóa đơn thất bại!",
      data: [],
    });
  }
};
