import React, {useState, useEffect} from 'react';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {StyleSheet, View} from 'react-native';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';
// import ChatWindowHeader from '../../components/ChatWindowHeader';

const ChatMessages = new Mongo.Collection('chatMessages');
const ChatWindow = ({chatId, loading, messages, userId}) => {
  if (loading) return;
  // console.log('userId: ', userId);
  // console.log('messages: ' + messages);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [msgs, setMsgs]= useState([]);
  // const chatMessages = messages.map(message => {
  //   return {
  //     _id: message._id,
  //     text: message.text,
  //     createdAt: message.createdAt,
  //     user: {
  //       _id: message.createdBy.id,
  //     },
  //   };
  // });

  // console.log("msg: ", ChatMessages.find().fetch().length)

  useEffect(() => {
    setMsgs(messages.map(message => {
      return {
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: {
          _id: message.createdBy.id,
        },
      };
    }));
  }, [messages])
  
  // console.log("lat: ",chatMessages[chatMessages.length-1])
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

  const onLoadEarlier = async () => {
    if (!isLoadingEarlier && !isAllLoaded) {
      setIsLoadingEarlier(true);

      const oldestMessage = msgs[msgs.length - 1];
      const earlierMessages = ChatMessages.find({
        chatId: {$ne: oldestMessage._id},
        createdAt: { $lt: oldestMessage.createdAt }
      }, {
        sort: { createdAt: -1 },
        limit: 13
      }).fetch();
      // console.log("len: ",earlierMessages);
      if(earlierMessages.length<10)
      setIsAllLoaded(true);

      setMsgs((prev)=>[
        ...prev,
        ...earlierMessages.map((message)=>({
          _id: message._id,
          text: message.text,
          createdAt: message.createdAt,
          user: {
            _id: message.createdBy.id,
          },
        }))
      ]);

      setIsLoadingEarlier(false);

    }
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
    <View style={styles.container}>
      {/* <ChatWindowHeader name="Native" avatar='https://placeimg.com/140/140/any' /> */}
    <GiftedChat
      textInputStyle={styles.input}
      messages={msgs}
      onSend={newMessages => onSend(newMessages)}
      user={{
        _id: userId,
      }}
      renderAvatar={() => null}
      renderMessage={renderMessage}
      loadEarlier={!isAllLoaded}
      onLoadEarlier={onLoadEarlier}
      isLoadingEarlier={isLoadingEarlier}
    />
    </View>
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
  const messages = ChatMessages.find({},{sort: {createdAt: -1}, limit: 13}).fetch();
  const userId = Meteor.user()._id;
  return {
    chatId,
    loading: !ready,
    messages,
    userId
  };
})(ChatWindow);
