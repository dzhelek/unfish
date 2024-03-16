import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ResultScreen = () => {
  const route = useRoute();
  const { result } = route.params;

  console.log('result: ' + result);

  return (
    <View>
      <Text>Наложена е глоба съгласно Закона за Движение по Пътищата, в който е регламентирано:</Text>
      <Text>{result}</Text>
      {/* Display other results or components as needed */}
    </View>
  );
};

export default ResultScreen;
