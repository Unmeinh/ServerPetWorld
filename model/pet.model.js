let db = require('./db');
let PetSchema = new db.mongoose.Schema(
    {
        namePet:{type:String,required:true},
        imagesPet:{type:Array,required:false}, 
        detailPet:{type:String,required:true},
        sizePet:{type:Number,required:true},
        heightPet:{type:Number,required:true},
        weightPet:{type:Number,required:true},
        pricePet:{type:Number,required:true},
        amountPet:{type:Number,required:true},
        quantitySold:{type:Number,required:true},
        idCategoryP:{type: db.mongoose.Schema.Types.ObjectId, ref:'CategoryPetModel'},
        idShop:{type: db.mongoose.Schema.Types.ObjectId, ref:'ShopModel'},
        createdAt:{type:Date,required:true},
        rate:{type:Number, require:false},
        ratings:{type:Array, require:false},
        discount:{type:Number, require:false},
        type:{type:Number, require:false},
        status:{type:Number, require:true},
    },
    {
        collection:'Pets'
    }
)
let PetModel = db.mongoose.model('PetModel',PetSchema);


module.exports={PetModel};