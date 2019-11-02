import React from 'react';
import { StyleSheet, 
          Text,   
          View, 
          TouchableOpacity, 
          TouchableHighlight,
          Dimensions, } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

export default class Main extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  //async method to snap image
  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();

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
                <Text style={styles.circle}> Snap </Text>
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
      borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').width * 0.3,
        backgroundColor:'#66cccc',
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
