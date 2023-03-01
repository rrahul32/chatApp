import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react';
import Icon from 'react-native-ionicons';


const ChatHead = ({item}) => {
  return (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
        <Text style={styles.itemLastMessage} numberOfLines={1} >{item.lastMessage}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={20} color="#b2b2b2" />
    </View>
  )
}

export default ChatHead

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
})