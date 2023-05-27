const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    mobile:{
        type:String
    },
    image:{
        type:String
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model("user",userSchema);