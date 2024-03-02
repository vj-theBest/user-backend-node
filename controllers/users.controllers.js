const generateOTP=require("../otpGenerator.js")
const User=require("../models/user.model.js");
const bcrypt = require('bcrypt');
const nodemailer = require("../nodemailer.js")
const Token=require("../models/token.js")
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const verifySid = process.env.VERIFY_SID;
const client = require("twilio")(accountSid, authToken);

//NEW USER REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if(name==""||email==""||password==""|| phoneNumber==null){
        return res.json({
            status: "FAILED",
            message: "Empty input fields, ALL fields are required"   
        })
    }
    //CHECKING IF USER ALREADY EXIST
    const existingUser = await User.findOne({ email });
    const existingPhone = await User.findOne({phoneNumber});
    if (existingUser || existingPhone) {
       return res.status(400).json({ message: 'User already exists' });
    }
    else if (!validateEmail(email)) {
      return res.json({
          status: "FAILED",   
          message: "Invalid email address"
      })
  }
  else if (!checkPhoneNumber(phoneNumber)) {
    return res.json({
        status: "FAILED",   
        message: "Invalid Phone Number"
    })
}
  else if (!checkPasswordStrength(password)) {
      return res.json({
          status: "FAILED",
          message: "Password should have at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character"
      })
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      isVerified:false,
    });

    await newUser.save();
    // const token = await new Token({
    //   userId:newUser._id,
    //   token:crypto.randomBytes(32).toString("hex")
    // }).save();
    const otp=generateOTP();
    const newtoken = new Token({
      userId:newUser._id,
      token:otp
    });
    await newtoken.save();

    await nodemailer(newUser.email, "Verify Email via OTP",otp);
    return res.status(201).json({ message: 'User registered successfully,Email send to your account, Kindly verify it' });
  } catch (error) { 
    console.error(`Error registering user: ${error.message}`);
    return res.status(500).json({ message: 'Unable to add user,Internal server error' });
     
  }
};
function validateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    return (true) 
  }
  return false;   
}

function checkPasswordStrength(password) {   
if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) 
{ 
  console.log("true")
  return true;
}
else
{ 
  console.log("false") 
  return false;
}
}
function checkPhoneNumber(phoneNumber) {
  //Checking for indian phone numbers
  if (/^(?:(?:|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phoneNumber))
  {
    return (true) 
  }
  return false; 
}
function processPhoneNumber(phoneNumber) {
  if (phoneNumber.length === 10 || phoneNumber.length === 11) {
    if (phoneNumber.length === 10) {
      phoneNumber = "+91" + phoneNumber;
    } else {
      phoneNumber = "+91" + phoneNumber.slice(1);
    }
  } else if (phoneNumber.length === 12) {
    phoneNumber = "+" + phoneNumber;
  } else {
    return "Invalid phone number. Please provide a 10, 11 or 12 digit phone number.";
  }
  return phoneNumber;
}
//USER LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
     if (!validateEmail(email)) {
      return res.json({
          status: "FAILED",   
          message: "Invalid email address"
      })
  } 
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    if(!user.isVerified ){
      const tokenFilter=user._id;
      const existingToken = await Token.findOne(tokenFilter);
      if(!existingToken){
        const otp=generateOTP();
        const newtoken = await new Token({
         userId:user._id,
         token:otp
       });
       await newtoken.save();
       await nodemailer(user.email, "Verify Email via OTP",otp);
      }
     
      return res.status(400).json({ message: 'Email send to your mail, kindly verify' });
    }
    // Generate JWT
    //const token = jwt.sign({ userId: user._id }, 'secretKey');
   
   // return res.json({ token });
    return res.json({ message:"User Verified , User login successful" });
  } catch (error) {
    console.error(`Error logging in user: ${error.message}`);
    res.status(500).json({ message: 'User not verified error,Error login user' });
  }
};
//User email verification
const verifyOtp = async(req,res)=>{
    try { 
       const {email,otp}=req.body;
       const user = await User.findOne({email});
       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }
       //if already exist
       if(user.isVerified==true){
        return res.status(404).json({ message: 'User Already verified' });
       };
       //Validate OTP
       const token = await Token.findOne({
            userId: user._id,
          });
          console.log(token);
          if(!token){
            return res.status(400).json({ message: 'Invalid otp, token not found at server' });
          }   
         
        if (otp !== token.token) {
        console.log(token.token);
        return res.status(400).json({ message: 'Invalid OTP, otp mismatch' });
    }

    // Update user as verified
      user.isVerified = true;
      await user.save();
      const filter={ _id:user._id };
      await User.findOneAndUpdate(filter,{isVerified:true});
      await token.deleteOne(filter);
      //res.status(200).json({ message: 'Email Verified successfully' });
      return res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        return res.status(400).json({msg:error.message});
    }
};

const forgotPassword = async(req,res)=>{
  try {
    var {phoneNumber} =req.body;
    console.log("checking phone number input");
    const existingPhone = await User.findOne({phoneNumber});
    console.log("checking exsting phone number");
    if(!existingPhone){
      console.log("user not found")
      return res.json({ message: 'User not Found, Kindly Register or check Phone Number' });
    }
    else if(existingPhone.isVerified==false){
      console.log("user not verified")
      const tokenFilter=existingPhone._id;
      const existingToken = await Token.findOne(tokenFilter);
      if(!existingToken){
        const otp=generateOTP();
        const newtoken = await new Token({
         userId:existingPhone._id,
         token:otp
       });
       await newtoken.save();
       //const url = `$(process.env.BASE_URL)users/$(newUser._id)/verify/$(token.token)`;
       await nodemailer(existingPhone.email, "Verify Email via OTP",otp);
      }
      return res.json({ message: 'User not verified, Kindly verify user via email' });
    }
    else{
      console.log("phone number exist");
      //const phoneOTPVerification = async(phoneNumber)=>{
        try {
         phoneNumber = processPhoneNumber(phoneNumber);
          console.log(phoneNumber);
          await client.verify.v2
            .services(verifySid)
            .verifications.create({ 
              //body:`Your Otp verification for user ${User.name} is ${otp}`,
              to: phoneNumber , 
              channel: "sms" })
            .then((verification) => console.log(verification.status));
            return res.status(200).json({message:"OTP Message send to the Phone Number"})
        } catch (error) {
           return res.status(500).json({error : error.message });
        } 
    }
    }
   catch (error) {
   return res.status(500).json({message: error.message})
  }
};
const verify_resetPassword =async(req,res)=>{
  try {
    const{phoneNumber,otp,newPassword} =req.body;
    const existingPhone = await User.findOne({phoneNumber});
    if(!existingPhone){
      return res.json({ message: 'User not Found, Kindly Register or check Phone Number' });
    }
    if (!checkPasswordStrength(newPassword)) {
      return res.json({
          status: "FAILED",
          message: "Password should have at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character"
      })
    }
    var gphoneNumber= processPhoneNumber(phoneNumber);
    console.log(gphoneNumber);
    let status;
    await client.verify.v2.services(verifySid)
      .verificationChecks
      .create({to: gphoneNumber, code: otp })
      .then(verification_check => {
        console.log(verification_check.status);
        status = verification_check.status;
      })
      //verification_check => status =verification_check.status;
      //.then(()=>res.status(201).json({message: "user verified"}));
      console.log("verification hitt");
      console.log(status);
      if(status=='approved'){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log("hashed password created");
        await User.findByIdAndUpdate({_id:existingPhone._id},{$set:{password:hashedPassword}},{new:true});
        console.log("password change succesfull");
        return res.status(201).json({ message: 'User Password changed successful!' });
      }
      else{
        return res.json({ message: 'Invalid OTP' });
      }
  } catch (error) {
    return res.status(500).json({message:error})
  }
};

  module.exports={ registerUser, loginUser, verifyOtp, forgotPassword ,verify_resetPassword,};