import React, {useState, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
} from 'react-native';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';
import ReceiverBubble from '../../components/ReceiverBubble';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {default as Icon2} from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import {SERVER_URL} from '../../App';
import SenderBubble from '../../components/SenderBubble';

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
  messageCount,
}) => {
  if (!recepient) return;

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(messages.length < 13);
  const [msgs, setMsgs] = useState([]);
  const [length, setLength] = useState(messageCount);
  const [isDetecting, setIsDetecting] = useState(true);
  const [emotion, setEmotion] = useState('neutral');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);

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
          modified: message.modified,
        };
      }),
    );
    Meteor.call(
      'resetUnreadChatMsgCount',
      {chatId, userId: user._id},
      (error, result) => {
        if (error) {
          console.log('error: ', error);
        } else {
          // console.log("UnreadCount reset");
        }
      },
    );
    // console.log('messageCount: ', messageCount);
    // console.log('length: ', length);
  }, [messages]);

  useEffect(() => {
    if (messageCount >= 5 && chatSettings.emotionDetection) {
      setIsDetecting(true);
    }
    setLength(messageCount);
  }, []);

  useEffect(() => {
    if (messageCount - length !== 0 && (messageCount - length) % 5 === 0)
      setIsDetecting(true);
  }, [messageCount]);

  useEffect(() => {
    if (!chatSettings.emotionDetection) {
      setIsDetecting(true);
      setEmotion('neutral');
      setLength(messageCount);
    }
    // if (messageCount-length !== 0 && (messageCount-length) % 5 === 0 && chatSettings.emotionDetection)
    else if (isDetecting) {
      console.log('observer');
      Meteor.call(
        'emotionDetectionFromMessage',
        {
          messages: observer.map(msg => msg.text),
        },
        (error, result) => {
          if (error) {
            console.log(error);
            alert('Network Error');
            setEmotion('neutral');
            setIsDetecting(false);
          } else {
            console.log('emotion detected as: ', result);
            setEmotion(result);
            setIsDetecting(false);
          }
        },
      );
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
                ? recepient.profile.image.url.replace(
                    /http:\/\/.*?\/cdn/,
                    `http://${SERVER_URL}/cdn`,
                  )
                : 'https://via.placeholder.com/150',
            }}
            style={styles.avatar}
          />
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={styles.title}>{recepient.profile.name}</Text>
            {chatSettings.emotionDetection && !isDetecting && (
              <Text style={styles.emotion}>{emotion}</Text>
            )}
            {chatSettings.emotionDetection && isDetecting && (
              <Text style={styles.emotion}>detecting...</Text>
            )}
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{flexDirection: 'row', gap: 20}}>
          <TouchableOpacity
            onPress={() => {
              setMinDate(new Date());
              setDate(new Date());
              setMessage('');
              setShowPopup(true);
            }}>
            <Icon2 name="message-text-clock-outline" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Chat Settings', {chatId});
            }}>
            <Icon name="settings" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [chatSettings.emotionDetection, isDetecting]);

  const deleteMessage = message => {
    Meteor.call(
      'deleteMessage',
      {chatId, messageId: message._id},
      (error, result) => {
        if (error) {
          console.log('error');
        } else {
          console.log('result: ', result);
        }
      },
    );
    setMsgs(prev => prev.filter(mess => mess._id !== message._id));
  };
  //
  const handleSubmit = () => {
    // Do something with message and date
    setShowPopup(false);
    if (message != '' && date > new Date()) {
      Meteor.call(
        'scheduleMessage',
        {chatId, text: message, scheduledDate: date},
        (error, result) => {
          if (error) {
            console.log(error);
            alert('Server error');
          } else {
            console.log(result);
            alert('Success');
          }
        },
      );
      console.log(message, date);
      // Close the popup
    } else {
      alert('Please check the date or message.');
    }
    setMessage('');
    setDate(new Date());
  };

  function renderMessage(props) {
    // const [translating, setTranslating] = useState(false);
    const {currentMessage} = props;
    const isCurrentUser = props.currentMessage.user._id === user._id;
    if (!isCurrentUser) {
      return (
        <View>

        <ReceiverBubble
          data={props}
          chatId={chatId}
          deleteMessage={deleteMessage}
          />
          {
            currentMessage.modified &&
            <Text
            style={{color: 'black', textAlign: 'left'}}
            >edited</Text>
          }
          </View>
      );
    }
    return (
      <View>
      <SenderBubble
        data={props}
        chatId={chatId}
        deleteMessage={deleteMessage}
      />
      {
        currentMessage.modified &&
        <Text style={{color: 'black', textAlign: 'right'}}>edited</Text>
      }
      </View>
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
          modified: message.modified,
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
      <Modal
        isVisible={showPopup}
        onBackdropPress={() => setShowPopup(false)}
        onBackButtonPress={() => setShowPopup(false)}>
        <View style={{padding: 20}}>
          {/* Message input */}
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Enter message"
            style={{marginBottom: 10}}
          />

          {/* Date picker */}
          <DatePicker
            date={date}
            onDateChange={setDate}
            mode="datetime"
            androidVariant="nativeAndroid"
            minimumDate={minDate}
          />

          {/* Submit button */}
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
  },
  close: {
    fontSize: 18,
    color: '#007AFF',
    marginTop: 10,
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
  const messageCount = ChatMessages.find({
    chatId,
    'createdBy.id': recepientId,
  }).fetch().length;
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
    messageCount,
  };
})(ChatWindow);

// export default ChatWindow;
