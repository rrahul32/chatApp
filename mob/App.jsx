/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Meteor, { Mongo, withTracker } from '@meteorrn/core';
// import React from 'react';
// import {
//   Text,
//   View,
//   ScrollView,
//   TextInput,
//   Button
// } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
//import { Auth } from 'aws-amplify'; // or use any other library for OTP verification


Meteor.connect("ws://10.0.0.24:3000/websocket");

export default function App(){
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const handleSendOtp = () => {
    Meteor.call('phone.verify', phoneNumber, (error) => {
      if (error) {
        alert(error.error);
      } else {
        // console.log("true");
        Meteor.call('otp.send', (error) => {
          if (error) {
            alert(error.error);
          } else {
            // console.log("true");
            setShowOtpInput(true);
          }
        });

      }
    });

  }

  const handleLogin = () => {
    Meteor.call('otp.verify', otp, (err, data) => {
      if(err)
      {
       alert(err.error)
      }
      else{
        if(data)
        {
          alert("Success");
        }
        else
        {
          alert("Failed");
        }
      }
    });
      

    // Here you can implement your logic to verify the OTP and login the user
    // try {
    //   await Auth.confirmSignIn(otp);
    //   console.log('User is logged in');
    //   // Navigate to the home screen or the next screen after login
    // } catch (error) {
    //   console.log('Error verifying OTP: ', error);
    // }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        onChangeText={text => setPhoneNumber(text)}
        value={phoneNumber}
      />
      {!showOtpInput && (
        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      )}
      {showOtpInput && (
        <>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            keyboardType="numeric"
            onChangeText={text => setOtp(text)}
            value={otp}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#000'
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});