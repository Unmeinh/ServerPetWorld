const jwt = require('jsonwebtoken')
const mdUserAccount = require('../model/userAccount.model').UserAccountModel;
const mdUser = require('../model/user.model').UserModel;
const mdShop = require('../model/shop.model').ShopModel;

const string_word_secret = process.env.TOKEN_SEC_KEY;

const api_user_auth = async (req, res, next) => {
    let header_token = req.header('Authorization');
    if (typeof (header_token) == 'undefined') {
        console.log('Không xác định token');
        return res.status(403).json({ success: false, message: 'Không xác định token!' });
    }
    const token = header_token.replace('Bearer ', '');
    try {
        const data = jwt.verify(token, string_word_secret)
        let account = await mdUserAccount.findOne({ idUser: data._id, token: token });
        if (!account) {
            return res.status(401).json({ success: false, data: {}, message: 'Không xác định được tài khoản!' });
        }
        let user = await mdUser.findById(account.idUser).populate("idAccount");
        if (!user) {
            return res.status(401).json({ success: false, data: {}, message: 'Không xác định được người dùng!' });
        }
        req.user = user;
        req.account = account;
        req.token = token;
        next();
    } catch (error) {
        console.log(error);
        //    res.status(401).send({ error: error.message })
        return res.status(401).json({ success: false, data: {}, message: 'Lỗi: ' + error.message });
    }
}

const api_shop_auth = async (req, res, next) => {
    let header_token = req.header('Authorization');
    if (typeof (header_token) == 'undefined') {
        console.log('Không xác định token');
        return res.status(403).json({ success: false, message: 'Không xác định token!' });
    }
    const token = header_token.replace('Bearer ', '');
    try {
        const data = jwt.verify(token, string_word_secret)
        let shop = await mdShop.findOne({ _id: data._id, token: token });
        if (!shop) {
            return res.status(401).json({ success: false, data: {}, message: 'Không xác định được cửa hàng!' });
        }
        req.shop = shop;
        req.token = token;
        next();
    } catch (error) {
        console.log(error);
        //    res.status(401).send({ error: error.message })
        return res.status(401).json({ success: false, data: {}, message: 'Lỗi: ' + error.message });
    }
}
module.exports = { api_user_auth, api_shop_auth }
