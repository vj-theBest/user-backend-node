const nodemailer = require('nodemailer');
require('dotenv').config();
module.exports =async(email,subject,text)=>{
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      auth: {
          user: process.env.USER,
          pass: process.env.PASS
      }
  });
    await transporter.sendMail({
      from:process.env.USER,
      to:email,
      subject:subject,
      text:text,
    });
    console.log("Email send Successfully");
  } 
  catch (error) {
    console.log("Email not send");
    console.log(error);
  }
}