let db = require('./db');
require('./product.model');

let ItemCartSchema = new db.mongoose.Schema(
    {
        idProduct:{type:db.mongoose.Schema.Types.ObjectId,ref:'ProductModel'},
        idUser:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserModel'},
        amount:{type:Number,required:true},
        createdAt:{type:Date,required:true}
    },
    {
        collection:'ItemCart'
    }
)

let ItemCartModel = db.mongoose.model('ItemCartModel',ItemCartSchema);
module.exports={ItemCartModel};