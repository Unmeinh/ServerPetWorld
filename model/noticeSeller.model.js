let db = require('./db');
let NoticeSellerSchema = new db.mongoose.Schema(
    {
        idShop:{type:db.mongoose.Schema.Types.ObjectId,ref:'ShopModel'},
        content:{type:String,required:false},
        detail:{type:String,required:false},
        image:{type:Array,required:false},
        status:{type:Number,required:false},
        createdAt:{type:Date,require:true}
    },
    {
        collection:'NoticeSeller'
    }
)

let NoticeSellerModel = db.mongoose.model('NoticeSellerModel',NoticeSellerSchema);
module.exports={NoticeSellerModel};