const mongoose = require('mongoose');
// Store schema and model
const storeSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    location: {
        type:String,
        required:true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  });
  const Store = mongoose.model('Store', storeSchema);