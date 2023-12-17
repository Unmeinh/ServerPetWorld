let mdbillProduct = require('../../model/billProduct.model');
let mdTransition = require('../../model/transaction.modal');
let mdServer = require('../../model/server.modal');
let mdNoti = require('../../model/notice.model');
let mdPet = require('../../model/pet.model');
let mdProduct = require('../../model/product.model');
let mdShop = require('../../model/shop.model');
let mdCart = require('../../model/cart.model');
const {sendFCMNotification} = require('../../function/notice');
exports.listbillProduct = async (req, res, next) => {
  const {_id} = req.user;
  const index = req.query?.idStatus;
  const review = req.query?.review;
  let params = {
    idUser: _id,
    deliveryStatus: Number(index),
  };
  if (typeof review !== 'undefined') {
    params.statusReview = review === 'false' ? false : true;
  }
  if (typeof index !== 'undefined') {
    try {
      let listbillProduct = await mdbillProduct.billProductModel.aggregate([
        {
          $unwind: '$products',
        },
        {
          $match: params,
        },
        {
          $lookup: {
            from: 'Shop',
            localField: 'idShop',
            foreignField: '_id',
            as: 'shopInfo',
          },
        },
        {
          $lookup: {
            from: 'Products',
            localField: 'products.idProduct',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        {
          $lookup: {
            from: 'Pets',
            localField: 'products.idProduct',
            foreignField: '_id',
            as: 'petInfo',
          },
        },
        {
          $addFields: {
            'productInfo.amount': '$products.amount',
            'productInfo.discount': '$products.discount',
            'productInfo.price': '$products.price',
            'petInfo.amount': '$products.amount',
            'petInfo.discount': '$products.discount',
            'petInfo.price': '$products.price',
          },
        },
        {
          $group: {
            _id: '$_id',
            idUser: {$first: '$idUser'},
            idShop: {$first: '$idShop'},
            locationDetail: {$first: '$locationDetail'},
            total: {$first: '$total'},
            statusReview: {$first: '$statusReview'},
            paymentMethods: {$first: '$paymentMethods'},
            purchaseDate: {$first: '$purchaseDate'},
            deliveryStatus: {$first: '$deliveryStatus'},
            discountBill: {$first: '$discountBill'},
            moneyShip: {$first: '$moneyShip'},
            productInfo: {$push: '$productInfo'},
            petInfo: {$first: '$petInfo'},
            shopInfo: {$first: '$shopInfo'},
          },
        },
        {
          $project: {
            idUser: 1,
            idShop: 1,
            locationDetail: 1,
            total: 1,
            paymentMethods: 1,
            purchaseDate: 1,
            deliveryStatus: 1,
            discountBill: 1,
            moneyShip: 1,
            products: 1,
            statusReview: 1,
            'productInfo.nameProduct': 1,
            'productInfo.arrProduct': 1,
            'productInfo._id': 1,
            'petInfo.namePet': 1,
            'petInfo.imagesPet': 1,
            'petInfo._id': 1,
            'productInfo.amount': 1,
            'productInfo.price': 1,
            'petInfo.amount': 1,
            'productInfo.discount': 1,
            'petInfo.discount': 1,
            'petInfo.price': 1,
            'shopInfo.nameShop': 1,
            'shopInfo.avatarShop': 1,
            'shopInfo._id': 1,
          },
        },
      ]);
      if (listbillProduct) {
        return res.status(200).json({
          success: true,
          data: listbillProduct,
          message: 'Lấy danh sách hóa đơn thành công',
        });
      } else {
        return res.status(203).json({
          success: false,
          data: [],
          message: 'Không có dữ hóa đơn',
        });
      }
    } catch (error) {
      return res.status(500).json({success: false, message: error.message});
    }
  } else {
    return res
      .status(500)
      .json({success: false, message: 'idStatus is require'});
  }
};

exports.detailBillProduct = async (req, res, next) => {
  let idBillPr = req.params.idBillPr;
  try {
    let ObjBillPr = await mdbillProduct.billProductModel.findById(idBillPr);
    return res.status(200).json({
      success: true,
      data: ObjBillPr,
      message: 'Lấy dữ liệu chi tiết hóa đơn thành công',
    });
  } catch (error) {
    return res
      .status(500)
      .json({success: false, data: {}, message: 'Lỗi: ' + error.message});
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
  const {_id, tokenDevice} = req.user;
  try {
    const updatedBill = await mdbillProduct.billProductModel.findByIdAndUpdate(
      idBill,
      {$set: {deliveryStatus: -1}},
    );
    if (!updatedBill) {
      res.status(500).json({
        success: false,
        message: 'Lỗi không xác định vui lòng thử lại',
      });
    }
    const transition = await mdTransition.TransactionModal.findOneAndUpdate(
      {idBill: idBill},
      {$set: {status: -1}},
    );
    if (!transition) {
      res.status(500).json({
        success: false,
        message: 'Lỗi không xác định vui lòng thử lại',
      });
    }

    const server = await mdServer.serverModal.findOne({});
    server.totalOrderFailed = server.totalOrderFailed + 1;
    await server.save();

    await sendFCMNotification(
      tokenDevice,
      'Bạn vừa huỷ đơn hàng thành công!',
      `Bạn vừa hủy đơn hàng trị giá ${(
        updatedBill?.total + updatedBill?.moneyShip
      ).toLocaleString('vi-VN')}đ thành công ${
        updatedBill?.paymentMethods !== 0
          ? 'Số tiền sẽ của bạn sẽ được hoản trả trong 24h tới'
          : ''
      }`,
      'CLIENT',
      null,
      _id,
    );
    res.status(200).json({success: true, message: 'Hủy đơn hàng thành công'});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: error.message});
  }
};

exports.billProductUser = async (req, res) => {
  const {_id, tokenDevice} = req.user;
  const {products, locationDetail, paymentMethod, detailCard} = req.body;
  let totalBill = 0;
  if (req.method === 'POST') {
    try {
      const productPromises = [];
      const errorMessages = [];
      await Promise.all(
        products?.map(async item => {
          const itemPromises = item.items?.map(async subItem => {
            const product = await mdProduct.ProductModel.findById(
              subItem.idProduct,
            );
            if (product) {
              if (product.amountProduct < subItem.amount) {
                errorMessages.push(
                  `${product.nameProduct} số lượng sản phẩm không đủ`,
                );
              }
              const discoutProduct =
                (product.priceProduct / 100) * product.discount;
              item.total =
                (item.total ?? 0) +
                (product.priceProduct - discoutProduct) * subItem?.amount;
              item.discount =
                (item.discount ?? 0) + discoutProduct * subItem?.amount;
              subItem.price = product.priceProduct;
              subItem.discount = product.discount;
            } else {
              const pet = await mdPet.PetModel.findById(subItem.idProduct);
              if (pet.amountPet < subItem.amount) {
                errorMessages.push(`${pet.namePet} số lượng không đủ`);
              }
              if (pet) {
                const discoutProduct = (pet.pricePet / 100) * pet.discount;
                item.total =
                  (item.total ?? 0) +
                  (pet.pricePet - discoutProduct) * subItem?.amount;
                item.discount =
                  (item.discount ?? 0) + discoutProduct * subItem?.amount;
                subItem.price = pet.pricePet;
                subItem.discount = pet.discount;
              }
            }
          });
          await Promise.all(itemPromises);

          productPromises.push(item);
        }),
      );
      if (errorMessages.length > 0) {
        return res.status(400).json({
          success: false,
          message: errorMessages.join(', '),
        });
      }
      await Promise.all(
        productPromises.map(async item => {
          const newbillProduct = new mdbillProduct.billProductModel({
            idUser: _id,
            locationDetail: locationDetail ?? '',
            total: item.total,
            deliveryStatus: 0,
            discountBill: item.discount,
            moneyShip: item.moneyShip,
            products: item.items,
            idShop: item.idShop,
            paymentMethods: paymentMethod ?? 0,
            detailCard: paymentMethod !== 0 ? detailCard : null,
            purchaseDate: new Date(),
          });
          totalBill += item.total + item.moneyShip;
          const server = await mdServer.serverModal.findOne({});
          const createTransition = new mdTransition.TransactionModal({
            fee: (newbillProduct.total / 100) * server.fee,
            idBill: newbillProduct._id,
            idShop: newbillProduct.idShop,
            idCustommer: _id,
            paymentMethod: paymentMethod ?? 0,
            status: newbillProduct.deliveryStatus,
            total:
              newbillProduct.total - (newbillProduct.total / 100) * server.fee,
          });
          server.totalNumberOfOrdersSold += 1;
          await Promise.all([
            await newbillProduct.save(),
            await createTransition.save(),
            await mdServer.serverModal.findByIdAndUpdate(
              {_id: server._id},
              server,
            ),
            newbillProduct.products.map(async item => {
              const product = await mdProduct.ProductModel.findById(
                item?.idProduct,
              );
              if (product) {
                product.quantitySold += item.amount;
                if (product.amountProduct > 0) {
                  product.amountProduct -= item.amount;
                }
                await product.save();
              }
            }),
          ]);
        }),
      );
      const cartUser = await mdCart.CartModel.findOne({idUser: _id});
      cartUser.carts = cartUser.carts.find(item => item.isSelected === false);
      await cartUser.save();

      await sendFCMNotification(
        tokenDevice,
        'Bạn vừa đặt đơn hàng thành công!',
        `Bạn vừa đặt đơn hàng trị giá ${totalBill.toLocaleString(
          'vi-VN',
        )}đ thành công`,
        'CLIENT',
        null,
        _id,
      );
      res.status(201).json({
        success: true,
        message: 'Tạo hóa đơn thành công!',
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
      message: 'Tạo hóa đơn thất bại!',
      data: [],
    });
  }
};

exports.getCountBill = async (req, res) => {
  const {_id} = req.user;
  const statusArray = [0, 1, 2, 3];
  try {
    const pipeline = [
      {
        $match: {
          idUser: _id,
          deliveryStatus: {$in: statusArray},
        },
      },
      {
        $group: {
          _id: '$deliveryStatus',
          count: {$sum: 1},
        },
      },
    ];

    const results = await mdbillProduct.billProductModel.aggregate(pipeline);

    const statusCountObject = {};

    results.forEach(result => {
      statusCountObject[result._id] = result.count;
    });
    return res.status(200).json({
      success: true,
      data: statusCountObject,
      message: 'Lấy danh sách hóa đơn thành công',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      data: [],
      message: 'Lấy danh sách hóa đơn thất bại',
    });
  }
};

exports.test = async (req, res) => {
  await mdbillProduct.billProductModel.updateMany(
    {},
    {$set: {statusReview: false}},
    {multi: true},
  );
  res.status(200).json({done: true});
};

exports.completedBill = async (req, res) => {
  const idBill = req.params.id;
  try {
    if (idBill) {
      await Promise.all([
        await mdbillProduct.billProductModel.findByIdAndUpdate(idBill, {
          deliveryStatus: 4,
        }),
        await mdTransition.TransactionModal.findOneAndUpdate(
          {idBill: idBill},
          {
            status: 4,
          },
        ),
      ]);
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Đã nhận đơn hàng thành công',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: [],
      message: 'Lỗi' + error.message,
    });
  }
};
