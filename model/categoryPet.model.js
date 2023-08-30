let db = require('./db');
let CategoryPetSchema = new db.mongoose.Schema(
    {
        nameCategory:{type:String,required:true},
        createdAt:{type:Date,required:true},
        nameIcon:{type:String,required:true},
    },
    {
        collection:'CategoryPet'
    }
)
let CategoryPetModel = db.mongoose.model('CategoryPetModel',CategoryPetSchema);
module.exports={CategoryPetModel};