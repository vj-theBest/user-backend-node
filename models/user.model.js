const mongoose = require('mongoose');
// Product schema and model
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    phoneNumber: {
        type: Number,
        required:true,
      },
    isVerified: {
        type: Boolean,
        default: false,
      },
  });
  const User = mongoose.model('User', userSchema);
  module.exports = User;