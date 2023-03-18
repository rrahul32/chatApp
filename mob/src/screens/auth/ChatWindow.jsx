import React, {useState, useEffect} from 'react';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';
import ReceiverBubble from '../../components/ReceiverBubble';

// import ChatWindowHeader from '../../components/ChatWindowHeader';

const ChatWindow = ({chatId, messages, users, user, recepient, navigation, findEarlierMessages}) => {

  // recepientId= Chat.findOne({_id: chatId}).participants.filter((p)=>(p.id!=user._id))[0].id;
  // recepientDetails= Users.findOne({_id:recepientId});

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(messages.length<13);
  const [msgs, setMsgs] = useState([]);
  const appendNewMessage = (newMessage) => {
    setMsgs(previousMessages => GiftedChat.append(previousMessages, newMessage))
  }

  
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
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity style={styles.containerHead}
        onPress={()=>{
          navigation.navigate("View Profile",{user:recepient});
        }}
        >
          <Image
            source={{uri: 'https://via.placeholder.com/150'}}
            style={styles.avatar}
          />
          <Text style={styles.title}>{recepient.profile.name}</Text>
        </TouchableOpacity>
      ),
    });
  }, [messages]);

  //
  function renderMessage(props) {
    // const [translating, setTranslating] = useState(false);
    const isCurrentUser = props.currentMessage.user._id === user._id;

    if (!isCurrentUser) {
      return (
        <ReceiverBubble data={props}/>
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
    const randomId= Math.floor(Math.random() * 100) + 1;
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
          console.log("sent message: ", result);
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default withTracker(({route, navigation}) => {
  const chatId = route.params.chatId;
  const recepient = route.params.recepient;
  const ChatMessages = new Mongo.Collection('chatMessages');
  
  
  const messages = ChatMessages.find(
    {chatId: chatId},
    {sort: {createdAt: -1}, limit: 13},
  ).fetch();
  const findEarlierMessages = (oldestMessage)=> (
    ChatMessages.find(
      {chatId: chatId, createdAt: {$lt: oldestMessage.createdAt}},
      {sort: {createdAt: -1}, limit: 13},
    ).fetch()
  );
  const user = Meteor.user();
  const users = Meteor.users;
  return {
    chatId,
    messages,
    user,
    users,
    navigation,
    recepient,
    findEarlierMessages
  };
})(ChatWindow);

// export default ChatWindow;
