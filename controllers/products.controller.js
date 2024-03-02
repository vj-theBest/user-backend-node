const Product=require("../models/products.model.js");
const multer=require("multer");
const csvtojson=require("csvtojson");

const getAllProducts=async (req,res)=>{
    const myData= await Product.find({});
    res.status(200).json({myData});
};
const getAllProductsTesting=async (req,res)=>{
    res.status(200).json({msg: "i am all products testing"});
};

const getProduct= async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);
          if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }
          res.json(product);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server Error' });
        }
      };
const addProduct = async (req, res) => {
        try {
          const { name, description, price, category } = req.body;
      
          if (!name || !description || !price || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
          }
      
          const data = { name, description, price, category };
          await Product.create(data);
      
          res.status(201).json({ message: 'Product added successfully' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server Error, unable to add product' });
        }
      };
      
const uploadAllProducts=async(req,res)=>{
    try {
        const jsonArray= await csvtojson().fromFile(req.file.path);
         await Product.insertMany(jsonArray)
         .then(res.json(201,"Added succeffuly"))
         .catch(function (err) {
            console.log(err);
            (res.status(500).json(err));
          });
            
        // res.json( 200,jsonArray,{ message: 'All products added Successfully!' });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error, unable to add bulk data' });
    }
}    
// const addProduct = async (req, res) => {
//     try {
      
//       const data = req.body;
//       console.log(req.data);
//       //{name,description,price,category}
//       await Product.create(data);
//       //await product.save();
//       res.status(201).json({message:"Product added Successfully"});
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server Error,unable to add product' });
//     }
//   };
module.exports={ getAllProducts , getAllProductsTesting, getProduct, addProduct, uploadAllProducts};