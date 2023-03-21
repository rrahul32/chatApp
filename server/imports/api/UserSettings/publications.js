import { Meteor } from "meteor/meteor";
import UserSettings from ".";
//
Meteor.publish(null, function() {
    const thisUser = Meteor.user();
    if (!thisUser) {
      return null;
    }
    else{
        return UserSettings.find({userId:thisUser._id})
    }
});