import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const ChatHead = ({lastMessage, recepient}) => {
  return (
      <View style={styles.item}>
        <Image
          source={{uri: recepient.profile.image?recepient.profile.image.url:'https://via.placeholder.com/150'}}
          style={styles.avatar}
        />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{recepient.profile.name}</Text>
            <Text style={styles.itemTime}>
              {lastMessage?lastMessage.createdAt.toLocaleDateString('en-US', {
                day: '2-digit',
                weekday: 'short',
              }):''}
            </Text>
          </View>
          {
            lastMessage?
            <Text style={styles.itemLastMessage} numberOfLines={1} >{lastMessage.text}</Text>
            : <Text style={{color: '#349ad7'}}>Start Chat</Text>
          }
        </View>
      </View>
  );
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
