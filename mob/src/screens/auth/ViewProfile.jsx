import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {withTracker} from '@meteorrn/core';

const ViewProfile = ({user, navigation}) => {
  return (
    <View style={styles.container}>
        <Image style={styles.image} source={{uri: user.profile && user.profile.image?user.profile.image.url:'https://via.placeholder.com/150'}} />
        <Text style={styles.label}>{user.profile.name}</Text>
        <Text style={styles.number}>{user.profile.number}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',

  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#000',
    fontSize: 20
  },
  number: {
    marginBottom: 5,
    fontWeight: 'light',
    color: '#666',
    fontSize: 18,
    fontStyle: 'italic'
  },
});

// export default EditProfile;
export default withTracker(({navigation, route}) => {
  const user = route.params.user;
  return {user, navigation};
})(ViewProfile);

