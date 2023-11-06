let db = require("./db");

let billProductSchema = new db.mongoose.Schema(
  {
    idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    idShop: { type: db.mongoose.Schema.Types.ObjectId, ref: "ShopModel" },
    locationDetail: {
      fullName: { type: String, required: true },
      phoneNumber: { type: Number, required: true },
      location: { type: String, required: true },
    },
    total: { type: Number, required: true },
    paymentMethods: { type: Number, required: true },
    purchaseDate: { type: Date, required: true },
    deliveryStatus: { type: Number, required: true },
    discountBill: { type: Number, required: true },
    moneyShip: { type: Number, required: true },
    detailCard: {
      nameCard: { type: String, required: false },
      numberCard: { type: Number, required: false },
      nameBank: { type: String, required: false },
    },
    products: [
      {
        _id: { type: db.mongoose.Schema.Types.ObjectId, select: false },
        idProduct: {
          type: db.mongoose.Schema.Types.ObjectId,
          required: true,
        },
        amount: { type: Number },
        price: { type: Number },
        discount: { type: Number },
      },
    ],
  },
  {
    collection: "billProducts",
  }
);

let billProductModel = db.mongoose.model("billProductModel", billProductSchema);
module.exports = { billProductModel };
