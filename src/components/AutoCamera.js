'use strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View , NetInfo , Alert
} from 'react-native';
import Camera from 'react-native-camera';
import Tts from 'react-native-tts';
import RNFS from 'react-native-fs';
import Loading from 'react-native-whc-loading';
import base64 from 'react-native-base64';
import RNFetchBlob from 'react-native-fetch-blob';
import { NetworkInfo } from 'react-native-network-info';

export default class AutoCamera extends Component {
    static navigationOptions = {
        headerStyle: { backgroundColor: 'red' },
        title: 'Welcome to LDS Login System'
    }

    hasConnection;
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
            cameraType: 'front',
            mirrorMode: false
            , showCamera: true
        };

        this.takePicture = this.takePicture.bind(this);

        NetInfo.isConnected.addEventListener('connectionChange', this.connectioChanged);
    }

    connectioChanged = (x) => { 
        if (x) {
          NetworkInfo.getSSID(ssid => {
     
            this.hasConnection = x;
            let timer = setInterval(() => { this.takePicture() }, 3000);
            this.setState({ timer });
            this.setState({ showCamera: true });
            Tts.speak("Point your face to camera to capture picture");
          });
        }
        else{
          this.hasConnection = false;
         // Alert.alert("Network Issue",'Check the network , please connect to office wifi')
          clearInterval(this.state.timer);
          this.setState({ showCamera: false });
            this.refs.loading.show(false);
        }
         }

    //camera;
    componentDidMount() {
        let timer = setInterval(() => { this.takePicture() }, 3000);
        this.setState({ timer });
        Tts.speak("Point your face to camera to capture picture");
    }
    componentWillUnmount() {
        clearInterval(this.state.timer);
        this.refs.camera = null;
        
    }



    takePicture = () => {
        // alert('Inside Take Picture')
        clearInterval(this.state.timer);
        const options = {};

        this.refs.camera.capture({ metadata: options })
            .then((data) => {
                this.setState({ showCamera: false });
                this.refs.loading.show();
                RNFS.readFile(data.path, 'base64')
                    .then(res => {
                        const url = `https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true`;
                        RNFetchBlob.fetch('POST', url, {
                            'Accept': 'application/json',
                            'Content-Type': 'application/octet-stream',
                            'Ocp-Apim-Subscription-Key': 'c7edd71eec1444d2a6008f7e004194d2'
                        }, res)
                            .then((res) => {
                                return res.json();
                            })
                            .then((json) => {
                                  
                                if (json.length) {
                                    //    alert(JSON.stringify(json));
                                    //    this.refs.loading.show(false);

                                    let faceIds = [];

                                    for (let index = 0; index < json.length; index++) {
                                        faceIds.push(json[index].faceId);

                                    }
                                   var obj ={
                                    "personGroupId": "volvo",
                                    "faceIds": faceIds
                                } 
                                    fetch('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/identify', {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                           'Content-Type':'application/json',
                                            'Ocp-Apim-Subscription-Key': 'c7edd71eec1444d2a6008f7e004194d2'
                                        },
                                        body: JSON.stringify( obj),
                                    })
                                        .then(res => res.json(),err => { this.refs.loading.show(false); alert(JSON.stringify(obj));})
                                        .then(res => {
                                            
                                            if (res.length) {
                                                
                                                    let personId = res[0].candidates[0].personId;
                                                    fetch('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/volvo/persons/' + personId, {
                                                        method: 'GET',
                                                        headers: {
                                                            Accept: 'application/json',
        
                                                            'Ocp-Apim-Subscription-Key': 'c7edd71eec1444d2a6008f7e004194d2'
                                                        }
                                                    }).then(res => res.json()).then(res => {
                                                        
                                                        this.refs.loading.show(false);
                                                        NetInfo.isConnected.removeEventListener("connectionChange",this.connectioChanged);
                                                        this.props.navigation.navigate({
                                                            routeName: 'JobList',
                                                            params: { personName: res.name, path: data.path, personId: personId }
                                                        });
                                                    })
                                                        ; 
                                               
                                                
                                            }
                                            else {
                                                alert("Sorry, I can't find you. Please point your face to camera to capture again");
                                               
                                                Tts.speak("Sorry, I can't find you. Please point your face to camera to capture again");
                                                let timer = setInterval(() => { this.takePicture() }, 3000);
                                                this.setState({ timer });
                                                this.setState({ showCamera: true })
                                                this.refs.loading.show(false);
                                            }
                                          
                                        },err => { this.refs.loading.show(false);}
                                        )
                                        .error(err => { this.refs.loading.show(false); })

                                } else {
                                    alert("Sorry, I can't see any faces in there.");
                                    Tts.speak("Sorry, I can't see any faces in there.");
                                    let timer = setInterval(() => { this.takePicture() }, 3000);
                                    this.setState({ timer });
                                    this.setState({ showCamera: true })
                                    this.refs.loading.show(false);
                                }

                                return json;
                            })
                            .catch(function (error) {
                                this.refs.camera = null;
                                // alert('Sorry, the request failed. Please try again.' + JSON.stringify(error));
                            });
                    })
            })
            .catch(err => { alert('Something went wrong,Please check the permissions'); this.refs.loading.show(false); });
    }
    renderCamera() {

        if (this.state.showCamera) {
            return (<Camera
                ref='camera'
                style={styles.preview}
                type={this.state.cameraType}
                mirrorImage={this.state.mirrorMode}
                aspect={Camera.constants.Aspect.fill}>

                {/* <Text ref='button' style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text> */}
            </Camera>)
        }
        else {
            return (<View></View>)
        }

    }

    render() {
        return (
            <View style={styles.container}>

                {this.renderCamera()}
                <Loading ref="loading" backgroundColor='#ffffffF2'
                    indicatorColor='red' />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});