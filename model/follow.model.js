let db = require('./db');

let FollowSchema = new db.mongoose.Schema(
    {
        idUser: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' },
        arr_follower: [
            {
                idFollower: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' }
            },
        ],
        arr_following: [
            {
                idFollowing: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' }
            },
        ]
    },
    {
        collection: 'Follows'
    }
)

let FollowsModel = db.mongoose.model('FollowsModel', FollowSchema);
module.exports = { FollowsModel };