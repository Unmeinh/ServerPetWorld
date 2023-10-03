let db = require('./db');
let voucherShopSchema = new db.mongoose.Schema(
    {
        idShop:{type:db.mongoose.Schema.Types.ObjectId,ref:'ShopModel'},
        nameVoucher:{type:String,required:false},
        codeVoucher:{type:String,required:false},
        discount:{type:Number,required:false},
        moneyLimit:{type:Number,required:false},
        createdAt:{type:Date,require:true},
        expiedAt:{type:Date,require:true}
    },
    {
        collection:'VoucherShop'
    }
)

let VoucherShopModel = db.mongoose.model('VoucherShopModel',voucherShopSchema);
module.exports={VoucherShopModel};