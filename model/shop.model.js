const { ObjectId } = require('mongodb');
let db = require('./db');
let ShopSchema = new db.mongoose.Schema(
    {
        nameShop:{type:String,required:true},
        emailShop:{type:String,required:true},
        idUserShop:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserShopModel'},
        locationShop:{type:String,required:true},
        avatarShop:{type:String,required:false},
        descriptionShop:{type:String,required:true}, 
        statusShop:{type:String,required:true}, 
        followers:{type:Array,required:false},
        hotlineShop:{type:Number,required:true},
        createdAt:{type:String,required:true},
        revenue:{type:Number,required:false}
    },
    {
        collection:'Shop'
    }
)
let ShopModel = db.mongoose.model('ShopModel',ShopSchema);

module.exports={ShopModel};