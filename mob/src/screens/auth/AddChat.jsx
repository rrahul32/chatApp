import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Share
} from 'react-native';
import Meteor from '@meteorrn/core';
import { SERVER_URL } from '../../App';

const AddChat = ({navigation,route}) => {
  // console.log("route: ", route)
  const [contacts, setContacts] = useState([])
  useEffect(() => {
    const contactList = route.params.contacts;
    setContacts(contactList);
  }, [route.params.contacts])
  

  const [searchQuery, setSearchQuery] = useState('');
  const [findResults, setFindResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  

  const handleSearch = text => {
    setSearchQuery(text);
    if (text.length > 0)
    {
      text=text.toLowerCase();
      setIsSearching(true);
        // const fromDB=dBContacts.filter((contact)=> contact.name.toLowerCase().includes(text) || contact.formattedPhoneNumber.includes(text));
        // const fromLocal=searchResults.filter((contact)=> contact.name.toLowerCase().includes(text) || contact.formattedPhoneNumber.includes(text));
        // setFindResults([...fromDB,...fromLocal]);
        setFindResults(contacts.filter((contact)=> contact.name.toLowerCase().includes(text) || contact.formattedPhoneNumber.includes(text)));
    }
    else
    setIsSearching(false);
  };

  const handleStartChat = user => {
    // Code to start chat with user
    console.log('Starting chat with user:', user.name);

    Meteor.call('createChat', {userId: user.user}, (error, result) => {
      if (error) console.log(error);
      else {
        console.log(result);
        navigation.navigate('Chat Window', {
          chatId: result,
          recepientId: user.user,
        });
      }
    });
  };

  const renderItem = ({item}) => {
    // console.log(item)
    if(item.user)
      return(
        <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleStartChat(item)}>
      <Image
          source={{uri: item.picture?item.picture.replace(/http:\/\/.*?\/cdn/,`http://${SERVER_URL}/cdn`):'https://via.placeholder.com/150'}}
          style={styles.avatar}
          />
        <View style={styles.detail}>
      <Text style={styles.resultName}>{item.name}</Text>
      <Text style={styles.resultPhone}>{item.formattedPhoneNumber}</Text>
        </View>
      <Text style={styles.resultButton}>Start Chat</Text>
      </TouchableOpacity>
          )
    else
    return(
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() =>{
         Share.share({
          message: `Hey ${item.name},\nConnect with you friend ${Meteor.user().profile.name} on the Chat App`,
        })
          .then(result => console.log(result))
          .catch(error => console.log(error));
        }}
        >
      <Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.avatar}
          />
        <View style={styles.detail}>
      <Text style={styles.resultName}>{item.name}</Text>
      <Text style={styles.resultPhone}>{item.formattedPhoneNumber}</Text>
        </View>
      <Text style={styles.resultButton}>Invite</Text>
      </TouchableOpacity>
    )
    };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for users..."
        placeholderTextColor={'#666'}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={isSearching?findResults:contacts}
        renderItem={renderItem}
        keyExtractor={item => item.formattedPhoneNumber}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    color: '#333',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  resultName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  resultPhone: {
    fontSize: 16,
    color: '#999',
    marginRight: 10,
  },
  resultButton: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  detail: {
    alignItems: 'center',

  }
});

export default AddChat;
