const mongoose = require('mongoose');
mongoose.connect(process.env.KEY_MONGGO)
.then(()=>{
    console.log('[mongodb] Connect to CSDL OurPet successfully!');
})
.catch((err)=>{
    console.log(err.message);
    console.log('[mongodb] Failed to connect CSDL!');
})
module.exports={mongoose};