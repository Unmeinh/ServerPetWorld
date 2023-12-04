let db = require('./db');
let ReviewSchema = new db.mongoose.Schema(
    {
        idProduct: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
        idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
        contentReview: { type: String, require: false },
        imageReview: { type: Array, require: false },
        ratingNumber: { type: Number, require: true },
        createdAt: { type: Date, required: true }
    },
    {
        collection: 'Review'
    }
)
let ReviewModel = db.mongoose.model('ReviewModel', ReviewSchema);
module.exports = { ReviewModel };