let db = require('./db');

let FollowSchema = new db.mongoose.Schema(
    {
        idUser: { type: db.mongoose.Schema.Types.ObjectId, required: false, ref: 'ProductModel' },
        arr_follower: { type: Array, required: false },
        arr_following: { type: Array, required: false }
    },
    {
        collection: 'Follow'
    }
)

let FollowModel = db.mongoose.model('FollowModel', FollowSchema);
module.exports = { FollowModel };