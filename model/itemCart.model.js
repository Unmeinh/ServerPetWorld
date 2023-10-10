let db = require('./db');
require('./product.model');

let ItemCartSchema = new db.mongoose.Schema(
    {
        idProduct: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ProductModel' },
        idCart:{ type: db.mongoose.Schema.Types.ObjectId, ref: 'CartModel' },
        isSelect: { type: Boolean,required:false },
        amount: { type: Number, required: false },
        createdAt: { type: Date, required: false }
        
    },
    {
        collection: 'ItemCart'
    }
)

let ItemCartModel = db.mongoose.model('ItemCartModel', ItemCartSchema);
module.exports = { ItemCartModel };