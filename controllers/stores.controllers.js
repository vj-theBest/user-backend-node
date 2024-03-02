const Store=require("../models/stores.model.js");
// const app = require("./app.js");
const stores = async (req, res) => {
    try {
      const stores = await Store.find().populate('products');
      res.json(stores);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  module.exports={stores};