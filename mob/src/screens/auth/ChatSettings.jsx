import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const ChatSettings = ({ handleDeleteChat }) => {
  const [translation, setTranslation] = useState(false);
  const [language, setLanguage] = useState('');
  const [emotionDetection, setEmotionDetection] = useState(false);

  const handleDeleteConfirmation = () => {
    // Show confirmation modal
    // If confirmed, call handleDeleteChat function
  };

  const handleTranslation = (value) => {
    setTranslation(value);
  };

  const handleLanguage = (value) => {
    setLanguage(value);
  };

  const handleEmotionDetection = (value) => {
    setEmotionDetection(value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style = {styles.settingOption} onPress={handleDeleteConfirmation}>
        <Text style={styles.optionText}>Delete Chat</Text>
      </TouchableOpacity>

      <Text style={styles.optionText}>Message Translation:</Text>
      <Picker
        selectedValue={translation}
            onValueChange={(value) => handleTranslation(value)}
      >
        <Picker.Item label="Disabled" value={false} color='black'/>
        <Picker.Item label="Enabled" value={true} color='black' />
      </Picker>

      {translation && (
        <View>
          <Text style={styles.optionText}>Select Language:</Text>
          <Picker
            selectedValue={language}
            onValueChange={(value) => handleLanguage(value)}
            // color="black"
          >
            <Picker.Item label="Hindi" value="hi" color='black'/>
            <Picker.Item label="Spanish" value="es" color='black'/>
            <Picker.Item label="French" value="fr" color='black'/>
            <Picker.Item label="Chinese" value="zh-CN" color='black'/>
            <Picker.Item label="Malayalam" value="ml" color='black'/>
          </Picker>
        </View>
      )}

      <Text style={styles.optionText}>Emotion Detection:</Text>
      <Picker
        selectedValue={emotionDetection}
        onValueChange={(value) => handleEmotionDetection(value)}
      >
        <Picker.Item label="Disabled" value={false} color='black'/>
        <Picker.Item label="Enabled" value={true} color='black'/>
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
export default ChatSettings;