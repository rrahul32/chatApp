import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Meteor, {withTracker, Mongo} from '@meteorrn/core';
import ChatHead from '../../components/ChatHead';
import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Chat = new Mongo.Collection('chat');
const ChatMessages = new Mongo.Collection('chatMessages');

function Home({ready, chatData, chatMessages, users, navigation}) {
  const [searchResults, setSearchResults] = useState([]);
  const [dBContacts, setdBContacts] = useState([]);
  
  let formattedContactList = [];
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
              contact =>
                contact.phoneNumbers.length > 0 &&
                /^[a-zA-Z]/.test(contact.displayName),
            );
            // console.log('filteredContacts: ', filteredContacts[0]);
            filteredContacts.forEach(contact => {
              contact.phoneNumbers.forEach(phoneNumber => {
                // console.log(phoneNumber.number);
                // setContactList([...contactList,{formattedPhoneNumber: phoneNumber.number.replace(/[\s+91]/g, "")}]
                //   )
                if (phoneNumber.number) {
                  const formattedPhoneNumber =
                    '+91' + phoneNumber.number.replace(/[\s-]|(\+91)/g, '');
                  if (formattedPhoneNumber.length === 13)
                    contactList = [
                      ...contactList,
                      {
                        name: contact.displayName,
                        formattedPhoneNumber: formattedPhoneNumber,
                      },
                    ].sort((a, b) => {
                      if (a.name < b.name) {
                        return -1;
                      }
                      if (a.name > b.name) {
                        return 1;
                      }
                      return 0;
                    });
                  formattedContactList = [
                    ...formattedContactList,
                    {
                      formattedPhoneNumber,
                    },
                  ];
                }
              });
            });
            // console.log('contactList: ', contactList.find((contact)=> contact.formattedPhoneNumber==='+917012787119'));
            const uniqueFormattedContactList = formattedContactList.filter(
              (item, index) =>
                index ===
                formattedContactList.findIndex(
                  i => i.formattedPhoneNumber === item.formattedPhoneNumber,
                ),
            );
            const uniqueContactList = contactList.filter(
              (item, index) =>
                index ===
                contactList.findIndex(
                  i => i.formattedPhoneNumber === item.formattedPhoneNumber,
                ),
            );
            // console.log('uniqueContactList: ', uniqueContactList.find((contact)=> contact.formattedPhoneNumber==='+917012787119'));
            Meteor.call(
              'getContactList',
              {contacts: uniqueFormattedContactList},
              (error, result) => {
                if (error) {
                  console.log('getContactList Error: ', error);
                } else {
                  console.log('result: ', result);
                  setdBContacts(
                    result.sort((a, b) => {
                      if (a.name < b.name) {
                        return -1;
                      }
                      if (a.name > b.name) {
                        return 1;
                      }
                      return 0;
                    }),
                  );
                  const mappedResults = result.map(
                    contact => contact.formattedPhoneNumber,
                  );
                  setSearchResults(
                    uniqueContactList.filter(
                      contact =>
                        !mappedResults.includes(contact.formattedPhoneNumber),
                    ),
                  );
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

  if (!ready) return;

  const renderItem = ({item}) => {
    //
    const currentChatMessages = chatMessages.filter(
      message => message.chatId === item._id,
    );

    const recepient = item.participants
      .filter(participant => participant.id != Meteor.user()._id)
      .map(rece => users.find(user => user._id == rece.id))[0];

    return (
      <TouchableOpacity
        onPress={() => {
          //
          navigation.navigate('Chat Window', {
            chatId: item._id,
            recepientId: recepient._id,
          });
        }}>
        <ChatHead lastMessage={currentChatMessages[0]} recepient={recepient} />
      </TouchableOpacity>
    );
  };

  if (chatData.length === 0)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Chats Found!!!</Text>
        <View style={{position: 'absolute', bottom: 20, right: 20}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Add Chat',{contacts: [...dBContacts,...searchResults]});
            }}>
            <Icon name="add-circle-outline" size={50} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <FlatList
        data={chatData}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        style={styles.list}
        // ListFooterComponent={renderListFooter}
        // ListFooterComponentStyle={{ position: 'absolute', bottom: 20, right: 20 }}
      />
      <View style={{position: 'absolute', bottom: 20, right: 20}}>
        {/* <TouchableOpacity
          style={{
            backgroundColor: 'green',
            borderRadius: 25,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'black', fontSize: 30}}>+</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Add Chat', {contacts: [...dBContacts,...searchResults]});
          }}>
          <Icon name="add-circle-outline" size={50} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  text: {
    color: '#666',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default withTracker(() => {
  // Subscribe to the chat publication
  const handle = Meteor.subscribe('chat');
  // Check if the subscription is ready
  const ready = handle.ready();

  // // Get the chat data
  const chatData = Chat.find().fetch();
  //

  // // Get the chat message data
  const chatMessages = ChatMessages.find({}, {sort: {createdAt: -1}}).fetch();
  //

  // // Get the user data
  const users = Meteor.users.find().fetch();
  // console.log('users: ', users);

  const settings = new Mongo.Collection('userSettings');

  // console.log('settings: ', settings.find().fetch());

  // Return the data as props to the component
  return {
    ready,
    chatData,
    chatMessages,
    users,
  };
})(Home);
