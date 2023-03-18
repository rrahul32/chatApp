/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { Configuration, OpenAIApi } from "openai";

import rateLimit from "../../lib/rate-limit";
import { AppConstants } from "../../config";
import { createChatMessage } from "./modules";

const errorMessages = AppConstants.errorMessages;
const userTypes = AppConstants.userTypes;
const configuration = new Configuration({
  apiKey: Meteor.settings.private.openai.apiKey,
});
const openai = new OpenAIApi(configuration);

const sendMessage = new ValidatedMethod({
  name: "sendMessage",
  validate: new SimpleSchema({
    "chatId": {
      type: String
    },
    // "businessId": {
    //   type: String,
    //   optional: true
    // },
    "text": {
      type: String
    }
  }).validator(),
  run(chatData) {
    // console.log(chatData);
    const thisUser = Meteor.user();
    if (thisUser) {
      let user = thisUser;
      // let userType = userT ypes.user;
      // if (chatData.businessId) {
        //   user = {
          //     _id: chatData.businessId
          //   };
          //   userType = userTypes.business;
          // }
          return createChatMessage(chatData.chatId, user._id, chatData.text).catch((e) => {
        console.log(e);
        // console.log();
        throw new Meteor.Error(errorMessages.forbidden);
      });
    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  }
});

const translateMessage = new ValidatedMethod({
  name: "translateMessage",
  validate: new SimpleSchema({
    "text": {
      type: String
    },
    "language": {
      type: String
    }
  }).validator(),
  async run(translateData) {
    // console.log(chatData);
    const thisUser = Meteor.user();
    if (thisUser) {
      const text = translateData.text;
      const language = translateData.language;
      const prompt = `Translate the following text to ${language}:\n\n ${text}`;
      const completions = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user", 
          content: `Translate the following text to ${language}:\n\n ${text}`
      }],
      });
      console.log(completions.data.choices[0].message.content);
  
      // const translation = completions.choices[0].text.trim();
      const translation = completions.data.choices[0].message.content;
  
      return translation;

    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  }
});

rateLimit({
  methods: [
    sendMessage,
    translateMessage
  ],
  limit: 100,
  timeRange: 1000
});
