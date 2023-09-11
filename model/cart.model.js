let db = require('./db');

let CartSchema = new db.mongoose.Schema(
    {
        idUser: { type: db.mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
        carts: { type: Array, required: false }
    },
    {
        collection: 'Cart'
    }
)

let CartModel = db.mongoose.model('CartModel', CartSchema);
module.exports = { CartModel };