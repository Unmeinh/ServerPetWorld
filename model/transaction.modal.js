let db = require("./db");
let Transaction = new db.mongoose.Schema(
  {
    idCustommer: {
      type: db.mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "UserModel",
    },
    idBill: {
      type: db.mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "billProductModel",
    },
    status: {
      type: Number,
      require: true,
    },
    total: { type: Number, required: true },
    fee: { type: Number, required: true },
    paymentMethod: { type: Number, require: true },
    createAt: { type: Date, required: true, default: new Date() },
    dateOfPayment: { type: Date, required: false },
  },
  {
    collection: "Transaction",
  }
);
let TransactionModal = db.mongoose.model("TransactionModal", Transaction);

module.exports = { TransactionModal };
