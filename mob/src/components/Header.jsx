import { View, Text, Image, StyleSheet, TextInput } from 'react-native'
import React from 'react'

const Header = ({title,imageUrl}) => {
  return (
    <View style={styles.header}>
        <View style={styles.leftContainer}>
        <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.middleContainer}>
        <TextInput
          placeholder="Search for chats"
          style={styles.searchInput}
          placeholderTextColor="#9e9e9e"
        />
      </View>
      <View style={styles.rightContainer}>
        <Image source={{ uri: imageUrl }} style={styles.avatar} />
      </View>
      </View>
  )
}

const styles = StyleSheet.create({
    header: {
        height: 80,
        backgroundColor: '#1C1C1C',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      avatar: {
        width: 30,
        height: 30,
        borderRadius: 30,
        marginRight: 10,
      },
      title: {
        fontSize: 20,
      },
      leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
      },
      middleContainer: {
        flex: 4,
        alignItems: 'center',
      },
      rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
      },
      searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '100%',
        height: 40,
        color: 'white',
      },
});

export default Header