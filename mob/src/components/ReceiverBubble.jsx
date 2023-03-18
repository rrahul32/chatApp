import {View, TouchableOpacity, Text} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Bubble} from 'react-native-gifted-chat';
import Meteor from '@meteorrn/core';


const ReceiverBubble = ({data}) => {
  const [msgData, setmsgData] = useState(data);
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);
  const translateMessage= (message,language)=>{
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
    </View>
  );
};

export default ReceiverBubble;
