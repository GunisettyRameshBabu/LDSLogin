/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
// import CamImage from './src/components/Camera';

import AppNavigator from './src/components/route';
import ChatBot from './src/components/ChatBot';

export default class App extends Component {
  constructor()
  {
    super();
    console.disableYellowBox = true;
  }
  render() {
    return (
     <AppNavigator/>
      // <ChatBot></ChatBot>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
