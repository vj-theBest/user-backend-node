const mongoose = require('mongoose');
// Product schema and model
const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    category: {
        type:String,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    image: {
        type:String, //url to be substituded 
    },
  });
  const Product = mongoose.model('Product', productSchema);
  module.exports = Product;