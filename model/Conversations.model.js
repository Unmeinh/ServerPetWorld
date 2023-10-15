let db = require('./db');

let FollowSchema = new db.mongoose.Schema(
    {
        createdAt: { type: Date, required: true },
        messages: [
            {
                messageText: { type: String, required: true },
                idUser: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' }
            },
        ],
    },
    {
        collection: 'Conversations'
    }
)

let ConversationsModel = db.mongoose.model('ConversationsModel', FollowSchema);
module.exports = { ConversationsModel };
