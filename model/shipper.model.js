let db = require('./db');
let ShipperSchema = new db.mongoose.Schema(
    {
      avatarShipper:{type:String,required:false},
        fullName: { type: String, required: true },
        userName: { type: String, required: true },
        passWord: { type: String, required: true },
        phoneNumber: { type: Number, required: true },
        email: { type: String, required: true }, 
        address: { type: String, required: true },
        address2: { type: String, required: true },
        createdAt: { type: Date, required: true },
        
        bills: [
            {
                idBill: {
                    type: db.mongoose.Schema.Types.ObjectId,
                    require: true,
                    ref: "billProductModel",
                  },
                  status: {
                    type: Number,
                    require: true,
                  },
                  discountBillFall: {
                    type: Number,
                    require: false,
                  },
            },
          ],
        },
    {
        collection: 'Shippers'
    }
)

let ShipperModel = db.mongoose.model('ShipperModel', ShipperSchema);
module.exports = { ShipperModel };
