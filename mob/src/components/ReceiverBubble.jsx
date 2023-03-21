import {View, TouchableOpacity, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Bubble} from 'react-native-gifted-chat';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';


const ReceiverBubble = ({data, translation, language}) => {
  const [msgData, setmsgData] = useState(data);
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);

  useEffect(() => {
    setTranslating(false);
    setTranslated(false);
  }, [language])
  

  const translateMessage= (message)=>{
    Meteor.call(
      'translateMessage',
      {text: message, language: language},
      (error, result)=>{
        if (error) {
          console.log("Translate error: ", error)
        } else {
          console.log('Translate result: ', result);
          setmsgData((previousdata=> {
              previousdata.currentMessage.text=result;
              return previousdata;
          }
          ));
          setTranslating(false);
          setTranslated(true);
        }
      }
    );
  }

  return (
    <View>
      <Bubble
        {...msgData}
        wrapperStyle={{
          left: {
            backgroundColor: 'lightgrey', // set the background color for messages sent by other users
            marginBottom: 3,
            marginLeft: 7,
          },
        }}
      />
      {translation &&
      <View style={{position: 'absolute', right: 20, top: 10}}>
        {!translating && !translated?
        <TouchableOpacity
        onPress={ async () => {
            console.log(msgData.currentMessage.text);
            setTranslating(true);
           translateMessage(msgData.currentMessage.text, 'hindi');
        }}>
          <Icon name="g-translate" size={30} color="black" />
        </TouchableOpacity>
        :
        translating?
        <Text style={{color: 'black'}}>translating...</Text>
        :
        <Text style={{color: 'black'}}>Translated</Text>
    }
      </View>
          }
    </View>
  );
};

// export default ReceiverBubble;

export default withTracker(({data, chatId}) => {
  const Settings = new Mongo.Collection('userSettings').findOne();
  const chatSettings = Settings.chatSettings.find((ele)=>{
    return ele.id===chatId;
  });
  const translation=chatSettings.translationEnabled;
  const language=chatSettings.translationLanguage;
  // console.log('settings: ',chatSettings);
  return {
    data,
    translation,
    language
  };
})(ReceiverBubble);
