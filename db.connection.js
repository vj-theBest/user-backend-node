const mongoose = require('mongoose');
const connectDB=(uri)=>{
    console.log("Helllo from database");
    return mongoose.connect(uri);
};

module.exports = connectDB;