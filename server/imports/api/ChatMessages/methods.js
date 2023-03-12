/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import rateLimit from "../../lib/rate-limit";
import { AppConstants } from "../../config";
import { createChatMessage } from "./modules";

const errorMessages = AppConstants.errorMessages;
const userTypes = AppConstants.userTypes;

const sendMessage = new ValidatedMethod({
  name: "sendMessage",
  validate: new SimpleSchema({
    "chatId": {
      type: String
    },
    "businessId": {
      type: String,
      optional: true
    },
    "text": {
      type: String
    }
  }).validator(),
  run(chatData) {
    const thisUser = Meteor.user();
    if (thisUser) {
      let user = thisUser;
      let userType = userTypes.user;
      if (chatData.businessId) {
        user = {
          _id: chatData.businessId
        };
        userType = userTypes.business;
      }
      return createChatMessage(chatData.chatId, user, userType, chatData).catch(() => {
        throw new Meteor.Error(errorMessages.forbidden);
      });
    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  }
});

rateLimit({
  methods: [
    sendMessage
  ],
  limit: 100,
  timeRange: 1000
});
