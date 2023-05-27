const mongoose = require('mongoose')

module.exports = connectDB=async (URL)=>{
    mongoose.set('strictQuery',false)
    try {
        await mongoose.connect(URL)
        console.log(`DB Connected Successfully`);
    } catch (error) {
        console.log(error);
    }
}