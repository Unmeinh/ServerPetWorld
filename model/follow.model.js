let db = require('./db');

let FollowSchema = new db.mongoose.Schema(
    {
        idUser: { type: db.mongoose.Schema.Types.ObjectId,required:false, ref: 'ProductModel' },
        idFollower: { type: db.mongoose.Schema.Types.ObjectId,required:false, ref: 'ProductModel' }
    },
    {
        collection: 'Follow'
    }
)

let FollowModel = db.mongoose.model('FollowModel', FollowSchema);
module.exports = { FollowModel };