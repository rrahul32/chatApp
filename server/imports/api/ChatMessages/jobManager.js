/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { Job } from "meteor/vsivsi:job-collection";

import { ChatMessageJobs } from "./";
import { createChatMessage } from "./modules";

ChatMessageJobs.startJobServer();

ChatMessageJobs.processJobs("scheduleChatMessages",
  function(job, cb) {
    let chatId = job.data && job.data.chatId;
    let userId = job.data && job.data.userId;
    let message = job.data && job.data.message;
    if (chatId && userId && message) {
      createChatMessage(chatId, userId, message).then(() => {
        job.done();
        job.remove();
        cb();
      }).catch(() => {
        job.fail();
        cb();
      })
   } else {
      job.fail();
      job.remove();
      cb();
    }
  }
);

export const createScheduledChatMessage = (chatId, userId, message, date, id = null) => {
  if (id) {
    ChatMessageJobs.getJob(id).cancel()
    ChatMessageJobs.getJob(id).remove()
  }
  new Job(ChatMessageJobs, "scheduleChatMessages", {
    userId: userId,
    chatId: chatId,
    message: message
  })
    .priority("normal")
    .after(date)
    .save();
};

export const getScheduledMessages = (chatId, userId) => {
  return ChatMessageJobs.find({
    "data.userId": userId,
    "data.chatId": chatId,
    "status": "running"
  }, {
    fields: {
      data: 1,
      after: 1
    }
  });
};
