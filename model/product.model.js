let db = require('./db');
let ProductSchema = new db.mongoose.Schema(
    {
        nameProduct:{type:String,required:true},
        createdAt:{type:Date,required:true}, 
        arrProduct:{type:Array,required:false},
        detailProduct:{type:String,required:true},
        priceProduct:{type:Number,required:true},
        amountProduct:{type:Number,required:true},
        quantitySold:{type:Number,required:true},
        ratings:{type:Array, require:false},
        discount:{type:Number,required:false},
        type:{type:Number, require:false},
        idShop:{type:db.mongoose.Schema.Types.ObjectId,required:false,ref:'ShopModel'},
        idCategoryPr:{type: db.mongoose.Schema.Types.ObjectId,required:true, ref:'CategoryProductModel'},
    },
    {
        collection:'Products'
    }
)
let ProductModel = db.mongoose.model('ProductModel',ProductSchema);
module.exports = {ProductModel};