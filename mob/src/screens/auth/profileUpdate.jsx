import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '@meteorrn/core';
import ImagePicker from 'react-native-image-crop-picker';


const ProfileUpdate = () => {
  // console.log(Meteor.user());
  const [name, setName] = useState('');
  const [imageURI, setImageURI] = useState('https://via.placeholder.com/150');
  const [image, setImage] = useState({});

  const handleUpdate = () => {
    // handle updating user profile data
    if (name == null || name == '') {
      alert('Please enter your name.');
      return;
    }
    console.log(
      '🚀 ~ file: profileUpdate.jsx:13 ~ handleUpdate ~ setName:',
      name,
    );
    if (image != {}){
      Meteor.call(
        'uploadProfileImage',
        {image: image.data, type: image.mime},
        error => {
          if (error) {
            console.log(error);
          } else {
            console.log('upload successful');
          }
        },
      );
    }
    Meteor.call(
      'updateProfileDetails',
      {
        name: name,
      },
      error => {
        if (error) {
          alert(error.reason);
        } else {
          alert('Profile updated successfully');
        }
      },
    );
  };

  const handleImageChange = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true
    }).then(image => {
      // console.log(image);
      setImageURI(`data:${image.mime};base64,${image.data}`);
      setImage(image);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageWrapper} onPress={handleImageChange}>
        <Image style={styles.image} source={{uri: imageURI}} />
        <View style={styles.editIconWrapper}>
          <Icon style={styles.editIcon} name="edit" />
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
          placeholderTextColor={'#666'}
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
    flex: 1,
    color: 'black',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: 'black',
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
