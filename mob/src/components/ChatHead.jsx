import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import Meteor from '@meteorrn/core';
import RNImgToBase64 from 'react-native-image-base64';
// import Icon from 'react-native-ionicons';

const ChatHead = ({lastMessage, recepient}) => {
  // const recepient = currentChatUsers.filter(
  //   user => user._id !== Meteor.user()._id,
  // );
  const [base64Image, setBase64Image] = useState('https://via.placeholder.com/150');
  // useEffect(() => {
  //   const fetchImage = async () => {
  //     try {
  //       const base64 = await RNImgToBase64.getBase64String('http://192.168.1.2:3000/cdn/storage/profileImages/CdXhfigE3fKhfRJLT/original/CdXhfigE3fKhfRJLT.jpg');
  //       setBase64Image(`data:image/png;base64,${base64}`);
  //     } catch (error) {
  //       
  //     }
  //   };
  //   fetchImage();
  // }, []);

  return (
      <View style={styles.item}>
        <Image
          source={{uri: base64Image}}
          style={styles.avatar}
        />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{recepient[0].profile.name}</Text>
            <Text style={styles.itemTime}>
              {lastMessage.createdAt.toLocaleDateString('en-US', {
                day: '2-digit',
                weekday: 'short',
              })}
            </Text>
          </View>
          <Text style={styles.itemLastMessage} numberOfLines={1} >{lastMessage.text}</Text>
          {/* <Text style={styles.itemLastMessage} numberOfLines={1}>
            nil
          </Text> */}
        </View>
      </View>
  );
  // return (
  //   <View style={styles.item}>
  //     {/* <Image source={{ uri: item.image }} style={styles.avatar} /> */}
  //     <View style={styles.itemContent}>
  //       <View style={styles.itemHeader}>
  //         <Text style={styles.itemName}>{recepient.profile.name}</Text>
  //         <Text style={styles.itemTime}>{item.lastMessageAt.toString()}</Text>
  //       </View>
  //       {/* <Text style={styles.itemLastMessage} numberOfLines={1} >{item.lastMessage}</Text> */}
  //       <Text style={styles.itemLastMessage} numberOfLines={1}>
  //         nil
  //       </Text>
  //     </View>
  //     {/* <Icon name="chevron-forward-outline" size={20} color="#b2b2b2" /> */}
  //   </View>
  // );
};

export default ChatHead;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    paddingVertical: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  itemTime: {
    fontSize: 12,
    color: '#b2b2b2',
  },
  itemLastMessage: {
    fontSize: 14,
    color: '#b2b2b2',
  },
});
