let db = require('./db');
let BlogSchema = new db.mongoose.Schema(
    {
        contentBlog:{type:String,required:true},
        contentFont:{type:String,required:false},
        imageBlogs:{type:Array,required:false},
        aspectRatio:{type:String,required:false},
        interacts:{type:Array,required:false},
        comments:{type:Number,require:false},
        shares:{type:Number,require:false},
        createdAt:{type:Date,require:true},
        idUser:{type:db.mongoose.Schema.Types.ObjectId,ref:'UserModel'}
    },
    {
        collection:'Blog'
    }
)

let BlogModel = db.mongoose.model('BlogModel',BlogSchema);
module.exports={BlogModel};