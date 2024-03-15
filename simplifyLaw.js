const axios = require("axios");
const cheerio = require("cheerio");
// const fs = require("fs");
const openai = require("openai")
// const utf8 = require('utf8');
// import OpenAI from "openai";
const iconv = require('iconv-lite')

module.exports = { simplify, getLawText };

/**
 * @param   law_paragraph    The text of the article that should be explained.
 * @returns The simplified article as a string.
 * Translates the given article of a law to simple terms, using the ChatGPT API.
 */
async function simplify(law_paragraph) {
    law_paragraph = "Чл. 100. (1) (Предишен текст на чл. 100 - ДВ, бр. 6 от 2004 г.) Водачът на моторно превозно средство е длъжен да носи:\n" +
        "1. (доп. - ДВ, бр. 51 от 2007 г., изм. - ДВ, бр. 67 от 2023 г.) свидетелство за управление на моторно превозно средство от съответната категория;\n" +
        "2. (доп. - ДВ, бр. 51 от 2007 г.) свидетелство за регистрация на моторното превозно средство, което управлява и за тегленото от него ремарке;\n" +
        "3. (изм. - ДВ, бр. 103 от 2005 г., в сила от 01.01.2006 г., доп. - ДВ, бр. 51 от 2007 г.) документ за сключена задължителна застраховка \"Гражданска отговорност\" на автомобилистите за моторното превозно средство, което управлява и за тегленото от него ремарке;\n" +
        "4. (изм. - ДВ, бр. 43 от 2002 г., в сила от 26.04.2002 г., изм. - ДВ, бр. 51 от 2007 г., изм. - ДВ, бр. 93 от 2009 г., в сила от 25.12.2009 г.) превозните документи, определени от министъра на транспорта, информационните технологии и съобщенията;\n" +
        "5. (нова - ДВ, бр. 51 от 2007 г.) при напускане на територията на страната - валиден международен сертификат за \"Гражданска отговорност\" на автомобилистите за чужбина - \"Зелена карта\";\n" +
        "6. (нова - ДВ, бр. 101 от 2016 г., в сила от 21.01.2017 г., изм. - ДВ, бр. 2 от 2018 г., в сила от 20.05.2018 г.) документ, отразяващ датата за извършване на следващия периодичен преглед за проверка на техническата изправност, удостоверяващ, че моторното превозно средство, което управлява, и тегленото от него ремарке се допускат за движение по пътищата, отворени за обществено ползване.";
    console.log("Law paragraph: " + law_paragraph);


    const openAiInstance = new openai.OpenAI({apiKey: process.env.GPT_KEY})

    const prompt = "Explain that law in Bulgarian in a simple way: " + law_paragraph;
    const completion = await openAiInstance.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    // const completion = await openai.createCompletion({
    //     model: "gpt-3.5-turbo",
    //     prompt: prompt
    // });

    console.log(completion.choices[0]);

    return completion.choices[0];
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
        // Way 1:
        let { data } = await axios.get(url);
        // data = iconv.decode(data, 'windows-1251');
        // data = iconv.decode(data, 'utf8');

        // Way 2:
        // let options = {
        //     method: 'GET',
        //     url: url,
        //     // responseType: 'json',
        //     // charset: 'utf8',
        //     responseEncoding: 'win-1251'
        // };
        //
        // const { data } = axios.request(options).then(function (response) {
        //     console.log(response.data)
        //     return response.data;
        // }).catch(function (error) {
        //     console.log(error);
        // });

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

lawToPrint = {article: 0, paragraph: 0};

function findCitedArticles(violationActText) {
    violationActText = "LOG  Extracted text: Серия/Series GT, №2732808\n" +
        "РЕПУБЛИКА БЪЛГАРИЯ\n" +
        "REPUBLIC OF BULGARIA\n" +
        "МИНИСТЕРСТВО НА ВЪТРЕШНИТЕ РАБОТИ\n" +
        "MINISTRY OF\n" +
        "INTERIOR\n" +
        "ГЛОБА С ФИШ\n" +
        "TRAFFIC VIOLATION TICKET\n" +
        "Днес/Today, 10.03.2024г., подписаният/, I the undersigned\n" +
        "АНТОНИО ИВОВ ЙОРДАНОВ, на длъжност/position occupied МЛ.\n" +
        "АВТОКОНТРОЛЬОР при/with СДВР, ОТДЕЛ ПЪТНА ПОЛИЦИЯ СДВР,\n" +
        "установих, чеe/have witnessed that ЙОАН ПЕТРОВ ДЖЕЛЕКАРСКИ\n" +
        "ЕГН/ЛНЧ/PIN/PNF 0347316407\n" +
        "Постоянен адрес/Resident at permanent address : СОФИЯ,\n" +
        "СТОЛИЧНА, ГР. СОФИЯ, УЛ. ЦАРЕВЕЦ, № 26, ет. 7, ап. 28\n" +
        "B/in Гр София на/оп 10.03.2024 B/at 12:57\n" +
        "е извършил нарушение/committed a violation ПЕШЕХОДЕЦ НЕ\n" +
        "ПРЕМИНАВА ПО ПЕШЕХОДНА ПЪТЕКА., по чл./as per article 113.\n" +
        "ал./paragraph 1 от ЗДВП/of the Road Traffic Act, поради което\n" +
        "на основание чл. 186/and therefore on the grounds of Article 186.\n" +
        "Във връзка с чл./and in connection with article ЧЛ. 184 АЛ. 3\n" +
        "от ЗДвП/оf Road Traffic Act, налагам глоба/I hereby impose a fine\n" +
        "in the amount of двадесет (20) лева/BGN\n" +
        "НАЛОЖИЛ ГЛОБАТА/OFFICER IMPOSING THE FINE....\n" +
        "ГЛОБАТА С ФИШ НЕ ПОДЛЕЖИ НА ОБЖАЛВАНЕ\n" +
        "THIS TRAFFIC VIOLATION TICKET IS NOT SUBJECT TO APPEAL";

    // Matches both (чл. 186) and (ЧЛ.186)
    // const searchStr = '((чл.)|(ЧЛ.))\\s+([0-9]+)';
    const articleSearchStr = '(чл.)\\s+([0-9]+)';
    const paragraphSearchStr = '((АЛ)|(ал))[\.\/\sa-zA-Z]*[1-9]+/g';

    toPrint = [];
    // while ( (result = regex.exec(violationActText)) ) {
    //     // Replace all leading non-digits in a matched text with nothing, leave digits only
    //     let article = result.replace(/^\D+/g, '');
    //     // ((АЛ)|(ал))[\.\/]*[a-zA-Z\s]*[1-9]+ --> ал./paragraph 1
    //     // ((АЛ)|(ал))([\.\/\s]*[a-zA-Z]*)[1-9]+ --> АЛ. 3
    //     // ((АЛ)|(ал))[\.\/\sa-zA-Z]*[1-9]+/g
    //
    //     let paragraph =
    //
    //     toPrint.push();
    // }

    // const articles = [...violationActText.matchAll(new RegExp(articleSearchStr, 'gi'))].map(a => a.toString().replace(/^\D+/g, ''));
    const articles = [...violationActText.matchAll(new RegExp(articleSearchStr, 'gi'))].map(a => a[0].replace(/^\D+/g, ''));
    console.log('articles: ')
    console.log(articles); // [182, 25]


    // const paragraphs = [...violationActText.matchAll(new RegExp(paragraphSearchStr, 'gi'))].map(a => a[0].replace(/^\D+/g, ''));
    const paragraphs = [...violationActText.matchAll(new RegExp(paragraphSearchStr, 'gi'))].map(a => a.toString().replace(/^\D+/g, ''));
    console.log('paragraphs: ');
    console.log(paragraphs); // [2, 3]

    lawsToPrint = []
    let i = 0;
    for (article in articles) {
        lawsToPrint.push({article: parseInt(articles[article]), paragraph: paragraphs[i++]});
    }

    console.log('lawsToPrint: ');
    console.log(lawsToPrint);
    return lawsToPrint;


    // const indexes = [...violationActText.matchAll(new RegExp(articlesearchStr, 'gi'))].map(a => a.index);
    // console.log(indexes); // [2, 25, 27, 33]
}

// let article_num = 100;
// let lawText = getLawText(roadTrafficActUrl);
// lawText.then((value) => {
//     console.log(value[article_num])
// })
// console.log("lawText: " + lawText);
// simplify(lawText[article_num].paragraph);
// simplify("");

findCitedArticles("");
