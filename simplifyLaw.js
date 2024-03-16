const axios = require("axios");
const cheerio = require("cheerio");
const openai = require("openai")
// require('dotenv').config();
const lawFile = require('./law.json');

// URL of the page we want to scrape
export const roadTrafficActUrl = "https://lex.bg/mobile/ldoc/2134649345";

/**
 * @param   url     Link to the official legal gate containing the law
 * @returns {Promise<[{paragraph: string, num: number}]>}
 * Scrapes the official legal gate containing the given law, and stores all articles
 * with their paragraphs in the articles[] array.
 */
async function getLawText(url) {
    try {
        // Fetch HTML of the page we want to scrape
        let { data } = await axios.get(url);

        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        // Select all the list items in Article class
        const listItems = $(".Article");

        // Stores data for all articles
        const articles = [{ article: 0, text: "" }];

        // Use .each method to loop through the li we selected
        listItems.each((idx, el) => {
            // Object holding data for each law article
            const article = { article: 0, text: "" };
            article.article = parseInt($(el).children("div").text().split(" ")[1].slice(0, -1));
            article.text = $(el).children("div").text();

            articles.push(article);
        });

        console.dir(articles);
        return articles;

    } catch (err) {
        console.error(err);
    }
}

/**
 * @param  {string} violationActText                the text the of the violation act
 *                                                      (the string with the scanned image)
 * @return {[article: number, paragraph: number]}   an array including all the mentioned articles
 *                                                      and their paragraphs in the text of the
 *                                                      scanned image
 * Identifies all the articles mentioned in the text of the fine. Those are the articles and
 * paragraphs that would be found in the legal texts, simplified and printed afterward.
 */
function findCitedArticles(violationActText) {
    const articleSearchStr = '((чл.)|(ЧЛ.))[\\.\\/\\sa-zA-Z]*[1-9]+';
    const paragraphSearchStr = '((АЛ)|(ал))[\\.\\/\\sa-zA-Z]*[1-9]+';

    const articles = [...violationActText.matchAll(new RegExp(articleSearchStr, 'gi'))].map(a => parseInt(a[0].replace(/^\D+/g, '')));
    console.log('articles: ')
    console.log(articles);

    return articles;
}

function findArticleText(fullLawText, articleId) {
    return fullLawText.find((item) => item.articleId === articleId).text;
}

/**
 * @param   law_paragraph    The text of the article that should be explained.
 * @returns The simplified article as a string.
 * Translates the given article of a law to simple terms, using the ChatGPT API.
 */
async function simplify(law_paragraph) {
    console.log("Law paragraph: " + law_paragraph);

    const openAiInstance = new openai.OpenAI({apiKey: process.env.OPENAI_API_KEY})

    const prompt = "Explain that law in Bulgarian in a simple way: " + law_paragraph;
    const completion = await openAiInstance.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);

    return completion.choices[0];
}

module.exports = {findCitedArticles, getLawText, findArticleText, simplify};