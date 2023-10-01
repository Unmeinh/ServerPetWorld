let db = require('./db');
require('dotenv').config();

let UserSchema = new db.mongoose.Schema(
    {
        idAccount: { type: db.mongoose.Schema.Types.ObjectId, required: false, ref: 'UserAccountModel' },
        fullName: { type: String, required: false },
        birthday: { type: Date, required: false },
        locationUser: { type: String, required: false },
        locationDelivery: { type: Array, required: false },
        avatarUser: { type: String, required: false },
        description: { type: String, required: false },
        nickName: { type: String, required: false },
        blogs: { type: Number, required: false },
        followers: { type: Array, required: false },
        followings: { type: Array, required: false },
        myPet: { type: Array, required: false },
    },
    {
        collection: 'User'
    }
)

let UserModel = db.mongoose.model('UserModel', UserSchema);

module.exports = { UserModel };
