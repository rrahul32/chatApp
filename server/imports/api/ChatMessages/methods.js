
"use strict";

import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';
const api = require('../../../api.json');
import rateLimit from "../../lib/rate-limit";
import { AppConstants } from "../../config";
import { createChatMessage } from "./modules";
import { createScheduledChatMessage, getScheduledMessages } from "./jobManager";
// console.log("api: ",api.openai.apiKey);

const errorMessages = AppConstants.errorMessages;
const configuration = new Configuration({
  apiKey: api.openai.apiKey,
});
const openai = new OpenAIApi(configuration);

const sendMessage = new ValidatedMethod({
  name: "sendMessage",
  validate: new SimpleSchema({
    "chatId": {
      type: String
    },
    "text": {
      type: String
    }
  }).validator(),
  run(chatData) {
    // console.log(chatData);
    const thisUser = Meteor.user();
    if (thisUser) {
      let user = thisUser;
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

const scheduleMessage = new ValidatedMethod({
  name: "scheduleMessage",
  validate: new SimpleSchema({
    id: {
      type: String,
      optional: true
    },
    "chatId": {
      type: String
    },
    "text": {
      type: String
    },
    "scheduledDate": {
      type: Date
    }
  }).validator(),
  run(chatData) {
    // console.log(chatData);
    const thisUser = Meteor.user();
    if (thisUser) {
      let user = thisUser;
      let id=null;
      if(chatData.id)
      id=chatData.id;
      return createScheduledChatMessage(chatData.chatId, user._id, chatData.text, chatData.scheduledDate, id);
    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  }
});getScheduledMessages

const getScheduleMessagesMethod = new ValidatedMethod({
  name: "getScheduleMessage",
  validate: new SimpleSchema({
    "chatId": {
      type: String
    }
  }).validator(),
  run(chatData) {
    // console.log(chatData);
    const thisUser = Meteor.user();
    if (thisUser) {
      let user = thisUser;
      return getScheduledMessages(chatData.chatId, user._id).then(items => {
        return items.map((item) => {
          return {
            id: item._id,
            message: item.data.message,
            scheduledDate: item.after
          };
        })
      }).catch((e) => {
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
      
      // const translation = completions.data.choices[0].message.content.replace(/^\n+|\n+$/g, "");
  
      // return translation;

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
        console.log('response: ', response.data);
        const translation = response.data[0][0][0];
        return translation;
      } catch (error) {
        console.error(error);
      }



    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  }
});

const emotionDetectionFromMessage = new ValidatedMethod({
  name: "emotionDetectionFromMessage",
  validate: new SimpleSchema({
    "messages": {
      type: Array
    },
    "messages.$": {
      type: String
    },
  }).validator(),
  async run(data) {
    // console.log(chatData);
    const thisUser = Meteor.user();
    if (thisUser) {
      const messages = data.messages;
      console.log('messages: ', messages);
      const promptHeader = `The following message was sent by a person. Identify the tone of the message. Classify the tone as happy, sad, angry, frustrated or neutral. Reply in a single word:\n`;
      let combinedMessages="";
      // messages.forEach((msg)=>{
      //   combinedMessages = combinedMessages+ `${msg} `;
      // })
      for(let i=messages.length-1;i>=0;i--)
      combinedMessages = combinedMessages+ `${messages[i]}. `;
      console.log(combinedMessages);
      const promptFooter="\nClassify the tone as happy, sad, angry, frustrated or neutral. Reply in a single word."
      const completions = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user", 
          content: promptHeader+combinedMessages,
      }],
      });
      const reply= completions.data.choices[0].message.content.trim().replace(/\s+/g, '').replace(/[^\w\s]/gi, '');
      console.log("reply: ",reply);
      
      return reply.toLowerCase();
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
    scheduleMessage,
    getScheduleMessagesMethod,
    translateMessage,
    emotionDetectionFromMessage
  ],
  limit: 100,
  timeRange: 1000
});
