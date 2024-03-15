const axios = require("axios");
const cheerio = require("cheerio");
// const fs = require("fs");
const openai = require("openai")
// const utf8 = require('utf8');

/**
 * @param   law_paragraph    The text of the article that should be explained.
 * @returns The simplified article as a string.
 * Translates the given article of a law to simple terms, using the ChatGPT API.
 */
async function simplify(law_paragraph) {
    console.log("Law paragraph: " + law_paragraph);
    const openAiInstance = new openai.OpenAI({apiKey: ''})
    // const openai = new OpenAI({ apiKey: '' });

    // const prompt = "Explain that law in Bulgarian in a simple way: " + law_paragraph;
    // const completion = await openai.chat.completions.create({
    //     messages: [{ role: "system", content: prompt }],
    //     model: "gpt-3.5-turbo",
    // });
    //
    // console.log(completion.choices[0]);
    //
    // return completion.choices[0];
}

// URL of the page we want to scrape
// export const roadTrafficActUrl = "https://lex.bg/mobile/ldoc/2134649345";
const roadTrafficActUrl = "https://lex.bg/mobile/ldoc/2134649345";

let articleStruct = { num: 0, paragraph: "" };


/**
 * @param   url     Link to the official legal gate containing the law
 // * @returns {Promise<[{paragraph: string, num: number}]>}
 * Scrapes the official legal gate containing the given law, and stores all articles
 * with their paragraphs in the articles[] array.
 */
async function getLawText(url) {
    try {
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);
        // Select all the list items in Article class
        const listItems = $(".Article");
        // Stores data for all articles
        const articles = [{ num: 0, paragraph: "" }];

        // Use .each method to loop through the li we selected
        listItems.each((idx, el) => {
            // Object holding data for each country/jurisdiction
            const article = { num: 0, paragraph: "" };
            article.num = parseInt($(el).children("div").text().split(" ")[1].slice(0, -1));
            console.log(article.num);

            article.paragraph = $(el).children("div").text();

            // Should decode to UTF-8
            // const paragraph = $(el).children("div").text();
            // article.paragraph = utf8.encode(paragraph);
            // article.paragraph = Buffer.from(paragraph, 'utf-8').toString('utf-8');

            articles.push(article);

            // // Select the text content of a and span elements
            // // Store the textcontent in the above object
            // article.num = $(el).children("a").text();
            // article.paragraph = $(el).children("span").text();
            // // Populate articles array with country data
            // articles.push(article);
        });
        // Logs articles array to the console
        // console.dir(articles);

        // return articles, articles[article_num-1].paragraph;
        return articles;

    } catch (err) {
        console.error(err);
    }
}

module.exports = { simplify, getLawText };

let article_num = 100;
let lawText = getLawText(roadTrafficActUrl);
lawText.then((value) => {
    console.log(value[article_num])
})
// console.log("lawText: " + lawText);
// simplify(lawText[article_num].paragraph);