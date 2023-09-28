let db = require('./db');
let NoticeSchema = new db.mongoose.Schema(
    {
        idUser:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserModel'},
        content:{type:String,required:false},
        detail:{type:String,required:false},
        image:{type:Array,required:false},
        status:{type:Number,required:false},
        createdAt:{type:Date,require:true}
    },
    {
        collection:'Notice'
    }
)

let NoticeModel = db.mongoose.model('NoticeModel',NoticeSchema);
module.exports={NoticeModel};