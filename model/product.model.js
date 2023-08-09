let db = require('./db');
let ProductSchema = new db.mongoose.Schema(
    {
        nameProduct:{type:String,required:true},
        avatarProduct:{type:String,required:false},
        createdAt:{type:Date,required:false}, 
        arr_Product:[{type:Array,required:false}],
    },
    {
        collection:'Product'
    }
)
let ProductModel = db.mongoose.model('ProductModel',ProductSchema);


module.exports={ProductModel};