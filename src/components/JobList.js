import React , {Component} from 'react';
import {View,TouchableHighlight,Image, ActivityIndicator,BackHandler , NetInfo } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text,Fab, Button, Left, Body, Right } from 'native-base';
import Tts from 'react-native-tts';
import Loading from 'react-native-whc-loading';
import Voice from 'react-native-voice';
import { NetworkInfo } from 'react-native-network-info';
export default class JobList extends Component{
    // static navigationOptions = {
    //     headerStyle: { backgroundColor: 'red'},
    //     title: 'Welcome ' 
    // }

    hasConnection;
    constructor(props)
    {
        super(props);
        this.state = {name : '',JobInfo:[],loading:false,existingLogin:false,personId:''}
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
    this.hasConnection = true;
    NetInfo.isConnected.addEventListener('connectionChange', (x) => { 
      if (x) {
        NetworkInfo.getSSID(ssid => {
   
          this.hasConnection = x;
         
        });
      }
      else{
        this.hasConnection = false;
        
        Tts.speak('OOPS ,Check the network , please connect to office wifi')
       
      }
       });

    }

    getJobInfo(personId,logMessage,logOut){
    
        this.setState({JobInfo:[], loading: true,refreshing: true});
        fetch('http://buffermanagemetapi.azurewebsites.net/api/JobDatas/'+personId)
        .then((response) => response.json())
        .then((res) => { 
            let loginStatus =  res.filter(function(item){
                return item.LoginStatus == true;
             });
          this.setState({JobInfo: res,refreshing:false, loading: false,existingLogin:loginStatus.length});

        this.refs.loading.show(false); 
             if (logOut) {
                 Tts.speak(logMessage);
             }
        })
        .catch(err => {
         Tts.speak('Some thing went wrong, please check your internet connectivity and try again');
        })
      }

      updateJobInfo(jobId,jobstatus){
       if (this.hasConnection) {
        fetch('http://buffermanagemetapi.azurewebsites.net/api/JobDatas/'+jobId,{
          method: 'PUT'})
      .then((response) => response.json())
      .then((res) => { 
          this.getJobInfo(this.state.personId,jobstatus ? 'Job Logged out successfully' : 'Job Logged in successfully',true);    
      })
      .catch(err => {
        Tts.speak('Some thing went wrong, please check your internet connectivity and try again');
      })
       }
       else{
         this.refs.loading.show(false);
         Tts.speak( "Opps Looks like your device is not connected to internet , Please check the network connectivity")
       }
      }

      handleBackButtonClick() {
        this.props.navigation.goBack('Home');
        return true;
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        Voice.destroy().then(Voice.removeAllListeners);
        NetInfo.isConnected.removeEventListener("connectionChange",this.connectioChanged);
    }
    //camera;
    componentDidMount() {
        const user = this.props.navigation.state.params;
        this.setState({name : user.personName,personId:user.personId});
       
          this.getJobInfo(user.personId,'',false);
          Tts.speak("Welcome "+ user.personName);
       
        
       
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
      
        var number = parseInt(e.value, 10);

        alert(number);
        
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

      renderLogInIcon(status)
      {
         return status ? <Icon color={'red'} size={32} name="logout" /> : null
      }

    render(){
        const user = this.props.navigation.state.params;
        if (this.state.loading) {
            return    <Loading  backgroundColor='#ffffffF2'
            indicatorColor='red'/>
        }
        return(
        <Content style={{flex:1}}>
            
            <Image resizeMode="contain" style={{ height:300}} source={{uri:user.path}} />
            
             {this.state.JobInfo.map((job) => (
                 <TouchableHighlight  onPress={() => {
                        if (! job.LoginStatus && ! this.state.existingLogin) {
                            this.refs.loading.show();
                            this.updateJobInfo(job.JobID,job.LoginStatus);
                            
                        }
                        else if(job.LoginStatus)
                        {
                            this.refs.loading.show();
                            this.updateJobInfo(job.JobID,job.LoginStatus);
                            
                        }
                        else{
                            Tts.speak("Please logout from other logged in job before logging in to the current job");
                        }
                      
                    }}
                      >
                <Card >
                <CardItem>
                  <Left>
                  <TouchableHighlight  onPress={() =>  Tts.speak(job.JobName)}>
                         <Thumbnail  square source={require('../Images/button.png')} />
                        </TouchableHighlight>
                   
                    <Body>
                      <Text> Job Name : {job.JobName}</Text>
                      <Text note>Job Id : {job.JobID}</Text>
                    </Body>
                  </Left>
                 
                  <Right >
               
                     {this.renderLogInIcon(job.LoginStatus)}
                
                 
                      </Right>
                </CardItem>
              
               
              </Card>
              </TouchableHighlight>
              ))}
         
         
          
          
      <Loading ref="loading" backgroundColor='#ffffffF2'
                    indicatorColor='red'/>
     
      <Fab
        
        style={{ backgroundColor: 'red' }}
        position="bottomRight"
        onPress={this._startRecognizing.bind(this)}>
        <Icon name="microphone" />
        
      </Fab>
        </Content>
        
        )
    }
}