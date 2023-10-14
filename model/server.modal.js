let db = require("./db");
let server = new db.mongoose.Schema(
  {
    payments: [
      {
        nameMethod: { type: String, required: true },
        type:{type:Number, required: true},
        createAt: { type: Date, required: true, default: new Date() },
      },
    ],
    fee: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      require: true,
    },
    wallet: { type: Number, required: true },
    createAt: { type: Date, required: true, default: new Date() },
    totalNumberOfOrdersSold: { type: Number, required: true },
    totalOrderWasSuccessful: { type: Number, required: true },
    totalOrderFailed: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    totalRrofit: { type: Number, required: true },
  },
  {
    collection: "server",
  }
);
let serverModal = db.mongoose.model("serverModal", server);

module.exports = { serverModal };
