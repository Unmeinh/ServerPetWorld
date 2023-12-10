let db = require("./db");
let FavoriteSchema = new db.mongoose.Schema(
  {
    idProduct: [
      { type: db.mongoose.Schema.Types.ObjectId, ref: "ProductModel" },
    ],
    idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  },
  {
    collection: "MyFavorite",
  }
);

let FavoriteModel = db.mongoose.model("FavoriteModel", FavoriteSchema);
module.exports = { FavoriteModel };
