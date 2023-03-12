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
import { createChat, resetUnreadChatCount } from "./modules";

const errorMessages = AppConstants.errorMessages;

const createChatMethod = new ValidatedMethod({
  name: "createChat",
  validate: new SimpleSchema({
    "userId": {
      type: String
    }
  }).validator(),
  run({userId}) {
    const thisUser = Meteor.user();
    if (thisUser) {
      return createChat(thisUser._id, userId);
    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  }
});

const resetUnreadChatMsgCount = new ValidatedMethod({
  name: "resetUnreadChatMsgCount",
  validate: new SimpleSchema({
    "chatId": {
      type: String
    },
    "userId": {
      type: String
    }
  }).validator(),
  run({chatId, userId}) {
    const thisUser = Meteor.user();
    if (thisUser) {
      return resetUnreadChatCount(chatId, userId);
    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  }
});

rateLimit({
  methods: [
    createChatMethod,
    resetUnreadChatMsgCount
  ],
  limit: 100,
  timeRange: 1000
});
