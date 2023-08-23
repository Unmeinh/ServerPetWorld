const { ObjectId } = require('mongodb');
let db = require('./db');
let ProductSchema = new db.mongoose.Schema(
    {
        nameProduct:{type:String,required:true},
        createdAt:{type:Date,required:false}, 
        arrProduct:{type:Array,required:false},
        detailProduct:{type:String,required:true},
        priceProduct:{type:Number,required:true},
        amountProduct:{type:Number,required:true},
        quantitySold:{type:Number,required:true},
        rate:{type:Number,required:false},
        discount:{type:Number,required:true},
        idShop:{type:ObjectId,required:false},
        id_categoryPr:{type: db.mongoose.Schema.Types.ObjectId, ref:'CategoryProductModel'},

    },
    {
        collection:'Products'
    }
)
let ProductModel = db.mongoose.model('ProductModel',ProductSchema);


module.exports={ProductModel};