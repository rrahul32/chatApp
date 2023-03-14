import React,  {useState} from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import Meteor, { withTracker } from '@meteorrn/core';


// import Header from '../../components/Header';
import ChatHead from '../../components/ChatHead';


// const DATA = [
//   {
//     id: '1',
//     name: 'Alice',
//     lastMessage: 'Hey, how are you?',
//     time: '10:30 AM',
//     image: 'https://i.pravatar.cc/300?img=1',
//   },
//   {
//     id: '2',
//     name: 'Bob',
//     lastMessage: 'I have a question for you',
//     time: '9:45 AM',
//     image: 'https://i.pravatar.cc/300?img=2',
//   },
//   {
//     id: '3',
//     name: 'Charlie',
//     lastMessage: 'Have you seen the news?',
//     time: 'Yesterday',
//     image: 'https://i.pravatar.cc/300?img=3',
//   },
//   {
//     id: '4',
//     name: 'David',
//     lastMessage: 'Can you help me with something?',
//     time: 'Yesterday',
//     image: 'https://i.pravatar.cc/300?img=4',
//   },
//   {
//     id: '6',
//     name: 'Eve',
//     lastMessage: 'Thanks for yesterday!',
//     time: 'Yesterday',
//     image: 'https://i.pravatar.cc/300?img=6',
//   },
// ];
// const renderItem = ({ item }) => (
//   <ChatHead item={item}/>
// );


 function Home(props) {
  if(props.data.length===0 || props.data == null)
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Chats Found!!!</Text>
    </View>
  )
  return (
    <FlatList
      data={props.data}
      renderItem={ChatHead}
      keyExtractor={(item) => item.id}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent:'center',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  text:{
    color: "#666",
    textAlign:'center',
    fontSize: 20
  },
});    

export default withTracker(() => {    
  return {
      data: [],
  };
  
})(Home);