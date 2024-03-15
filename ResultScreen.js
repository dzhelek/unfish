import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {findCitedArticles, getLawText, findArticleText,
  simplify, roadTrafficActUrl} from "./simplifyLaw";

const ResultScreen = () => {
  const route = useRoute();
  const { extractedText } = route.params;

  let citedArticlesArray = findCitedArticles(extractedText);
  let lawText = getLawText(roadTrafficActUrl);
  let allSimplifiedTexts = "";

  lawText.then((fullLawText) => {
    for (const article of citedArticlesArray) {
      const articleText = findArticleText(fullLawText, article.articleId);
      const simplifiedText = simplify(articleText);
      allSimplifiedTexts += simplifiedText + "\n\n";
      console.log(simplifiedText);
    }
  })


  return (
    <View>
      <Text>{allSimplifiedTexts}</Text>
      {/* Display other results or components as needed */}
    </View>
  );
};

export default ResultScreen;
