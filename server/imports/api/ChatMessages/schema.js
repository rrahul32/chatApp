/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";

const userSchema = new SimpleSchema({
  "id": {
    type: String,
    label: "id of user"
  }
});

const imageSchema = new SimpleSchema({
  "id": {
    type: String,
    label: "Id of the image."
  },
  "url": {
    type: String,
    label: "URL of the image."
  }
});

const chatMessagesSchema = new SimpleSchema({
  "chatId": {
    type: String,
    label: "chatId"
  },
  "text": {
    type: String,
    label: "text content of message",
    optional: true
  },
  // "image": {
  //   type: imageSchema,
  //   label: "Image content of the message",
  //   optional: true
  // },
  "createdBy": {
    type: userSchema,
    label: "sender of the message"
  },
  "createdAt": {
    type: Date,
    label: "Date time of the message created",
    autoValue: function() { // eslint-disable-line consistent-return
      if (Meteor.isServer && this.isInsert) {
        return new Date();
      }
    }
  }
});

export default chatMessagesSchema;
