import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AppRegistry,
  TouchableHighlight, TouchableOpacity ,
  NetInfo , Alert
} from 'react-native';

import { NetworkInfo } from 'react-native-network-info';


import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
export default class VoiceTest extends Component {
    static navigationOptions = {
        header: null
    }

  hasConnection;
  

  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);

    NetInfo.isConnected.addEventListener('connectionChange', (x) => { 
      if (x) {
        NetworkInfo.getSSID(ssid => {
   
          // if (ssid === "AndroidAP") {
          //   this.hasConnection = true;
          // }

          this.hasConnection = x;
         
        });
      }
      else{
        this.hasConnection = false;
        Alert.alert("Network Issue",'Check the network , please connect to office wifi')
       
      }
       });
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    NetInfo.isConnected.removeEventListener("connectionChange",() => {});
  }

  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  onSpeechEnd(e) {
    this.setState({
      end: '√',
    });
  }

  onSpeechError(e) {
    this.setState({
      error: JSON.stringify(e.error),
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value,
    });
   let res = this.state.partialResults.filter(x => x == "login");

     if (res.length > 0) {
        this.props.navigation.navigate({ routeName: 'Camera' });
     }
     else
     {
       // this.img.props.onPress(this);

     //  Tts.speak('Sorry, Invalid key word');
     }
    
    
  }

  onSpeechVolumeChanged(e) {
    this.setState({
      pitch: e.value,
    });
  }

  async _startRecognizing(e) {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  async _cancelRecognizing(e) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

  async _destroyRecognizer(e) {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
    });
  }

  

  render() {
    return (
        <View style={styles.container}>
        <Text style={styles.textSize}>Welcome to LDS Login System</Text>
        <Image resizeMode="contain" style={styles.logo} source={require('../Images/Volvo.png')} />
       
        <TouchableOpacity style={styles.SubmitButtonStyle} onPress={() => { if (this.hasConnection) {
          this.props.navigation.navigate({ routeName: 'Camera' });
        } else  { Alert.alert("Network Issue",'Check the network , please connect to office wifi') } }}>
                    <Text style={styles.TextStyle}>Login</Text>
                     </TouchableOpacity>
                 <TouchableHighlight ref={img => this.img = img} onPress={this._startRecognizing.bind(this)}>
      <Image 
        style={styles.button}
        source={require('../Images/button.png')}
      />
    </TouchableHighlight>
                  {this.state.partialResults.map((result, index) => {
      return (
        <Text
          key={`partial-result-${index}`}
          style={styles.stat}>
          {result}
        </Text>
      )
    })}
        </View>
    );
  }
}

const styles = StyleSheet.create({
    logo: {
           
        width: 300,
        height: 100
    },
  button: {
    width: 50,
    height: 50,
  },
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
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  SubmitButtonStyle: {

    marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
    backgroundColor:'red',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    width : 100
  },
  TextStyle:{
    color:'#fff',
    textAlign:'center',
},
});