import React from 'react';
import { StyleSheet, FlatList,SafeAreaView } from 'react-native';
import Header from '../../components/Header';
import ChatHead from '../../components/ChatHead';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatWindow from './ChatWindow';

const DATA = [
  {
    id: '1',
    name: 'Alice',
    lastMessage: 'Hey, how are you?',
    time: '10:30 AM',
    image: 'https://i.pravatar.cc/300?img=1',
  },
  {
    id: '2',
    name: 'Bob',
    lastMessage: 'I have a question for you',
    time: '9:45 AM',
    image: 'https://i.pravatar.cc/300?img=2',
  },
  {
    id: '3',
    name: 'Charlie',
    lastMessage: 'Have you seen the news?',
    time: 'Yesterday',
    image: 'https://i.pravatar.cc/300?img=3',
  },
  {
    id: '4',
    name: 'David',
    lastMessage: 'Can you help me with something?',
    time: 'Yesterday',
    image: 'https://i.pravatar.cc/300?img=4',
  },
  {
    id: '5',
    name: 'Eve',
    lastMessage: 'Thanks for yesterday!',
    time: 'Yesterday',
    image: 'https://i.pravatar.cc/300?img=5',
  },
];

function HomePage() {
  const renderItem = ({ item }) => (
    <ChatHead item={item}/>
  );

  return (
    <SafeAreaView style={styles.container}>
        <Header title="ChatApp" imageUrl="https://i.pravatar.cc/" />
        {/* <HeaderNew /> */}
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}



export default function Home(){
  const Stack= createNativeStackNavigator();
  return(
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name='Home' component={HomePage}/>
      <Stack.Screen name='Chat' component={ChatWindow}/>
      </Stack.Navigator>
  </NavigationContainer>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
    });    