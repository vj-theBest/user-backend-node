const mongoose= require('mongoose');
const tokenSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true,
    },
    token:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:180 // 3 min
    }
});
const token = mongoose.model('token', tokenSchema);
module.exports = token;