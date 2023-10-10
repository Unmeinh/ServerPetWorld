let db = require('./db');
let AdminSchema = new db.mongoose.Schema(
    {
        fullName:{type:String,required:true},
        userName:{type:String,required:true,index:{unique:true}},
        email:{type:String,required:true,index:{unique:true}},
        passWord:{type:String,required:true},
        avatarAdmin:{type:String,required:false},
        status:{type:Number,require:false}
    },
    {
        collection:'Admin'
    }
)

let AdminModel = db.mongoose.model('AdminModel',AdminSchema);

module.exports={AdminModel};