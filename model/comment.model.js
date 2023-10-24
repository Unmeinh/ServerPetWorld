let db = require('./db');
let CommentSchema = new db.mongoose.Schema(
    {
        idBlog: { type: db.mongoose.Schema.Types.ObjectId, ref: 'BlogModel' },
        idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
        content: { type: String, required: true },
        createdAt: { type: Date, required: true },
        interacts: [
            {
                idBlog:{type: db.mongoose.Schema.Types.ObjectId, ref: 'BlogModel'},
                idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
                interact:{type:String,required:true}
            }
        ]
    },
    {
        collection: 'Comment'
    }
)

let CommentModel = db.mongoose.model('CommentModel', CommentSchema);
module.exports = { CommentModel };