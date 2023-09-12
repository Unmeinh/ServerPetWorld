let db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const string_word_secret = process.env.TOKEN_SEC_KEY;

let UserAccountSchema = new db.mongoose.Schema(
    {
        idUser: { type: db.mongoose.Schema.Types.ObjectId, required: true, index: { unique: true } },
        userName: { type: String, required: true, index: { unique: true } },
        passWord: { type: String, required: true },
        emailAddress: { type: String, required: false },
        isVerifyEmail: { type: Number, required: false },
        phoneNumber: { type: Number, required: true, index: { unique: true } },
        isVerifyPhoneNumber: { type: Number, required: false },
        status: { type: String, required: false },
        createAt: { type: Date, required: false },
        token: { type: String, required: true },
        online: { type: Number, required: false },
    },
    {
        collection: 'UserAccount'
    }
)

UserAccountSchema.methods.generateAuthToken = async function (account) {
    // console.log("account " + account);
    const token = jwt.sign({ _id: account._id, userName: account.userName }, string_word_secret);
    account.token = token;
    return token;
}

UserAccountSchema.statics.findByCredentials = async (userName, passWord) => {
    const account = await UserAccountModel.findOne({ userName });

    if (!account) {
        throw new Error('Tên đăng nhập không tồn tại!');
    }
    const isPasswordMatch = await bcrypt.compare(passWord, account.passWord)
    if (!isPasswordMatch) {
        throw new Error('Sai mật khẩu!');
    }
    return account;
}

let UserAccountModel = db.mongoose.model('UserAccountModel', UserAccountSchema);

module.exports = { UserAccountModel };
