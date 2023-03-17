import React, {useState} from 'react';
import {StyleSheet, FlatList, View, Text, TouchableOpacity} from 'react-native';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';
import ChatHead from '../../components/ChatHead';

const Chat = new Mongo.Collection('chat');
const ChatMessages = new Mongo.Collection('chatMessages');

function Home({ready, chatData, chatMessages, users, navigation}) {
  
  if (!ready) return;
  //
  const renderItem = ({item}) => {
    //
    const currentChatMessages = chatMessages.filter(
      message => message.chatId === item._id,
      );

    const recepient = item.participants.filter((participant)=>participant.id!=Meteor.user()._id).map((rece)=>(
      users.find((user)=>(user._id==rece.id))
    ))[0];
    

    return (
      <TouchableOpacity
        onPress={() => {
          //
          navigation.navigate('Chat Window', {
            chatId: item._id,
            recepient
          });
        }}>
        <ChatHead
          lastMessage={currentChatMessages[0]}
          recepient={recepient}
        />
      </TouchableOpacity>
    );
  };

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
  //
  

  // // Get the chat message data
  const chatMessages = ChatMessages.find({},{sort: {createdAt: -1}}).fetch();
  //

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
