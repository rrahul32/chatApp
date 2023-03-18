/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';

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
      // const prompt = `Translate the following text to ${language}: ${text}`;
      // const completions = await openai.createChatCompletion({
      //   model: "gpt-3.5-turbo",
      //   messages: [{
      //     role: "user", 
      //     content: prompt,
      // }],
      // });
      // console.log(completions.data.choices[0].message.content);
  

      try {
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
          params: {
            client: 'gtx',
            sl: 'auto',
            tl: language.substring(0,2),
            dt: 't',
            q: text,
          },
        });
        const translation = response.data[0][0][0];
        return translation;
      } catch (error) {
        console.error(error);
      }


      // const translation = completions.data.choices[0].message.content.replace(/^\n+|\n+$/g, "");
  
      // return translation;

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
