import {useState, useEffect} from 'react';
import {View, TextInput, TouchableOpacity, Alert, Text} from 'react-native';
import {Bubble} from 'react-native-gifted-chat';
import Meteor from '@meteorrn/core';
import RenderMessage from './RenderMessage';


const SenderBubble= ({data, chatId, deleteMessage})=>{
    // console.log(data.currentMessage.text);
    const [isEditable, setIsEditable] = useState(false);
    const [props, setProps] = useState(data);
    // const [text, setTerxt] = useState(data.currentMessage.text);
    // const value=text;
    // console.log('text: ', text);
    
//     useEffect(() => {
//         if(isEditable)
//         {
//             const prop = data;
//             prop.renderMessageText=()=>(
// <View style={{paddingLeft:10, flexDirection: 'row', alignItems: 'center', gap: 10}}>
//         <TextInput
//           onChangeText={(value)=>{
//             setProps(prev=> {
//                 prev.currentMessage.text=value;
//                 return prev;
//             })
//             // setText(value);
//             // console.log(text);
//           }}
//           multiline
//           style={{color: 'white'}}
//         //   value={props.currentMessage.text}
//           value={props.currentMessage.text}
//         />
//         <TouchableOpacity onPress={()=>{
            
//             setIsEditable(false);
//         }}>
//             <Text style={{color: 'white', paddingRight:10}}>Done</Text>
//         </TouchableOpacity>
//         </View>
//             )
//             setProps(prop);
//     }
//         else
//         setProps(data);
//     }, [isEditable, props])s

const handleDone = (text)=>{
setProps(prev=>{
    prev.currentMessage.text=text;
    return prev;
})
Meteor.call(
    'editMessage',
    {chatId, message:text, messageId:props.currentMessage._id},
    (error, result) => {
      if (error) {
      } else {
        console.log('sent message: ', result);
      }
    },
  );
console.log(props.currentMessage.text);
    setIsEditable(false);
}
    
    return (
    <Bubble
    {...props}
      wrapperStyle={{
        right: {
          // set the background color for messages sent by other users
          marginBottom: 3,
          marginRight: 7,
        },
      }}
      renderMessageText={!isEditable?props.renderMessageText:()=><RenderMessage data={data} handleDone={handleDone}/>}
      onLongPress={(context, message) => {
        // console.log('message: ', message);
        // console.log('context: ', context.actionSheet());
        // context.onLongPress(context, message);
          const options = [
            'Copy Text',
            'Delete Message',
            'Edit Message',
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
                setIsEditable(true);
              }
            },
            );
          }
        }
        />
        );
    }

    export default SenderBubble;