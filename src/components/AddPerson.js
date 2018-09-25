import React from 'react';
import {View ,Text} from 'react-native';

export default class AddPerson extends Component{

    add()
    {
        const data = new FormData();
data.append('name', 'testName'); // you can append anyone.
data.append('photo', {
  uri: photo.uri,
  type: 'image/jpeg', // or photo.type
  name: 'testPhotoName'
});
fetch(url, {
  method: 'post',
  body: data
}).then(res => {
  console.log(res)
});
    }
    
    render(){
        return(
            <View></View>
        )
    }
}
