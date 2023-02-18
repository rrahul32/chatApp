import {Meteor} from "meteor/meteor";
import { Mongo } from 'meteor/mongo';
import {check} from  "meteor/check";
const otpData= new Mongo.Collection('otp_verfication');
export default function otpAuth(){
    return true;
} 