const multer=require('multer');
const express=require('express');
const router=express.Router();


const {registerUser , loginUser, verifyOtp,forgotPassword,verify_resetPassword,forgotPassword_changePassword}=require("../controllers/users.controllers");



router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").post(verifyOtp);
router.route("/forgotPassword").post(forgotPassword);
router.route("/forgotPassword/reset").post(verify_resetPassword);
//router.route("/forgotPassword/changePassword").post(forgotPassword_changePassword);
// router.route("/:id/verify/:token").get(verify);
//router.route("/send-otp").post(otpMailValidator,sendOtp);



module.exports = router;