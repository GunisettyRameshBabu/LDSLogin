import React, { Component } from 'react';
import { WebView , ActivityIndicator ,View, StyleSheet , Platform , TouchableOpacity,Text } from 'react-native';

export default class ChatBot extends Component {

  constructor(props) {
    super(props);
    this.state = {
            canGoBack: false
            }
  }
  WEBVIEW_REF;

//   constructor(props) {
//     super(props);
//     this.state = {
//       canGoBack: false
//       }
// }

onNavigationStateChange(navState)
{
  //this.setState({canGoBack:navState.canGoBack});
}

onBack()
{
  this.refs[this.WEBVIEW_REF].goBack();
}

  ActivityIndicatorLoadingView() {
    
    return (
 
      <ActivityIndicator
        color='red'
        size='large'
        style={styles.ActivityIndicatorStyle}
      />
    );
  }

  render() {

 var url = 'https://webchat.botframework.com/embed/VolvoRnDChatBot?s=qhyTw2zLy5Q.cwA.mDQ.3Vw3KmkSsVpNE6cJfsNICzPdHDlOY-9biyIDk7PrqOo';
 
 return (
     <View style={{flex:1}}>
      <WebView
        source={{uri: url}}
        style={styles.WebViewStyle}
         ref={this.WEBVIEW_REF}
         
        javaScriptEnabled={true}
         domStorageEnabled={true}
        
         renderLoading={this.ActivityIndicatorLoadingView} 
         startInLoadingState={true}  
      />
        </View>
    );
  }
}

const styles = StyleSheet.create(
  {
   
  WebViewStyle:
  {
     justifyContent: 'center',
     alignItems: 'center',
     flex:1,
     marginTop:  0
  },
   
  ActivityIndicatorStyle:{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    
  }
  });