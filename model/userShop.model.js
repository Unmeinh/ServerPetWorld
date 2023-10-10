let db = require('./db');
let UserShopSchema = new db.mongoose.Schema(
    {
        userName:{type:String,required:true,index:{
            unique:true
        }},
        passWord:{type:String,required:true},
        email:{type:String,required:false,index:{
            unique:true
        }},
        avatarUserShop:{type:String,required:false},
        status:{type:String,required:false},
        location:{type:String,required:false},
        createdAt:{type:Date,required:false}, 
        fullName:{type:String,required:true}, 
        arr_Shop:{type:Array,required:false},
    },
    {
        collection:'UserShop'
    }
)
let UserShopModel = db.mongoose.model('UserShopModel',UserShopSchema);
module.exports={UserShopModel};