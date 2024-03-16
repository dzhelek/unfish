import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {findCitedArticles, findArticleText, simplify, roadTrafficActUrl} from "./simplifyLaw";
import lawFile from './law.json';

const ResultScreen = () => {
  const route = useRoute();
  const { extractedText } = route.params;

  let citedArticlesArray = findCitedArticles(extractedText);
  // let lawText = getLawText(roadTrafficActUrl);
  let allSimplifiedTexts = "";

  for (const article of citedArticlesArray) {
    console.log('article: ' + article);
    const articleText = (lawFile.find((item) => item.articleId === article)).text;
    const simplifiedText = simplify(articleText);

    simplifiedText.then((value) => {
      console.log('simplifiedText value (openai): ' + value);
      allSimplifiedTexts += value + "\n\n";
      console.log('allSimplifiedText: ' + value);
    })
  }

  return (
    <View>
      <Text>{allSimplifiedTexts}</Text>
      {/* Display other results or components as needed */}
    </View>
  );
};

export default ResultScreen;
