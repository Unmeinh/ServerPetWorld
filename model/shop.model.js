let db = require('./db');
let ShopSchema = new db.mongoose.Schema(
    {
        nameShop:{type:String,required:true},
        email:{type:String,required:true},
        idUserShop:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserShopModel'},
        locationShop:{type:String,required:true},
        avatarShop:{type:String,required:true},
        description:{type:String,required:true}, 
        status:{type:Number,required:true}, 
        followers:{type:Number,required:true},
        hotline:{type:Number,required:true},
        createdAt:{type:Date,required:true},
        revenue:{type:Number,required:true}
    },
    {
        collection:'Shop'
    }
)
let ShopModel = db.mongoose.model('ShopModel',ShopSchema);

module.exports={ShopModel};