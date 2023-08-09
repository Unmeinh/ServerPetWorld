let ShopSchema = new db.mongoose.Schema(
    {
        fullName:{type:String,required:true},
        email:{type:String,required:true},
        idUserShop:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserShopModel'},
        location:{type:String,required:true},
        avatarShop:{type:String,required:true},
        description:{type:String,required:true}, 
        status:{type:String,required:true}, 
        followers:{type:Array,required:false},
        hotlineShop:{type:Number,required:true},
        createdAt:{type:Date,required:true},
        revenue:{type:Number,required:false}
    },
    {
        collection:'Shop'
    }
)
let ShopModel = db.mongoose.model('ShopModel',ShopSchema);

module.exports={ShopModel};