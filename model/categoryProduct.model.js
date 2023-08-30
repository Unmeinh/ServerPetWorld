let db = require('./db');
let CategoryProductSchema = new db.mongoose.Schema(
    {
        nameCategory:{type:String,required:true},
        createdAt:{type:Date,required:true},
        nameIcon:{type:String,required:true}
    },
    {
        collection:'CategoryProduct'
    }
)
let CategoryProductModel = db.mongoose.model('CategoryProductModel',CategoryProductSchema);
module.exports={CategoryProductModel};