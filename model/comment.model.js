let db = require('./db');
let CommentSchema = new db.mongoose.Schema(
    {
        idBlog: { type: db.mongoose.Schema.Types.ObjectId, ref: 'BlogModel' },
        idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
        content: { type: String, required: true },
        createdAt: { type: Date, required: true },
        interacts: { type: Array, required:false}
    },
    {
        collection: 'Comment'
    }
)

let CommentModel = db.mongoose.model('CommentModel', CommentSchema);
module.exports = { CommentModel };