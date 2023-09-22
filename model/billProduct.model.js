let db = require("./db");

let billProductSchema = new db.mongoose.Schema(
  {
    idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    location: { type: String, required: false },
    total: { type: Number, required: false },
    paymentMethods: { type:Number, required: false },
    purchaseDate: { type: Date, required: false },
    deliveryStatus: { type: Number, required: false },
    discountBill: { type: Number, required: false },

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