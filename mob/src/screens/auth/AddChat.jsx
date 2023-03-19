import React, {useState, useEffect} from 'react';
import Contacts from 'react-native-contacts';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Image
} from 'react-native';
import Meteor, {withTracker} from '@meteorrn/core';

const AddChat = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dBContacts, setdBContacts] = useState([]);
  let contactList = [];
  
  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        console.log('Permission: ', res);
        Contacts.getAll()
          .then(contacts => {
            // work with contacts
            // console.log(contacts[1]);
            const filteredContacts = contacts.filter(
              contact => contact.phoneNumbers.length > 0
            );
            console.log('filteredContacts: ', filteredContacts.length);
              filteredContacts.forEach(contact => {
                contact.phoneNumbers.forEach(phoneNumber => {
                  // console.log(phoneNumber.number);
                  // setContactList([...contactList,{formattedPhoneNumber: phoneNumber.number.replace(/[\s+91]/g, "")}]
                  //   )
                  if(phoneNumber.number){
                    const formattedPhoneNumber = "+91"+phoneNumber.number.replace(/[\s-]|(\+91)/g, "");
                      if(formattedPhoneNumber.length===13)
                      contactList = [
                        ...contactList,
                        {
                          formattedPhoneNumber ,
                        },
                      ];
                    }
                });
              });
              // console.log('contactList: ', contactList.find((contact)=> contact.formattedPhoneNumber==='+917012787119'));
              const uniqueContactList = contactList.filter(
                (item, index) => index === contactList.findIndex((i) => i.formattedPhoneNumber === item.formattedPhoneNumber)
                );
                console.log('uniqueContactList: ', uniqueContactList.find((contact)=> contact.formattedPhoneNumber==='+917012787119'));
              Meteor.call(
                'getContactList',
                {contacts: uniqueContactList},
                (error, result) => {
                  if (error) {
                    console.log('getContactList Error: ', error);
                  } else {
                    // console.log('result: ', result);
                    setdBContacts(result);
                    setSearchResults(uniqueContactList);
                  }
                },
              );
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  }, []);

  const handleSearch = text => {
    setSearchQuery(text);
    // const results = users.filter(
    //   (user) =>
    //     user.name.toLowerCase().includes(text.toLowerCase()) ||
    //     user.phone.includes(text)
    // );
    // console.log(text.length);
    if (text.length >= 10)
      Meteor.call('findUsers', {number: text}, (error, result) => {
        if (error) console.log(error);
        else {
          console.log(result);
          setSearchResults(result);
        }
      });
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
          recepient: {
            id: user.user,
            profile: {
              name: user.name,
              number: user.formattedPhoneNumber,
              image: user.picture,
            }
          },
        });
      }
    });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleStartChat(item)}>
      <Image
          source={{uri: item.picture?item.picture:'https://via.placeholder.com/150'}}
          style={styles.avatar}
        />
        <View style={{gap:2}}>
      <Text style={styles.resultName}>{item.name}</Text>
      <Text style={styles.resultPhone}>{item.formattedPhoneNumber}</Text>
        </View>
      <Text style={styles.resultButton}>Start Chat</Text>
    </TouchableOpacity>
  );

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
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={item => item.user}
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
});

export default AddChat;
