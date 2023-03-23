import * as React from 'react';
import {
  Button,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Login from './screens/Login';
import Home from './screens/auth/Home';
import ProfileUpdate from './screens/auth/ProfileUpdate';
import AddChat from './screens/auth/AddChat';
import ChatWindow from './screens/auth/ChatWindow';
import AppSettings from './screens/auth/AppSettings';
import EditProfile from './screens/auth/EditProfile';
import ViewProfile from './screens/auth/ViewProfile';
import ChatSettings from './screens/auth/ChatSettings';

export const SERVER_URL = "192.168.35.154:3000";
const Stack = createNativeStackNavigator();

Meteor.connect(`ws://${SERVER_URL}/websocket`);

const renderUI = user => {
  if (!user) {
    return (
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
    );
  } else if (user.profile && user.profile.name) {
    // console.log('user.profile.image.url: ', user.profile.image.url);
    return (
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={Home}
          options={props => ({
            headerRight: () => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('Settings');
                  }}>
                  <Icon name="settings" size={30} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.containerHead}
                  onPress={() => {
                    props.navigation.navigate('View Profile', {user});
                  }}>
                  <Image
                    source={{
                      uri: user.profile.image
                        ? user.profile.image.url.replace(/http:\/\/.*?\/cdn/,`http://${SERVER_URL}/cdn`)
                        : 'https://via.placeholder.com/150',
                    }}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
              </View>
            ),
            headerTitle: 'Chats',
          })}
        />

        <Stack.Screen name="Add Chat" component={AddChat} />
        <Stack.Screen
          name="Chat Window"
          component={ChatWindow}
        />
        <Stack.Screen name="Settings" component={AppSettings} />
        <Stack.Screen name="Edit Profile" component={EditProfile} />
        <Stack.Screen name="View Profile" component={ViewProfile} />
        <Stack.Screen name="Chat Settings" component={ChatSettings} />
        {/* <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} /> */}
      </Stack.Group>
    );
  } else {
    return (
      <Stack.Screen
        name="Create Profile"
        component={ProfileUpdate}
        options={{
          headerRight: () => (
            <Button onPress={() => Meteor.logout()} title="Logout" />
          ),
        }}
      />
    );
  }
};

function App(props) {
  const {user, loading} = props;
  if (loading) return;
  return (
    <NavigationContainer>
      <Stack.Navigator>{renderUI(user)}</Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = new StyleSheet.create({
  rightbutton: {
    color: '#666',
    fontSize: 14,
  },
  containerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    marginVertical: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default withTracker(() => {
  return {
    user: Meteor.user(),
    loading: Meteor.loggingIn(),
  };
})(App);
