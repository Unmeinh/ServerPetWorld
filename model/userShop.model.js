let db = require('./db');
let UserShopSchema = new db.mongoose.Schema(
    {
        usernameShopUS:{type:String,required:true},
        passwordShopUS:{type:String,required:true},
        emailShop:{type:String,required:false,index:{
            unique:true
        }},
        avatarShopUS:{type:Array,required:false},
        statusShopUS:{type:String,required:false},
        locationUS:{type:String,required:false},
        createdAt:{type:Date,required:false}, 
        arr_Shop:{type:Array,required:false},
        fullname:{type:String,required:true}, 
    },
    {
        collection:'UserShop'
    }
)
let UserShopModel = db.mongoose.model('UserShopModel',UserShopSchema);


module.exports={UserShopModel};