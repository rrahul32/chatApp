/**
 * Copyright (c) 2017-present, PotluckHub. All rights reserved.
 *
 */

"use strict";

import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { addOrUpdateUserSettings } from "../../../api/UserSettings/modules";
import OTPsend from "../../../../twilio";

// import { sendOTP } from "../../../modules/sms";
// import { errorMessages } from "../../../config/strings.js";

const errorMessages = {
  forbidden: "forbidden",
  alreadyExist: "Already exist",
  nullUserMessage: "User should be signed in",
  itemPicked: "Item is already picked"
};

const codes = new Mongo.Collection("meteor_accounts_phone_verification");

class Phone {

  // Register our login handler
  registerLoginHandler() {

    Accounts.registerLoginHandler("phone", (options) => {
      console.log(options);
      if (!options.phone) {
        return false;
      }
      return this.verifyCode(options.phone.phone, options.phone.code, options.phone.country);
    });

    Meteor.methods({
      "sendVerificationCode": (phone, isAddPhoneNumber = false) => {
        // console.log(phone);
        const pattern = /^\+91[6-9]\d{9}$/;
        check(phone, String);
        if(pattern.test(phone)){
          console.log("Meteor.settings.dev", Meteor.settings.dev)
          this.sendVerificationCode(phone, isAddPhoneNumber, Meteor.settings.dev, Meteor.settings.appReview);
          return true;
        }
        else
        return false;
      }
    });

    Meteor.methods({
      "changePhoneNumber": (phone, code, country) => {
        check(phone, String);
        check(code, String);
        check(country, Object);
        return this.changePhoneNumber(phone, code, country);
      }
    });

    /* method used for verify newly add phone number to existing profile
    used in mobile versions above 2.2.0 */
    Meteor.methods({
      "verifyNewPhoneNumber": (phone, code, country) => {
        check(phone, String);
        check(code, String);
        check(country, Object);
        return this.verifyNewPhoneNumber(phone, code, country);
      }
    });
  }

  changePhoneNumber(phone, code, country) {
    const user = Meteor.user();
    if (user) {
      let validCode = codes.findOne({
        phone: phone,
        code: code
      });
      if (!validCode) {
        throw new Meteor.Error("INVALID_CODE", "Invalid verification code");
      } else if (validCode.user) {
        throw new Meteor.Error("USER_EXISTS", "User already exists");
      } else {
        Meteor.users.update({
          _id: user._id,
          phone: {
            $elemMatch: {
              number: user.profile.number
            }
          }
        },
          {
            $set: {
              "phone.$.verified": false
            }
          }
        );
        Meteor.users.update({
          _id: user._id,
          phone: {
            $elemMatch: {
              number: phone
            }
          }
        },
          {
            $set: {
              "phone.$.verified": true
            }
          });
        Meteor.users.update({
          _id: user._id
        },
          {
            $set: {
              "services.phone.number": phone,
              "profile.number": phone,
              "profile.country": country
            },
            $addToSet: {
              phone: {
                number: phone,
                verified: true
              }
            }
          }
        );
      }
    } else {
      throw new Meteor.Error("INVALID_USER", "Invalid user");
    }

  }

  verifyCode(phone, code, country) {
    let userId;
    let validCode = codes.findOne({
      phone: phone,
      code: code
    });
    if (!validCode) {
      throw new Meteor.Error("INVALID_CODE", "Invalid verification code");
    }

    if (validCode.user) {
      let user = Meteor.users.findOne({
        _id: validCode.user
      });
      if (!user) {
        throw new Meteor.Error("Invalid phone number");
      }
      userId = validCode.user;
    } else {
      userId = Meteor.users.insert({
        phone: [
          {
            number: phone,
            verified: true
          }
        ],
        profile: {
          number: phone,
          country: country
        },
        services: {
          phone: {
            number: phone
          }
        },
        createdAt: new Date()
      });
      addOrUpdateUserSettings(userId).catch((e)=>{
        console.log(e);
      })
    }

    codes.remove({
      phone: phone
    });
    return {
      userId: userId
    };
  }

  sendVerificationCode(phone, isAddPhoneNumber, isDev, appReview) {
    if (!phone) {
      throw new Meteor.Error("Invalid phone number");
    }

    let code = "" + Math.floor(100000 + Math.random() * 900000);

    if (isDev) {
      code = "000000";
    } else if (appReview && appReview.status && appReview.numbers && appReview.numbers.find(number => number === phone)) {
      code = "999999";
    }

    // Clear out existing codes
    codes.remove({
      phone: phone
    });
    let userId;
    const thisUser = Meteor.user();
    const user = Meteor.users.findOne({
      phone: {
        $elemMatch: {
          number: phone,
          verified: true
        }
      }
    });
    if (thisUser) {
      if (user) {
        throw new Meteor.Error("USER_EXISTS", "User already exists");
      }
      if (isAddPhoneNumber) {
        userId = thisUser._id;
      }
    } else {
      if (user) {
        userId = user._id;
      }
    }



    // if (!thisUser && user) {
    //   userId = user._id;
    // }else if (thisUser) {
    //   if (isAddPhoneNumber && user) {
    //     throw new Meteor.Error("USER_EXISTS", "User already exists");
    //   }
    //   userId = thisUser._id;
    // }
    // Generate a new code.
    codes.insert({
      phone: phone,
      user: userId,
      code: code,
      createdAt: new Date()
    });

    if (!isDev) {
      // sendOTP(phone, code);
      OTPsend(code, phone);
    }
  }


  verifyNewPhoneNumber(phone, code, country) {
    const thisUser = Meteor.user();
    if (thisUser) {
      let ret;
      let validCode = codes.findOne({
        phone: phone,
        user: thisUser._id,
        code: code
      });
      if (!validCode) {
        throw new Meteor.Error("INVALID_CODE", "Invalid verification code");
      } else {
        if (!thisUser.phone || !thisUser.phone.length) {
          Meteor.users.update({
            _id: thisUser._id
          }, {
            $set: {
              phone: []
            }
          });
        }
        ret = Meteor.users.update({
          _id: thisUser._id
        }, {
          $set: {
            "profile.number": phone,
            "profile.country": country,
            "services.phone": {
              number: phone
            }
          },
          $push: {
            phone: {
              number: phone,
              verified: true
            }
          }
        });
      }
      codes.remove({
        phone: phone
      });
      if (ret) {
        return {
          status: true,
          userId: thisUser._id
        };
      } else {
        throw new Meteor.Error(500, "Something went worng");
      }
    } else {
      throw new Meteor.Error(errorMessages.forbidden, errorMessages.nullUserMessage);
    }
  }
}

export default new Phone();
