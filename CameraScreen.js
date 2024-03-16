import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import {findCitedArticles, findArticleText, simplify, roadTrafficActUrl} from "./simplifyLaw";
import lawFile from './law.json';

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
      return extractedText;
      // Now you have the extracted text, you can pass it to the next screen or perform further processing
    } else {
      throw new Error('No text found in the image.');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
  }
};



function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const computeResults = async(extractedText) => {
    let citedArticlesArray = findCitedArticles(extractedText);
    // let lawText = getLawText(roadTrafficActUrl);
    let allSimplifiedTexts = "";

    for (const article of citedArticlesArray) {
      console.log('article: ' + article);
      const articleText = (lawFile.find((item) => item.articleId === article)).text;
      const simplifiedText = await simplify(articleText);

        console.log('simplifiedText value (openai): ' +simplifiedText);
        allSimplifiedTexts += simplifiedText+ "\n\n";
        console.log('accumulating: ' + allSimplifiedTexts);
      
    }
      return allSimplifiedTexts;
}

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      // Process the captured image (e.g., text recognition)
      const text = await processImage(photo); 
      console.log('Extracted text:', text);
      // Display results on another screen
      const results = await computeResults(text);
      console.log("before sending: " + results);
      navigation.navigate('Result', {result: results}); // Navigate to ResultScreen and pass the extracted text
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
