let db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const string_word_secret = process.env.TOKEN_SEC_KEY
let UserSchema = new db.mongoose.Schema(
    {
        usernameUser:{type:String,required:true,index:{unique:true}},
        passwordUser:{type:String,required:true},
        fullname:{type:String,required:false},
        emailUser:{type:String,required:false},
        phoneNumber:{type:Number,required:true,index:{unique:true}},
        birthdayUser:{type:Date,required:false},
        locationUser:{type:Array,required:false},
        avatarUser:{type:String,required:false},
        description:{type:String,required:false},
        statusUser:{type:String,required:false},
        nicknameUser:{type:String,required:false},
        followers:{type:Array,required:false},
        following:{type:Array,required:false},
        createAt:{type:Date,required:false},
        myPet:{type:Array,required:false},
        token:{type:String,required:true}
    },
    {
        collection:'User'
    }
)

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    console.log("user "+user);
    const token = jwt.sign({ _id: user._id, userName: user.userName }, string_word_secret);
    user.token = token;
    await user.save();
    return token;
}

UserSchema.statics.findByCredentials = async(userName,passWord)=>{
    const user = await UserModel.findOne({userName});
    if(!user)
    {
        throw new Error({error:'Không tồn tại user này'})
    }
    const isPasswordMatch = await bcrypt.compare(passWord, user.passWord)
   if (!isPasswordMatch) {
       throw new Error({error: 'Sai password rồi'})
   }
   return user;

}


let UserModel = db.mongoose.model('UserModel',UserSchema);

module.exports={UserModel};
