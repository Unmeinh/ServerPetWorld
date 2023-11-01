let db = require('./db');
let NotificationSchema = new db.mongoose.Schema(
    {
        idNotice:{type:String,required:false},
        createdAt:{type:Date,require:true},
        content:{type:String,required:false},
        detail:{type:String,required:false},
        image:{type:Array,required:false},
        status:{type:Number,required:false},
        idUser:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserModel'}
    },
    {
        collection:'Notification'
    }
)

let NotificationModel = db.mongoose.model('NotificationModel',NotificationSchema);
module.exports={NotificationModel};