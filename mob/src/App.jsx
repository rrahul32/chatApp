import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Meteor, { Mongo, withTracker } from '@meteorrn/core';

import Login from "./screens/Login";
import Home from "./screens/auth/Home";
import ProfileUpdate from "./screens/auth/profileUpdate";

Meteor.connect("ws://192.168.1.16:3000/websocket");

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
      )}}>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} />
      </Stack.Group>
    );
  } else {
    return (
      <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} options={{headerRight: () => (
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

export default withTracker(() => {    
  return {
      user: Meteor.user(),
      loading: Meteor.loggingIn()
  };
  
})(App);