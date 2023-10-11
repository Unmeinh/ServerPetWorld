let db = require('./db');
let AppointmentSchema = new db.mongoose.Schema(
    {
        idPet:{type:db.mongoose.Schema.Types.ObjectId,ref:'PetModel'},
        idUser:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserModel'},
        idShop:{type:db.mongoose.Schema.Types.ObjectId,ref:'ShopModel'},
        amountPet:{type:Number,required:false},
        location:{type:String,required:false},
        deposits:{type:Number,required:false},
        status:{type:Number,required:false},
        appointmentDate:{type:Date,require:true},
        createdAt:{type:Date,require:true}
    },  
    {
        collection:'Appointment'
    }
)

let AppointmentModel = db.mongoose.model('AppointmentModel',AppointmentSchema);
module.exports={AppointmentModel};