import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Meteor, { Mongo, withTracker } from '@meteorrn/core';

import Login from "./screens/Login";
import Home from "./screens/auth/Home";

Meteor.connect("ws://192.168.1.16:3000/websocket");

const Stack = createNativeStackNavigator();

function App(props) {
  const {user, loading} = props;
  if (loading) return;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home" component={Home} options={{ headerShown: true, headerRight: () => (
            <Button
              onPress={() => Meteor.logout()}
              title="Logout"
            />
          ) }}/>
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        )}
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