/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { Mongo } from "meteor/mongo";

import chatSchema from "./schema";

const Chat = new Mongo.Collection("chat");

export default Chat;

Chat.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Chat.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Chat.attachSchema(chatSchema);
