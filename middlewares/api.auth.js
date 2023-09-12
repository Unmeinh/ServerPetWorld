const jwt = require('jsonwebtoken')
const mdUserAccount = require('../model/userAccount.model').UserAccountModel;
const mdUser = require('../model/user.model').UserModel;

const string_word_secret = process.env.TOKEN_SEC_KEY;

const api_auth = async (req, res, next) => {
    let header_token = req.header('Authorization');
    console.log("header_token" + header_token);
    if (typeof (header_token) == 'undefined') {
        console.log('Không xác định token');
        return res.status(403).json({ success: false, message: 'Không xác định token!' });
    }
    const token = header_token.replace('Bearer ', '');
    try {
        const data = jwt.verify(token, string_word_secret)
        console.log(data);
        let account = await mdUserAccount.findOne({ idUser: data._id, token: token })
        if (!account) {
            return res.status(401).json({ success: false, data: {}, message: 'Không xác định được người dùng!' });
        }
        let user = await mdUser.findById(account.idUser);
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
        return res.status(401).json({ success: false, data: {}, message: 'Lôi: ' + error.message });
    }


}
module.exports = { api_auth }