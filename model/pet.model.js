const { ObjectId } = require('mongodb');
let db = require('./db');
let PetSchema = new db.mongoose.Schema(
    {
        namePet:{type:String,required:true},
        imagesPet:{type:Array,required:false},
        createdAt:{type:Date,required:false}, 
        speciesPet:{type:String,required:true},
        detailPet:{type:String,required:true},
        sizePet:{type:String,required:true},
        heightPet:{type:Number,required:true},
        weightPet:{type:Number,required:true},
        pricePet:{type:Number,required:true},
        amountPet:{type:Number,required:true},
        idShop:{type:ObjectId,required:false},
        id_categoryP:{type: db.mongoose.Schema.Types.ObjectId, ref:'CategoryPetModel'},

    },
    {
        collection:'Pets'
    }
)
let PetModel = db.mongoose.model('PetModel',PetSchema);


module.exports={PetModel};