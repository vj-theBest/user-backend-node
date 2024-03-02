const express=require('express');
const multer=require('multer');
const path=require('path');
const bodyParser=require('body-parser');
const router=express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({
    storage,
});
const {getAllProducts , getAllProductsTesting, getProduct, addProduct,uploadAllProducts}=require("../controllers/products.controller.js");

router.route("/").get(getAllProducts);
router.route("/testing").get(getAllProductsTesting);
router.route("'/products/:id'").get(getProduct);
router.route("/addProduct").post(addProduct);
router.route("/uploadAllProducts").post(upload.single("csvFile"),uploadAllProducts)
module.exports = router;