let db = require('./db');
let PetSchema = new db.mongoose.Schema(
    {
        namePet:{type:String,required:true},
        imagesPet:{type:Array,required:false}, 
        speciesPet:{type:String,required:false},
        detailPet:{type:String,required:true},
        sizePet:{type:String,required:true},
        heightPet:{type:Number,required:true},
        weightPet:{type:Number,required:true},
        pricePet:{type:Number,required:true},
        amountPet:{type:Number,required:true},
        idCategoryP:{type: db.mongoose.Schema.Types.ObjectId, ref:'CategoryPetModel'},
        idShop:{type: db.mongoose.Schema.Types.ObjectId, ref:'ShopModel'},
        createdAt:{type:Date,required:true},
        rate:{type:Number, require:false},
        discount:{type:Number, require:false},
        type:{type:Number, require:false},
        //  disCount:{type:db.mongoose.Schema.Types.ObjectId, ref:''}
    },
    {
        collection:'Pets'
    }
)
let PetModel = db.mongoose.model('PetModel',PetSchema);


module.exports={PetModel};