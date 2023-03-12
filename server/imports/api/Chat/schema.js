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
    label: "id of user or business"
  },
  "unReadCount": {
    type: Number,
    label: "Unread message count"
  }
});

const chatSchema = new SimpleSchema({
  "participants": {
    type: Array,
    label: "participants details"
  },
  "participants.$": {
    type: userSchema,
    label: "participants details"
  },
  "createdAt": {
    type: Date,
    label: "Date time of the cart created",
    autoValue: function() { // eslint-disable-line consistent-return
      if (Meteor.isServer && this.isInsert) {
        return new Date();
      }
    }
  },
  "lastMessageAt": {
    type: Date,
    label: "Last message date time",
    autoValue: function() { // eslint-disable-line consistent-return
      if (Meteor.isServer && this.isInsert) {
        return new Date();
      }
    }
  }
});

export default chatSchema;
