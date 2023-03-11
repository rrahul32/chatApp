import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const ChatWindowHeader = ({ name, avatar }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image style={styles.avatar} source={{ uri: avatar }} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <TouchableOpacity style={styles.rightContainer}>
        <Icon name='options-outline'/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#666',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatWindowHeader;
