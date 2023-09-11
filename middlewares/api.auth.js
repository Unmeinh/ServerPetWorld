const jwt = require('jsonwebtoken')
const mdUser = require('../model/user.model');

const string_word_secret = process.env.TOKEN_SEC_KEY;

const api_auth = async (req, res, next) => {
    let header_token = req.header('Authorization');
    console.log("header_token" + header_token);
    if (typeof (header_token) == 'undefined') {
        console.log('Không xác định token');
        return res.status(403).json({ success: false, message: 'Không xác định token' });
    }
    const token = header_token.replace('Bearer ', '');
    try {
        const data = jwt.verify(token, string_word_secret)
        console.log(data);
        const user = await mdUser.UserModel.findOne({ _id: data._id, token: token })
        if (!user) {
            //    throw new Error("Không xác định được người dùng")
            return res.status(401).json({ success: false, data: {}, message: 'Không xác định được người dùng!' });
        }
        user.online==0;
        req.user = user
        req.token = token
        next();
    } catch (error) {
        console.log(error);
        //    res.status(401).send({ error: error.message })
        return res.status(401).json({ success: false, data: {}, message: 'Lôi: ' + error.message });
    }


}
module.exports = { api_auth }