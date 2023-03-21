import React, {useState, useEffect} from 'react';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';
import ReceiverBubble from '../../components/ReceiverBubble';
import Icon from 'react-native-vector-icons/MaterialIcons';

// import ChatWindowHeader from '../../components/ChatWindowHeader';

const ChatWindow = ({
  chatId,
  messages,
  user,
  recepient,
  navigation,
  findEarlierMessages,
  chatSettings,
  observer,
  messageCount
}) => {
  if (!recepient) return;

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(messages.length < 13);
  const [msgs, setMsgs] = useState([]);
  const [length, setLength] = useState(messageCount);
  const [isDetecting, setIsDetecting] = useState(true);
  const [emotion, setEmotion] = useState('neutral');

  const appendNewMessage = newMessage => {
    setMsgs(previousMessages =>
      GiftedChat.append(previousMessages, newMessage),
    );
  };
  useEffect(() => {
    setMsgs(
      messages.map(message => {
        return {
          _id: message._id,
          text: message.text,
          createdAt: message.createdAt,
          user: {
            _id: message.createdBy.id,
          },
        };
      }),
    );
    Meteor.call('resetUnreadChatMsgCount',{chatId, userId:user._id}, (error,result)=>{
      if(error)
      {
        console.log("error: ", error);
      }
      else
      {
        // console.log("UnreadCount reset");
      }
    })
    // console.log('messageCount: ', messageCount);
    // console.log('length: ', length);
  }, [messages]);

  useEffect(() => {
    if(messageCount>=5 && chatSettings.emotionDetection)
    {
      setIsDetecting(true);
    }
      setLength(messageCount);
  }, []);

  useEffect(() => {
    if (messageCount-length !== 0 && (messageCount-length) % 5 === 0)
    setIsDetecting(true);
  }, [messageCount]);

useEffect(() => {
  if(!chatSettings.emotionDetection)
  {
    setIsDetecting(true);
    setEmotion('neutral');
    setLength(messageCount);
  }
  else
  // if (messageCount-length !== 0 && (messageCount-length) % 5 === 0 && chatSettings.emotionDetection)
  if(isDetecting)
   {
    console.log('observer');
    Meteor.call('emotionDetectionFromMessage', {
      messages: observer.map(msg => msg.text),
    },(error, result)=>{
      if(error){
        console.log(error);
      }
      else
      {
        console.log("emotion detected as: ", result);
        setEmotion(result);
        setIsDetecting(false);
      }
    });
    setLength(messageCount);
  }
  navigation.setOptions({
    headerTitle: () => (
      <TouchableOpacity
        style={styles.containerHead}
        onPress={() => {
          navigation.navigate('View Profile', {user: recepient});
        }}>
        <Image
          source={{
            uri: recepient.profile.image
            ? recepient.profile.image.url
            : 'https://via.placeholder.com/150',
          }}
          style={styles.avatar}
          />
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <Text style={styles.title}>{recepient.profile.name}</Text>
        {chatSettings.emotionDetection && !isDetecting && <Text style={styles.emotion}>{emotion}</Text>}
        {chatSettings.emotionDetection && isDetecting && <Text style={styles.emotion}>detecting...</Text>}
          </View>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Chat Settings', {chatId});
        }}>
        <Icon name="settings" size={30} color="black" />
      </TouchableOpacity>
    ),
  });
}, [chatSettings.emotionDetection,isDetecting])


  //
  

  function renderMessage(props) {
    // const [translating, setTranslating] = useState(false);
    const isCurrentUser = props.currentMessage.user._id === user._id;

    if (!isCurrentUser) {
      return <ReceiverBubble data={props} chatId={chatId} />;
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
      const earlierMessages = findEarlierMessages(oldestMessage);
      if (earlierMessages.length < 13) setIsAllLoaded(true);

      setMsgs(prev => [
        ...prev,
        ...earlierMessages.map(message => ({
          _id: message._id,
          text: message.text,
          createdAt: message.createdAt,
          user: {
            _id: message.createdBy.id,
          },
        })),
      ]);

      setIsLoadingEarlier(false);
    }
  };

  function onSend(newMessages = []) {
    //
    const randomId = Math.floor(Math.random() * 100) + 1;
    appendNewMessage({
      _id: randomId,
      text: newMessages[0].text,
      createdAt: new Date(),
      user: {
        _id: user._id,
      },
    });

    Meteor.call(
      'sendMessage',
      {chatId: chatId, text: newMessages[0].text},
      (error, result) => {
        if (error) {
        } else {
          console.log('sent message: ', result);
        }
      },
    );
  }

  return (
    <View style={styles.container}>
      {/* <ChatWindowHeader name="Native" avatar='https://placeimg.com/140/140/any' /> */}
      <GiftedChat
        textInputStyle={styles.input}
        messages={msgs}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: user._id,
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
  containerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    marginVertical: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'black',
  },
  emotion: {
    fontSize: 14,
    fontWeight: 'light',
    marginLeft: 10,
    color: 'black',
    fontStyle: 'italic',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default withTracker(({route, navigation}) => {
  const chatId = route.params.chatId;
  const recepientId = route.params.recepientId;
  // console.log('recepientId: ', recepientId);
  const ChatMessages = new Mongo.Collection('chatMessages');
  const user = Meteor.user();
  const Chat = new Mongo.Collection('chat');
  // const unreadCount = Chat.findOne({_id: chatId}).participants.find(ele=>ele.id===user._id).unReadCount;
  // console.log('unreadCount: ', unreadCount);
  const messages = ChatMessages.find(
    {chatId: chatId},
    {sort: {createdAt: -1}, limit: 13},
  ).fetch();
  const messageCount = ChatMessages.find({chatId, "createdBy.id":recepientId}).fetch().length;
  // console.log('messageCount: ', messageCount);
  const findEarlierMessages = oldestMessage =>
    ChatMessages.find(
      {chatId: chatId, createdAt: {$lt: oldestMessage.createdAt}},
      {sort: {createdAt: -1}, limit: 13},
    ).fetch();
  const users = Meteor.users;
  const recepient = users.findOne({_id: recepientId});
  const Settings = new Mongo.Collection('userSettings').findOne();
  // console.log('Settings: ', Settings);
  const chatSettings = Settings.chatSettings.find(ele => {
    return ele.id === chatId;
  });
  const observer = ChatMessages.find(
    {chatId: chatId, 'createdBy.id': recepientId},
    {sort: {createdAt: -1}, limit: 5},
  ).fetch();
  // console.log('observer: ', observer);
  // console.log('chatSettings: ', chatId);
  // console.log('settings: ',chatSettings);
  return {
    chatId,
    messages,
    user,
    navigation,
    recepient,
    findEarlierMessages,
    chatSettings,
    observer,
    messageCount
  };
})(ChatWindow);

// export default ChatWindow;
