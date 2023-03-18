import React from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

const Settings = new Mongo.Collection('settings',{connection: null});

const AppSettings = ({navigation}) => {
  function handleChatBackgroundChange(){
    console.log(
      Settings.find().fetch()
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingOption} onPress={()=>{
        navigation.navigate('Edit Profile');
      }}>
        <Text style={styles.optionText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingOption} onPress={handleChatBackgroundChange}>
        <Text style={styles.optionText}>Change Chat Background</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingOption}>
        <Text style={styles.optionText}>Change Alert Tone</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingOption}>
        <Text style={styles.optionText}>Edit Status</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingOption}
        onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => Meteor.logout()},
              ]);
        }}>
        <Text style={styles.optionText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  settingOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AppSettings;
