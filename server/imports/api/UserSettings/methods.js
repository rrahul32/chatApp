"use strict";

import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { addOrUpdateUserSettings } from "./modules";
import rateLimit from "../../lib/rate-limit";
import SimpleSchema from "simpl-schema";
import { AppConstants } from "../../config";

const errorMessages = AppConstants.errorMessages;

const insertOrUpdateUserSettings = new ValidatedMethod({
  name: "insertOrUpdateUserSettings",
  validate: new SimpleSchema({
    id: {
      type: String,
    },
  }).validator(),
  run(data) {
    // console.log(data);
    const thisUser = Meteor.user();
    if (thisUser) {
      return addOrUpdateUserSettings(thisUser._id, {
        chatSettings: [data],
      }).catch((e) => {
        console.log(e);
        throw new Meteor.Error(errorMessages.forbidden);
      });
    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  },
});

rateLimit({
  methods: [insertOrUpdateUserSettings],
  limit: 100,
  timeRange: 1000,
});
