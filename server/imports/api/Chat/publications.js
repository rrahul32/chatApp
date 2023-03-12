/**
 * Copyright (c) 2019-present, Evolvier Technologies. All rights reserved.
 *
 */

"use strict";

import { Meteor } from "meteor/meteor";
import { publishComposite } from "meteor/reywood:publish-composite";

import Chat from "./";
import ChatMessages from "../ChatMessages";

publishComposite("chat", function() {
  const thisUser = Meteor.user();
  if (thisUser) {
    return {
      find() {
        return Chat.find({
          "participants.id": thisUser._id
        },
          {
            fields: {
              _id: 1,
              createdAt: 1,
              lastMessageAt: 1,
              participants: 1
            }
          });
      },
      children: [
        {
          find(chatData) {
            return ChatMessages.find({
              chatId: chatData._id
            });
          }
        }, {
          find(chatData) {
            return Meteor.users.find({
              _id: chatData.participants.map(item => item._id)
            }, {
              fields: {
                profile: 1
              }
            })
          }
        }
      ]
    };
  } else {
    return null;
  }
});
