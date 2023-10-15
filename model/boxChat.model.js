let db = require('./db');

let boxChatSchema = new db.mongoose.Schema(
    {
        idConverstation: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'ConversationsModel' },
        idSender: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' },
        idReceivers: { type: db.mongoose.Schema.Types.ObjectId, required: true, ref: 'UserModel' },
       
    },
    {
        collection: 'BoxChat'
    }
)

let boxChatModel = db.mongoose.model('boxChatModel', boxChatSchema);
module.exports = { boxChatModel };
