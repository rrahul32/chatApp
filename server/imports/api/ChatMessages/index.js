/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { Mongo } from "meteor/mongo";
import { JobCollection } from "meteor/vsivsi:job-collection";

import chatMessageSchema from "./schema";

const ChatMessages = new Mongo.Collection("chatMessages");
export const ChatMessageJobs = JobCollection("chatMessageJobs"); // eslint-disable-line new-cap

export default ChatMessages;

ChatMessages.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

ChatMessages.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

ChatMessages.attachSchema(chatMessageSchema);
