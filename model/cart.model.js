let db = require("./db");

let CartSchema = new db.mongoose.Schema(
  {
    idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    carts: [
      {
        idProduct: {
          type: db.mongoose.Schema.Types.ObjectId,
          ref: "ProductModel",
        },
        amount: { type: Number },
        createAt: { type: Date },
        isSelected: { type: Boolean },
      },
    ],
  },
  {
    collection: "Cart",
  }
);

let CartModel = db.mongoose.model("CartModel", CartSchema);
module.exports = { CartModel };
