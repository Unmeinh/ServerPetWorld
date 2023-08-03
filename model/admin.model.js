let db = require('./db');
let AdminSchema = new db.mongoose.Schema(
    {
        nameAdmin:{type:String,required:true},
        usernameAdmin:{type:String,required:true,index:{unique:true}},
        emailAdmin:{type:String,required:true,index:{unique:true}},
        passwordAdmin:{type:String,required:true},
        avatarAdmin:{type:String,required:false},
        statusAdmin:{type:String,require:false},
    },
    {
        collection:'Admin'
    }
)
let AdminModel = db.mongoose.model('AdminModel',AdminSchema);

module.exports={AdminModel};