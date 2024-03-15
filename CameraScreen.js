import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Tesseract from 'tesseract.js';

const processImage = async (photo) => {
  try {
    const { data: { text } } = await Tesseract.recognize(photo.uri, 'bul', { // 'bul' for Bulgarian language
      tessedit_char_blacklist: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~', // Blacklist unwanted characters
    });
    console.log('Extracted text:', text);
    // Now you have the extracted text, you can pass it to the next screen or perform further processing
    navigation.navigate('Result', { extractedText: text }); // Navigate to ResultScreen and pass the extracted text
  } catch (error) {
    console.error('Error extracting text:', error);
  }
};

function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      processImage(photo); 
      // Process the captured image (e.g., text recognition)
      // Display results on another screen
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={(ref) => (cameraRef = ref)}>
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
          <Button
            title="Take Picture"
            onPress={takePicture}
          />
        </View>
      </Camera>
    </View>
  );
}

export default CameraScreen;
