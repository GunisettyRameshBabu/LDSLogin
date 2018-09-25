import React , {Component} from 'react';
import {Text,View,TouchableOpacity,StyleSheet,Image, TouchableHighlight} from 'react-native';
import Voice from 'react-native-voice';
export default class Home extends Component
{
    static navigationOptions = {
        header: null
    }
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
      }
    
      componentDidMount()
      {
         Voice.start('en-US');
      }
      componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    
      onSpeechStart(e) {
       
      }
    
      onSpeechRecognized(e) {
       
      }
    
      onSpeechEnd(e) {
       
      }
    
      onSpeechError(e) {
        alert(JSON.stringify(e.error));
      }
    
      onSpeechResults(e) {
        alert( e.value);
         Voice.start('en-US');
      }
    
      onSpeechPartialResults(e) {
        this.setState({
            partialResults: e.value,
          });
        Voice.start('en-US');
      }
    
      onSpeechVolumeChanged(e) {
        
      }
    
      async _startRecognizing(e) {
        
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
    onPress(){
        this.props.navigation.navigate({ routeName: 'Voice' });
    }
    render(){
        return(
            <View style={styles.container}>
            <Text style={styles.textSize}>Welcome to LDS Login System</Text>
            <Image resizeMode="contain" style={styles.logo} source={require('../Images/Volvo.png')} />
           
                <TouchableOpacity style={styles.SubmitButtonStyle} onPress={() => this.onPress()}>
                    <Text style={styles.TextStyle}>Login</Text>
                     </TouchableOpacity>
                     <TouchableHighlight onPress={this._startRecognizing.bind(this)}>
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
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10 ,
        backgroundColor:'transparent',
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
    logo: {
           
        width: 300,
        height: 100
    },
    })