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
import Chat from "."; 
import { createChat, resetUnreadChatCount } from "./modules";
import ChatMessages from "../ChatMessages";

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
      const thisChat=Chat.findOne({
        participants: {
          $all: [
            { $elemMatch: { id: thisUser._id } },
            { $elemMatch: { id: userId } }
          ]
        }
      });
      if(thisChat && thisChat._id)
      return thisChat._id;
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

const deleteChat = new ValidatedMethod({
  name: "deleteChat",
  validate: new SimpleSchema({
    "chatId": {
      type: String
    }
  }).validator(),
  run({chatId}) {
    const thisUser = Meteor.user();
    if (thisUser) {
      const chat=Chat.findOne({_id: chatId});
      // console.log(chat.participants.some((participant)=>(participant.id===thisUser._id)));
      if(chat.participants.some((participant)=>(participant.id===thisUser._id)))
      {
        // console.log(ChatMessages.find({chatId}).fetch());
        ChatMessages.remove({chatId});
        Chat.remove({_id:chatId},{justOne:true});
      }
      else{
        throw new Meteor.Error(errorMessages.forbidden);
      }
      // if(chat.participants)
    } else {
      throw new Meteor.Error(errorMessages.forbidden);
    }
  }
});

rateLimit({
  methods: [
    createChatMethod,
    resetUnreadChatMsgCount,
    deleteChat
  ],
  limit: 100,
  timeRange: 1000
});
