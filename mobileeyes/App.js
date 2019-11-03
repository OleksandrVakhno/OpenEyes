import React from 'react';
import { StyleSheet, 
          Text,   
          View, 
          TouchableOpacity, 
          TouchableHighlight,
          Dimensions, } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Speech from 'expo-speech';

const { manifest } = Constants;


export default class Main extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  speak(thingToSay) {
    Speech.speak(thingToSay);
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    this.speak("Welcome to Open Eyes!");
    this.speak("Place your camera in front of an object, then tap the screen for a description.");
  }

  //async method to snap image
  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();

      const url = `http://${manifest.debuggerHost.split(':').shift()}:5000/api/process_image`;

      Speech.stop();
      this.speak("Processing");

      const data = new FormData();
      data.append('name', 'testName'); // you can append anyone.
      data.append('file', {
        uri: photo.uri,
        type: 'image/jpeg', // or photo.type
        name: 'testPhotoName'
      });

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data
      }).then(res => res.json())
      .then(res => {
        this.speak(res.data);
      }).catch((error)=>{
        alert(error.message);
      });
        
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => {this.camera = ref;}}>
            <View
              style={styles.container}>
              <TouchableHighlight
                style={styles.button}
                onPress={() => {
                  this.snap();
                }}>
                <Text style={styles.circle}> </Text>
              </TouchableHighlight>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({

    container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      flexDirection: 'row',
    },
    button:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor:'transparent',
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text:{
      fontSize: 18, 
      marginBottom: 10, 
      fontWeight: 'bold',
      color: 'white' 
    },
    circle: {
      fontSize: 20,
      color: 'black',
   }

});
