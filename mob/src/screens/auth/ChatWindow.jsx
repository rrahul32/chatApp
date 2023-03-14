import React, {useState} from 'react';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {StyleSheet, View} from 'react-native';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';
// import ChatWindowHeader from '../../components/ChatWindowHeader';

const ChatMessages = new Mongo.Collection('chatMessages');
const ChatWindow = ({chatId, loading, messages}) => {
  if (loading) return;
  const userId = Meteor.user()._id;
  console.log('userId: ', userId);
  // console.log('messages: ' + messages);
  const chatMessages = messages.map(message => {
    return {
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: {
        _id: userId,
      },
    };
  });
  
  function renderMessage(props) {
    const isCurrentUser = props.currentMessage.user._id === props.user._id;

    if (!isCurrentUser) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: 'lightgrey', // set the background color for messages sent by other users
              marginBottom: 3,
              marginLeft: 7,
            },
          }}
        />
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // set the background color for messages sent by other users
            marginBottom: 3,
            marginRight: 7,
          },
        }}
      />
    );
  }

  function onSend(newMessages = []) {
    // console.log(chatId);
    Meteor.call(
      'sendMessage',
      {chatId: chatId, text: newMessages[0].text},
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      },
    );
      // GiftedChat.append(chatMessages, newMessages);
    // setMessagess(previousMessages =>
    // );
  }

  return (
    // <View style={styles.container}>
    //   <ChatWindowHeader name="Native" avatar='https://placeimg.com/140/140/any' />
    <GiftedChat
      textInputStyle={styles.input}
      messages={chatMessages}
      onSend={newMessages => onSend(newMessages)}
      user={{
        _id: userId,
      }}
      renderAvatar={() => null}
      renderMessage={renderMessage}
      inverted={false}
      isLoadingEarlier={false}
    />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    color: 'black',
  },
});

export default withTracker(({route, navigation}) => {
  const chatId = route.params.chatId;
  const handle = Meteor.subscribe('chatMessages', chatId);
  const ready = handle.ready();
  const messages = ChatMessages.find().fetch();
  return {
    chatId,
    loading: !ready,
    messages,
  };
})(ChatWindow);
