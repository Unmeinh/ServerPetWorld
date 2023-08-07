let db = require('./db');
let UserSchema = new db.mongoose.Schema(
    {
        usernameUser:{type:String,required:true},
        passwordUser:{type:String,required:true},
        fullname:{type:String,required:true},
        emailUser:{type:String,required:true,index:{
            unique:true
        }},
        // emailUser:{type:String,required:true},
        phoneNumber:{type:Number,required:true},
        birthdayUser:{type:Date,required:false},
        locationUser:{type:Array,required:false},
        avatarUser:{type:Array,required:false},
        description:{type:String,required:false},
        genderUser:{type:String,required:false},
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