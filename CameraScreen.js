import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

import axios from 'axios';

const processImage = async (photo) => {
  try {
    // Encode the image to base64 format
    let base64Image = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });

    // Make a POST request to Google Cloud Vision API
    const response = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.EXPO_PUBLIC_GOOGLE_KEY}`, {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION', // Perform text detection
            },
          ],
          imageContext: {
            languageHints: ['bg'], // Specify Bulgarian language
          },
        },
      ],
    });

    // Extract text from the response
    const textAnnotations = response.data.responses[0].textAnnotations;
    if (textAnnotations && textAnnotations.length > 0) {
      const extractedText = textAnnotations[0].description;
      console.log('Extracted text:', extractedText);
      // Now you have the extracted text, you can pass it to the next screen or perform further processing
    } else {
      throw new Error('No text found in the image.');
    }
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
      // Process the captured image (e.g., text recognition)
      processImage(photo); 
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
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'column' }}>
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
