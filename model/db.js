const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://duymai2k3:10diemDATN@cluster0.pc8eymc.mongodb.net/PetWorldDB?retryWrites=true&w=majority')
.catch((err)=>{
    console.log(err.message);
    console.log('Lỗi kết nối cơ CSDL');
})
module.exports={mongoose};