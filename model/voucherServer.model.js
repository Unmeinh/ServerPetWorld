let db = require('./db');
let voucherServerSchema = new db.mongoose.Schema(
    {
        idAdmin:{type:db.mongoose.Schema.Types.ObjectId,ref:'AdminModel'},
        nameVoucher:{type:String,required:false},
        codeVoucher:{type:String,required:false},
        discount:{type:Number,required:false},
        moneyLimit:{type:Number,required:false},
        createdAt:{type:Date,require:true},
        expiedAt:{type:Date,require:true}
    },
    {
        collection:'VoucherServer'
    }
)

let VoucherServerModel = db.mongoose.model('VoucherServerModel',voucherServerSchema);
module.exports={VoucherServerModel};