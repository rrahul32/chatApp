import React, {useState} from 'react';
import {StyleSheet, FlatList, View, Text, TouchableOpacity} from 'react-native';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';

// import Header from '../../components/Header';
import ChatHead from '../../components/ChatHead';

const Chat = new Mongo.Collection('chat');
// const Users = new Mongo.Collection('users');
const ChatMessages = new Mongo.Collection('chatMessages');
// const DATA = [
//   {
//     id: '1',
//     name: 'Alice',
//     lastMessage: 'Hey, how are you?',
//     time: '10:30 AM',
//     image: 'https://i.pravatar.cc/300?img=1',
//   },
//]


function Home({ready, chatData, chatMessages, users, navigation}) {
  if (!ready) return;
  // console.log("user: ",users[0]);
  const renderItem = ({ item }) => {
    // console.log(item);
    const currentChatMessages = chatMessages.filter(
      message => message.chatId === item._id,
    );
    const currentChatUsers = item.participants.map(participant =>
      users.find(user => user._id === participant.id),
    );
  
    return (
      <TouchableOpacity onPress={()=>{
        // console.log(item._id);
        navigation.navigate('Chat Window',{
          chatId: item._id
        })
      }}>
        <ChatHead item={item} currentChatMessages={currentChatMessages} currentChatUsers={currentChatUsers}/>
      </TouchableOpacity>
    );
    // return <View></View>
      }
  // console.log('chatData: ', chatData);
  // console.log('chatMessages: ', chatMessages);
  // console.log('users: ', users);

  if (chatData.length === 0)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Chats Found!!!</Text>
      </View>
    );

  return (
    <FlatList
      data={chatData}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  text: {
    color: '#666',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default withTracker(() => {
  // Subscribe to the chat publication
  const handle = Meteor.subscribe('chat');

  // Check if the subscription is ready
  const ready = handle.ready();

  // // Get the chat data
  const chatData = Chat.find().fetch();

  // // Get the chat message data
  const chatMessages = ChatMessages.find().fetch();

  // // Get the user data
  const users = Meteor.users.find().fetch();

  // Return the data as props to the component
  return {
    ready,
    chatData,
    chatMessages,
    users,
  };
})(Home);
