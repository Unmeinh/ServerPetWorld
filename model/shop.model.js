let db = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const string_word_secret = process.env.TOKEN_SEC_KEY;

let ShopSchema = new db.mongoose.Schema(
  {
    nameShop: { type: String, required: true },
    email: { type: String, required: true },
    locationShop: { type: String, required: true },
    avatarShop: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: Number, required: true },
    followers: { type: Number, required: false },
    hotline: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    revenue: { type: Number, required: true },
    userName: { type: String, required: true, index: { unique: true } },
    passWord: { type: String, required: true },
    ownerIdentity: { type: String, required: true },
    token: { type: String, required: true },
    online: { type: Number, required: true },
  },
  {
    collection: "Shop",
  }
);

ShopSchema.methods.generateAuthToken = async function (shop) {
  const token = jwt.sign(
    { _id: shop._id, userName: shop.userName },
    string_word_secret
  );
  shop.token = token;
  return token;
};

ShopSchema.methods.encodeOwnerIdentity = async function (shop, identity) {
  const encode = jwt.sign(
    { _id: shop._id, ownerIdentity: identity },
    string_word_secret
  );
  shop.ownerIdentity = encode;
  return encode;
};

ShopSchema.statics.findByCredentials = async (userName, passWord) => {
  const shop = await ShopModel.findOne({ userName });

  if (!shop) {
    throw new Error("Tên đăng nhập không tồn tại!");
  }
  const isPasswordMatch = await bcrypt.compare(passWord, shop.passWord);
  if (!isPasswordMatch) {
    throw new Error("Sai mật khẩu!");
  }
  return shop;
};

let ShopModel = db.mongoose.model("ShopModel", ShopSchema);

module.exports = { ShopModel };
