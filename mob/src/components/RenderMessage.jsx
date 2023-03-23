import {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';

const RenderMessage= ({data, handleDone})=>{

    const [text, setText] = useState(data.currentMessage.text);

    return(
            <View style={{paddingLeft:10, flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <TextInput
          onChangeText={(value)=>{
            setText(value);
          }}
          multiline
          style={{color: 'white'}}
        //   value={props.currentMessage.text}
          value={text}
        />
        <TouchableOpacity onPress={()=>{
            handleDone(text);
        }}>
            <Text style={{color: 'white', paddingRight:10}}>Done</Text>
        </TouchableOpacity>
        </View>
    )
}

export default RenderMessage;