let server = require("../model/server.modal");

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
