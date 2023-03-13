import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Meteor from '@meteorrn/core';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageEditor from '@react-native-community/image-editor';

const ProfileUpdate = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://via.placeholder.com/150');
  // const [image, setImage] = useState('"file://'+RNFS.DocumentDirectoryPath + '/profile.jpg');

  const handleUpdate = () => {
    // handle updating user profile data
    console.log(
      '🚀 ~ file: profileUpdate.jsx:13 ~ handleUpdate ~ setName:',
      name,
    );
    Meteor.call(
      'updateProfileDetails',
      {
        name: name,
        profilePic: image,
      },
      error => {
        if (error) {
          alert(error.reason);
        } else {
          alert('Profile updated successfully');
          // navigation.navigate('Home');
        }
      },
    );
  };

  const handleImageChange = () => {
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    // console.log(ImagePicker)
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {
          uri: response.assets[0].uri,
          height: response.assets[0].height,
          width: response.assets[0].width,
        };

        const cropData = {
          offset: {x: 0, y: 0},
          size: {width: source.width, height: source.height},
          displaySize: {width: 300, height: 300},
        };
        // console.log('ImageEditor: ', ImageEditor);

        ImageEditor.cropImage(source.uri, cropData).then(url => {
          if(url)
          {
            // console.log('Cropped image uri', url);
            setImage(url);
            Meteor.call()
          }

        });

      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageWrapper} onPress={handleImageChange}>
        <Image style={styles.image} source={{uri: image}} />
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
