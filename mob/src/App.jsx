import * as React from 'react';
import { Button, TouchableOpacity, View, Text, StyleSheet,Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Login from "./screens/Login";
import Home from "./screens/auth/Home";
import ProfileUpdate from "./screens/auth/profileUpdate";
import AddChat from "./screens/auth/AddChat";
import ChatWindow from './screens/auth/ChatWindow';
import AppSettings from './screens/auth/AppSettings';

Meteor.connect("ws://192.168.1.2:3000/websocket");

const Stack = createNativeStackNavigator();



const renderUI = (user) => {
  
  if (!user) {
    return (
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
    );
  } else if (user.profile && user.profile.name) {
    return (
      <Stack.Group screenOptions={{headerRight: () => (
        <Button
          onPress={() => Meteor.logout()}
          title="Logout"
        />
      ),}}>
        <Stack.Screen name="Home" component={Home} options={(props)=>({headerRight: ()=> (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
        <TouchableOpacity
        onPress={()=>{
          props.navigation.navigate("Settings");
        }}
        >
          <Icon name="settings" size={30} color="black"/>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={()=>{
          props.navigation.navigate("Add Chat");
        }}
        >
          <Icon name="add-circle-outline" size={30} color="black"/>
        </TouchableOpacity>
          </View>
        ), headerTitle: "Chats"})}
        />

        <Stack.Screen name="Add Chat" component={AddChat} />
        <Stack.Screen name="Chat Window" component={ChatWindow} />
        <Stack.Screen name="Settings" component={AppSettings}/>
        {/* <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} /> */}
      </Stack.Group>
    );
  } else {
    return (
      <Stack.Screen name="Create Profile" component={ProfileUpdate} options={{headerRight: () => (
        <Button
          onPress={() => Meteor.logout()}
          title="Logout"
        />
      )}}/>
    );
  }
};

function App(props) {
  const {user, loading} = props;
  if (loading) return;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {renderUI(user)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles= new StyleSheet.create(
  {
    rightbutton: {
      color: "#666",
      fontSize: 14,
    },
  }
)

export default withTracker(() => {    
  return {
      user: Meteor.user(),
      loading: Meteor.loggingIn()
  };
  
})(App);