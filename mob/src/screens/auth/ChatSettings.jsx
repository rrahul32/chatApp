import React from 'react';
import Meteor from '@meteorrn/core';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

const ChatSettings = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingOption} onPress={() => {}}>
        <Text style={styles.optionText}>Delete Chat</Text>
      </TouchableOpacity>
      <View style={styles.dropdownOption} >
        <Text style={styles.optionText}> Emotion Detection</Text>
      </View>
      <View style={styles.dropdownOption}>
        <Text style={styles.optionText}> Message Translation</Text>
      </View>
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
  dropdownOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ChatSettings;
