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
  ScrollView,
  TextInput,
  Button
} from 'react-native';

Meteor.connect("ws://192.168.1.5:3000/websocket");

const Links = new Mongo.Collection("links");
  
class App extends React.Component {
  constructor(props){  
    super(props);  
    this.state = {
      title: "",
      link: ""
    };
  }  
  onClick () {
    const {title, link} = this.state;
    Meteor.call('links.insert', title, link, (error) => {
      if (error) {
        alert(error.error);
      } else {
        this.setState({
          title: "",
          link: ""
        });
      }
    });
  }
  render() {
  const { loading, allLinks } = this.props;
  if(loading) {
    return <View><Text>Loading your Links...</Text></View>
  }

  return (

    <View>
      <TextInput id='title' value={this.state.title} onChangeText={(text) => {
        console.log("text", text)
        this.setState({
          title: text
        })
      }}/>
      <TextInput id='link' value={this.state.link}  onChangeText={(text) => {
        this.setState({
          link: text
        })
      }}/>
      <Button onPress={() => this.onClick()} title="Submit"/>
    <ScrollView>
        {!allLinks.length ?
            <Text>You don't have any tasks</Text>
        :
        allLinks.map(link => (
                <Text>{link.title}</Text>
            ))
        }
    </ScrollView>
    </View>
    );
  }
}

 const MyAppContainer = withTracker(() => {
    
  const allLinks = Links.find().fetch();
  const handle = Meteor.subscribe("links.all");
  
  return {
    allLinks,
    loading:!handle.ready()
  };
  
})(App);

export default MyAppContainer;