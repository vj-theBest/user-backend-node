require('dotenv').config();
const express=require('express');
const PORT=process.env.PORT || 5000;
const connectDB= require("./db.connection.js");
const cors = require("cors");

const productsRoutes =require("./routes/products.routes");
const userRoutes =require("./routes/users.routes.js");


console.log("lets start");
const app=express();


app.get("/",(req,res)=>{
    res.send("helllooooo")
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/products",productsRoutes);

//app.use(cors());
app.options('*', cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use("/api/user",userRoutes);
//calling connection to db and starting app server using listen fxn 
const start= async()=>{
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT,()=>{
           console.log( `${PORT} i am connected`);
        })
    } catch (error) {
        console.log(error);
    }
}
start();
