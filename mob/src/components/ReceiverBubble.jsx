import {View, TouchableOpacity, Text, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Bubble} from 'react-native-gifted-chat';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';
import Clipboard from '@react-native-clipboard/clipboard';


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

  const deleteMessage = (message)=>{
    Meteor.call('deleteMessage', {messageId: message._id}, (error, result)=>{
      if(error)
      {
        console.log('error');
      }
      else{

      }
    })
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

        onLongPress={(context, message) => {
          // console.log('message: ', message);
          // console.log('context: ', context.actionSheet());
          // context.onLongPress(context, message);
            const options = [
              'Copy Text',
              'Delete Message',
              'Cancel',
            ];
            const cancelButtonIndex = options.length - 1;
            context.actionSheet().showActionSheetWithOptions(
              {
                options,
                cancelButtonIndex,
              },
              (buttonIndex) => {
                if (buttonIndex === 0) {
                  Clipboard.setString(message.text);
                } else if (buttonIndex === 1) {
                  // delete message
                  Alert.alert('Delete', 'Are you sure you want to delete the message?', [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () => deleteMessage(message)},
                  ]);
                } else if (buttonIndex === 2) {
                  
                }
              },
            );
          }
        }

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

export default withTracker(({data, chatId, deleteMessage}) => {
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
    language,
    deleteMessage
  };
})(ReceiverBubble);
