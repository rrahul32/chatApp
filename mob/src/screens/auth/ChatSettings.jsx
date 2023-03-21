import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';

const ChatSettings = ({chatSettings, navigation, chatId}) => {

  const translation = chatSettings.translationEnabled;
  const emotionDetection = chatSettings.emotionDetection;
  const language = chatSettings.translationLanguage;

  const handleDeleteConfirmation = () => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete the chat? It will be deleted for both users.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            Meteor.call('deleteChat', {chatId: chatId}, (error, result) => {
              if (error) {
              } else {
                navigation.navigate('Home');
              }
            }),
        },
      ],
    );
  };

  const handleTranslation = value => {
    chatSettings.translationEnabled=value;
    Meteor.call(
        'insertOrUpdateChatSettings',
        {settings: chatSettings},
        (error, result) => {
          if (error) {
            console.log(error)
          } else {
            console.log(result);
          }
        },
      );
  };

  const handleLanguage = value => {
    chatSettings.translationLanguage=value;
    Meteor.call(
        'insertOrUpdateChatSettings',
        {settings: chatSettings},
        (error, result) => {
          if (error) {
            console.log(error)
          } else {
            console.log(result);
          }
        },
      );
  };

  const handleEmotionDetection = value => {
    chatSettings.emotionDetection=value;
    Meteor.call(
        'insertOrUpdateChatSettings',
        {settings: chatSettings},
        (error, result) => {
          if (error) {
            console.log(error)
          } else {
            console.log(result);
          }
        },
      );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingOption}
        onPress={handleDeleteConfirmation}>
        <Text style={styles.optionText}>Delete Chat</Text>
      </TouchableOpacity>

      <Text style={styles.optionText}>Message Translation:</Text>
      <Picker
        selectedValue={translation}
        onValueChange={value => handleTranslation(value)}>
        <Picker.Item label="Disabled" value={false} color="black" />
        <Picker.Item label="Enabled" value={true} color="black" />
      </Picker>

      {translation && (
        <View>
          <Text style={styles.optionText}>Select Language:</Text>
          <Picker
            selectedValue={language}
            onValueChange={value => handleLanguage(value)}
            // color="black"
          >
            <Picker.Item label="Hindi" value="hi" color="black" />
            <Picker.Item label="Spanish" value="es" color="black" />
            <Picker.Item label="French" value="fr" color="black" />
            <Picker.Item label="Chinese" value="zh-CN" color="black" />
            <Picker.Item label="Malayalam" value="ml" color="black" />
          </Picker>
        </View>
      )}

      <Text style={styles.optionText}>Emotion Detection:</Text>
      <Picker
        selectedValue={emotionDetection}
        onValueChange={value => handleEmotionDetection(value)}>
        <Picker.Item label="Disabled" value={false} color="black" />
        <Picker.Item label="Enabled" value={true} color="black" />
      </Picker>
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
// export default ChatSettings;

export default withTracker(({route, navigation}) => {
  const chatId = route.params.chatId;
  const Settings = new Mongo.Collection('userSettings').findOne();
  const chatSettings = Settings.chatSettings.find((ele)=>{
    return ele.id===chatId;
  });
  // console.log('settings: ',chatSettings);
  return {
    navigation,
    chatSettings,
    chatId
  };
})(ChatSettings);
