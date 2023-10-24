let db = require('./db');
let TestPaymentSchema = new db.mongoose.Schema(
    {
        SLSPDM:{type:Number,required:false},
        dateBuy:{type:Date,require:true},
        tongTien:{type:Number,required:false},
        PTTT:{type:String,required:false},
        status:{type:Number,required:false},
        idUser:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserModel'}
    },
    {
        collection:'TestPayment'
    }
)

let TestPaymentModel = db.mongoose.model('TestPaymentModel',TestPaymentSchema);
module.exports={TestPaymentModel};