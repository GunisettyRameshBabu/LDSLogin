import { StackNavigator } from "react-navigation";
import React from 'react';
import{TouchableOpacity,Text} from 'react-native';

import Home from './Home';
import AutoCamera from './AutoCamera';
import VoiceTest from './Voice';
import CamImage from './Camera';
import JobList from './JobList';
var RNFS = require('react-native-fs');
const AppNavigator = StackNavigator(
  {
    Home: { screen: VoiceTest },
    Camera: { screen: AutoCamera },
    Voice :{screen :VoiceTest } ,
    JobList : {screen : JobList , navigationOptions: ({ navigation }) => ({
          title: ` Welcome ${navigation.state.params.personName.toUpperCase()} `,
          headerStyle: { backgroundColor: 'red'},
          headerRight: (
            <TouchableOpacity
              onPress={
               () => {
                 
                const filePath = navigation.state.params.path.split('///').pop()  // removes leading file:///

RNFS.exists(filePath)
  .then((res) => {
    if (res) {
      RNFS.unlink(filePath)
        .then(() => navigation.navigate("Home") )
    }
  }) 

               
                } } >
            <Text  style={{fontSize: 18, fontWeight: '600', color: "#fff", paddingRight:20}}>Logout</Text>
            </TouchableOpacity>
          )
      }),}
  }
);

export default AppNavigator