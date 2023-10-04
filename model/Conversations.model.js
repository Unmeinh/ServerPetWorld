let db = require('./db');

let FollowSchema = new db.mongoose.Schema(
    {
        createdAt: { type: Date, required: true },
        idUser: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' },
        arr_receivers: [
            {
                idSender: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' }
            },
        ],
    },
    {
        collection: 'Conversations'
    }
)

let ConversationsModel = db.mongoose.model('ConversationsModel', FollowSchema);
module.exports = { ConversationsModel };
