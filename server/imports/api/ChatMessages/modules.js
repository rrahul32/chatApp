/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import ChatMessages from "./";
import { getChatDetails, incrementChatCount } from "../Chat/modules";
import { AppConstants } from "../../../config";
import { getBusiness, getBusinessDetailsBasic } from "../Business/modules";
import { getUserDetails } from "../Users/modules";
import { createPushNotification } from "../Notifications/modules";

const pushNotificationPayloads = AppConstants.pushNotificationPayloads;
const notificationCategories = AppConstants.notificationCategories;
const userTypes = AppConstants.userTypes;

export const createChatMessage = (chatId, userId, messageData) => {
  return new Promise((resolve, reject) => { // eslint-disable-line no-undef
    const chatMessageId = ChatMessages.insert({
      chatId,
      text: messageData.text,
      image: messageData.image,
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
