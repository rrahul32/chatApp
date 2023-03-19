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
