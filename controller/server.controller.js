var serverModal = require("../model/server.modal");
const mdProduct = require("../model/product.model");
const mdPet = require("../model/pet.model");
// exports.insert = async (req, res) => {
//   try {
//     const newServer = new server.serverModal({
//       fee: 3,
//       payments: [
//         { nameMethod: "Thanh toán khi nhận hàng" },
//         { nameMethod: "Thanh toán bằng thẻ ngân hàng" },
//       ],
//       wallet: 0,
//       totalNumberOfOrdersSold: 0,
//       totalNumberOfOrders: 0,
//       totalOrderFailed: 0,
//       status: 1,
//       totalOrderWasSuccessful: 0,
//       totalRevenue: 0,
//       totalRrofit: 0,
//     });
//     await newServer.save();
//     res.json({ newServer });
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.getPaymentMethods = async (req, res) => {
  try {
    const payments = await serverModal.serverModal.findOne({});
    res.status(200).json({
      success: true,
      data: payments.payments,
      message: "Lấy phương thức thanh toán thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      message: "Lấy phương thức thanh toán thất bại",
    });
  }
};

exports.Listbanner = async (req, res, next) => {
  try {
    let listProduct = await mdProduct.ProductModel.find()
      .sort({
        quantitySold: -1,
      })
      .limit(1)
      .select("nameProduct arrProduct priceProduct quantitySold discount type")
      .populate("idShop", "nameShop locationShop avatarShop status");
    let listPet = await mdPet.PetModel.find()
      .sort({
        quantitySold: -1,
      })
      .limit(1)
      .select("namePet imagesPet pricePet quantitySold discount type")
      .populate("idShop", "nameShop locationShop avatarShop status");
    let discountProduct = await mdProduct.ProductModel.find()
      .sort({
        discount: -1,
      })
      .limit(1)
      .select("nameProduct arrProduct priceProduct quantitySold discount type")
      .populate("idShop", "nameShop locationShop avatarShop status");
    let discountPet = await mdPet.PetModel.find()
      .sort({
        discount: -1,
      })
      .limit(1)
      .select("namePet imagesPet pricePet quantitySold discount type")
      .populate("idShop", "nameShop locationShop avatarShop status");
    return res.status(200).json({
      success: true,
      data: [
        { distribute: "sold", data: listProduct[0] },
        { distribute: "sold", data: listPet[0] },
        { distribute: "discount", data: discountPet[0] },
        { distribute: "discount", data: discountProduct[0] },
      ],
      message: "Lấy danh sách thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: listProduct,
      message: "Lấy danh sách thành công",
    });
  }
};
