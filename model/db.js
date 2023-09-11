const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://duymai2k3:10diemDATN@cluster0.pc8eymc.mongodb.net/PetWorldDB?retryWrites=true&w=majority')
.then(()=>{
    console.log('[mongodb] Kết nối với CSDL PetWorld thành công');
})
.catch((err)=>{
    console.log(err.message);
    console.log('Lỗi kết nối CSDL');
})
module.exports={mongoose};