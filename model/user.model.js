let db = require('./db');
let UserSchema = new db.mongoose.Schema(
    {
        username:{type:String,required:true},
        passwordUser:{type:String,required:true},
        fullname:{type:String,required:false},
        emailUser:{type:String,required:false,index:{
            unique:true
        }},
        phoneNumber:{type:Number,required:true},
        birthdayUser:{type:Date,required:false},
        locationUser:{type:Array,required:false},
        avatarUser:{type:Array,required:false},
        description:{type:String,required:false},
        statusUser:{type:String,required:false},
        nicknameUser:{type:String,required:false},
        followers:{type:Array,required:false},
        following:{type:Array,required:false},
        createAt:{type:Date,required:false},
        myPet:{type:Array,required:false}
        
    },
    {
        collection:'User'
    }
)
let UserModel = db.mongoose.model('UserModel',UserSchema);

module.exports={UserModel};