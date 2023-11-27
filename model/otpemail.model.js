let db = require('./db');
let OTPEmailSchema = new db.mongoose.Schema(
    {
        code: { type: Number, required: true },
        email: { type: String, required: true },
        typeUser: { type: Number, required: false, unique: false },
        createdAt: { type: Date, required: true },
    },
    {
        collection: 'OTPEmail'
    }
)

let OTPEmailModel = db.mongoose.model('OTPEmailModel', OTPEmailSchema);

module.exports = { OTPEmailModel };