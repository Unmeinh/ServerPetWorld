let db = require('./db');
let AdminSchema = new db.mongoose.Schema(
    {
        nameAdmin:{type:String,required:true},
        username:{type:String,required:true},
        passwordAdmin:{type:String,required:true},
        avatarAdmin:{type:String,required:false},
        statusAdmin:{type:String,require:true},
        email:{type:String,required:true,index:{
            unique:true
        }}
    },
    {
        collection:'Admin'
    }
)
let AdminModel = db.mongoose.model('AdminModel',AdminSchema);

module.exports={AdminModel};