// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC05c1be3fc6bea5262dc67620a5621d40";
const authToken = "a965fd9a60bc5af070ec2a734287e476";
const verifySid = "VAc47f6301b2b846657a9248c895570eec";
const client = require("twilio")(accountSid, authToken);

const phoneOTPVerification = async(phoneNumber)=>{
    try {
        client.verify.v2
        .services(verifySid)
        .verifications.create({ to: phoneNumber , channel: "sms" })
        //.then((verification) => console.log(verification.status))
        
    } catch (error) {
        
    } 
}
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+917888353011", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
