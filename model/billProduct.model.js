let db = require("./db");

let billProductSchema = new db.mongoose.Schema(
  {
    idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    location: { type: String, required: true },
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
        idProduct: {
          type: db.mongoose.Schema.Types.ObjectId,
          ref: "ProductModel",
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
