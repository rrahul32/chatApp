/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { addOrUpdateChatSettings } from "../UserSettings/modules";
import Chat from "./";

export const createChat = (id, userId) => {
  return new Promise((resolve, reject) => { // eslint-disable-line no-undef
    const chatId = Chat.insert({
      participants: [
        {
          id: id,
          unReadCount: 0
        },
        {
          id: userId,
          unReadCount: 0
        }
      ],
    });
    if (chatId) {
      addOrUpdateChatSettings(id,chatId);
      addOrUpdateChatSettings(userId,chatId);
      resolve(chatId);
    } else {
      reject(false);
    }
  });
};
const getChatDetails= (chatId)=>{
  return new Promise((resolve,reject)=>{
    const chatDetails = Chat.findOne({_id: {$eq: chatId}});
    if(chatDetails){
      resolve(chatDetails)
    }
    else{
      reject(false);
    }
  });
}
export const incrementChatCount = (chatId, senderUserId) => {
  getChatDetails(chatId).then((thisChat) => {
    let otherParticipants = thisChat.participants.filter(eachParticipant => !(eachParticipant.id === senderUserId));
    otherParticipants.forEach(eachParticipant => {
      Chat.update({
        "_id": chatId,
        "participants.id": eachParticipant.id
      }, {
        $inc: {
          "participants.$.unReadCount": 1
        },
        $set: {
          "lastMessageAt": new Date()
        }
      });
    });
  });
};

export const resetUnreadChatCount = (chatId, userId) => {
  return Chat.update({
    "_id": chatId,
    "participants.id": userId
  }, {
    $set: {
      "participants.$.unReadCount": 0
    }
  });
};
