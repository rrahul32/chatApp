// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Links } from './links.js';
const otpCollection = new Mongo.Collection('otp');
Meteor.methods({
  'links.insert'(title, url) {
    check(url, String);
    check(title, String);

    return Links.insert({
      url,
      title,
      createdAt: new Date(),
    });
  },
  'phone.verify'(phone){
    // check(phone, String);
    const matchPhone=Match.Where(function(phone){
    const regExp= /^[6-9]{1}[0-9]{9}/;
    return phone.match(regExp);
    });
    check(phone,matchPhone);

  },
  'otp.send'(){
    const random = Math.floor(Math.random() * 9000 + 1000);
    console.log(random);
    return otpCollection.insert({"otp":random});


  },
  'otp.verify'(otp){
    const coll=otpCollection.findOne();
    console.log(coll.otp)
    if(coll.otp==otp)
    return true;
    else
    return false;
    // if(coll.otp!=otp)
    // return false;
  },
});
