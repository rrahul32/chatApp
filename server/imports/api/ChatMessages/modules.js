/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import ChatMessages from "./";
import { incrementChatCount } from "../Chat/modules";

export const createChatMessage = (chatId, userId, message) => {
  return new Promise((resolve, reject) => { // eslint-disable-line no-undef
    const chatMessageId = ChatMessages.insert({
      chatId,
      text: message,
      createdBy: { 
        id: userId
      }
    });
    if (chatMessageId) {
      incrementChatCount(chatId, userId);
      resolve(chatMessageId);
    } else {
      reject(false);
    }
  });
};

export const editUserMessage= (data)=>{
  const update=ChatMessages.update({_id:data.messageId, chatId: data.chatId},{$set: {text: data.message}})
  if(update)
  return true;
  else
  return false;
}
export const deleteDbMsg= (_id,chatId)=>{
  const update=ChatMessages.remove({_id, chatId}, {justOne: true})
  if(update)
  return true;
  else
  return false;
}