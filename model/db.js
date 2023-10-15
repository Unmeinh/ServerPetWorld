const mongoose = require('mongoose');
mongoose.connect(process.env.KEY_MONGGO)
.then(()=>{
    console.log('[mongodb] Kết nối với CSDL PetWorld thành công');
})
.catch((err)=>{
    console.log(err.message);
    console.log('[mongodb] Lỗi kết nối CSDL!');
})
module.exports={mongoose};