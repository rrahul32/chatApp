import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '@meteorrn/core';

const ProfileUpdate = ({navigation}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://via.placeholder.com/150');

  const handleUpdate = () => {
    // handle updating user profile data
    console.log("🚀 ~ file: profileUpdate.jsx:13 ~ handleUpdate ~ setName:", name);
    Meteor.call("updateProfileDetails", {
        name: name
    }, (error) => {
        if (error) {
            alert(error.reason);
        } else {
            alert("Profile updated successfully");
            navigation.navigate('Home');
        }
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageWrapper} onPress={() => console.log('change image')}>
        <Image style={styles.image} source={{ uri: image }} />
        <View style={styles.editIconWrapper}>
            <Icon style={styles.editIcon} name='edit'/>
        </View>
      </TouchableOpacity>
      <Text style={styles.heading}>Edit Profile</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={text => setName(text)}
          placeholder="Enter your name"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 0,
  },
  editIcon: {
    width: 20,
    height: 20,
    flex: 1
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#1e88e5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ProfileUpdate;
