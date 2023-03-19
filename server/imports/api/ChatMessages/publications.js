import { Meteor } from "meteor/meteor";
import ChatMessages from ".";

Meteor.publish('chatMessages', function(chatId) {
    // Check if the user is authenticated
  const thisUser = Meteor.user();
    if (!thisUser) {
      return null;
    }
  
    // Define the fields to be returned
    const fields = {
      chatId: 1,
      text: 1,
      createdBy: 1,
      createdAt: 1,
    };
  
    // Define the query to fetch chat messages by chatId
    const query = {
      chatId,
    };
  
    // Fetch and return the chat messages
    return ChatMessages.find(query, { fields });
  });