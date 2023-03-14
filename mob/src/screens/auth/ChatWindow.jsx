import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { StyleSheet, View } from 'react-native';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';
// import ChatWindowHeader from '../../components/ChatWindowHeader';

export default function ChatWindow({route, navigation}) {
  const [messages, setMessages] = useState([]);
  const chatId= route.params.chatId;

  // useEffect(() => {
  //   // Load messages from API or database
  //   // Set messages using setMessages function
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello!',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ]);
  // }, []);

  function onSend(newMessages = []) {
    console.log(chatId);
    Meteor.call("sendMessage", { chatId: chatId, text: newMessages[0].text }, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
      }
    });
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }

  return (
    // <View style={styles.container}>
    //   <ChatWindowHeader name="Native" avatar='https://placeimg.com/140/140/any' />
    <GiftedChat 
    textInputStyle={styles.input}
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{ 
          _id: 1,
        }}
        />
        // </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    input:{
      color: 'black'
    }
  });
