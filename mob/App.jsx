/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import React from 'react';
import {
  Text,
  View,
} from 'react-native';

Meteor.connect("wss://192.168.1.5:3000/websocket");
  
class App extends React.Component {
  render() {
      return (
        <View>
<Text>Hello</Text>
        </View>
      );
  }
}

