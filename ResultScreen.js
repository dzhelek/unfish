import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ResultScreen = () => {
  const route = useRoute();
  const { extractedText } = route.params;

  return (
    <View>
      <Text>{extractedText}</Text>
      {/* Display other results or components as needed */}
    </View>
  );
};

export default ResultScreen;
