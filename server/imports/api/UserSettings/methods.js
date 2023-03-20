"use strict";

import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { addOrUpdateChatSettings } from "./modules";
import rateLimit from "../../lib/rate-limit";
import SimpleSchema from "simpl-schema";
import { AppConstants } from "../../config";
import {chatSettingsSchema} from './index'

const errorMessages = AppConstants.errorMessages;

const insertOrUpdateChatSettings = new ValidatedMethod({
  name: "insertOrUpdateChatSettings",
  validate: new SimpleSchema({
    settings: {
      type: chatSettingsSchema
    }
  }).validator(),
  run(data) {
    // console.log(data);
    const thisUser = Meteor.user();
    if (thisUser) {
     addOrUpdateChatSettings(thisUser._id, data.settings.id, data.settings)
    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  },
});

rateLimit({
  methods: [insertOrUpdateChatSettings],
  limit: 100,
  timeRange: 1000,
});
