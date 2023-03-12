// "use strict";

// import sms from "meteor/evolvier:sms";

// sms.config({
//   providers: ["AWS"]
// });

// export const sendOTP = (number, code, smsHash = "") => {
//   let message = "<#> Please use this OTP: " + code + "\nto continue on Neibo. \n\n" + smsHash;
//   sms.send("AWS", number, message).then(data => console.log(data)).catch(e => console.log(e));
// };

// export const sendSMS = (number, message) => {
//   sms.send("AWS", number, message).then(data => console.log(data)).catch(e => console.log(e));
// };
