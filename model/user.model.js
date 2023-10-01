let db = require('./db');
require('dotenv').config();

let UserSchema = new db.mongoose.Schema(
    {
        idAccount: { type: db.mongoose.Schema.Types.ObjectId, required: false, ref: 'UserAccountModel' },
        fullName: { type: String, required: false },
        birthday: { type: Date, required: false },
        locationUser: { type: String, required: false },
        locationDelivery: [
            {
                fullName: { type: String, required: false},
                location: { type: String, required: false},
                phoneNumber: { type: Number, required: false},
                isSelected: { type: Boolean, required: false}
            }
        ],
        avatarUser: { type: String, required: false },
        description: { type: String, required: false },
        nickName: { type: String, required: false },
        blogs: { type: Number, required: false },
        followers: [
            {
                idFollow: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' }
            },
        ],
        followings: [
            {
                idFollow: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' }
            },
        ],
        myPet: { type: Array, required: false },
    },
    {
        collection: 'User'
    }
)

let UserModel = db.mongoose.model('UserModel', UserSchema);

module.exports = { UserModel };
