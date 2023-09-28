
import { getArticleIdList, addNewArticle } from "@/config/firestore";
import { ArticleType } from '@/types/ArticleTypes';
import { NewsDataIoResponseType } from '@/types/ApiTypes';
import schedule from 'node-schedule';
import { cleanContent } from "../utils/langchain.js";
import * as fs from 'fs';
import { generatePrompts } from "../utils/openai";
import finterestPrompts from "../utils/prompt.json";

// This runs everyday at midnight - DISABLED NOW
// The scheduling can be done on Vercel instead, calling our getNews API
schedule.scheduleJob('0 0 * * *', () => {
    runGetNews();
});

export default async function runGetNews() {
    // List of existing article IDs in db
    const articleIdList = await getArticleIdList();
    console.log(articleIdList);

    // Finance keywords const maybe move to some config file later
    // These are the search keywords used
    const financeKeywords = "(finance AND stock AND economic OR GDP OR inflation OR interest)";


    // Get today's date
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];


    // console.log(`https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWS_KEY}&q=${financeKeywords}&full_content=1&category=business,world,top,technology&language=en`);

    const apiResponse = await fetch(
        `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWS_KEY}&q=${financeKeywords}&full_content=1&category=business,world,top,technology&language=en`,
        {
            headers: {
                // Add any headers here if we need next time
            },
        },
    );


    let json: NewsDataIoResponseType;

    try {

        json = await apiResponse.json();

    } catch (error) {
        console.log(error);
        return;
    }

    const { status, results, nextPage } = json as NewsDataIoResponseType;
    console.log(results);

    if (status !== "success") {
        console.log("API Request Failed");
        return;
    }

    // Extract article data and store in database
    for (const article of results) {
        // Check if article already exists in the database by checking article id
        const articleId = article.article_id;

        if (!articleIdList.includes(articleId)) {
            // Article not inside database yet so we store it

            const articleData: ArticleType = await convertArticleJSONToArticleType(article);
            console.log('article data: ', articleData);
            // fixNewsArticleContentWithAI(articleData);
            addNewArticle(articleId, articleData);
        }
        break;
    }

    let currNextPageToken = nextPage;


    //The following commented code is to fetch multiple pages of articles.
    //Each page consists of 10 articles.
    //Search for pagination under https://newsdata.io/documentation/#latest-news

    
    // TODO: Increase to 10 or 15 next time
    // for (let i = 0; i < 1; i++) {
    //     // Wait 10 seconds before sending next API request otherwise we will get "Too Many Requests please try again later"
    //     await wait(10000);

    //     const apiResponse = await fetch(
    //         `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWS_KEY}&q=${financeKeywords}&full_content=1&category=business,world,top,technology&language=en&page=${currNextPageToken}`,
    //         {
    //             headers: {
    //                 // Add any headers here if we need next time
    //             },
    //         },
    //     );

    //     const json = await apiResponse.json();
    //     const { status, results, nextPage } = json as NewsDataIoResponseType;
    //     console.log(results);

    //     if (status !== "success") {
    //         console.log("API Request Failed");
    //         return;
    //     }

    //     currNextPageToken = nextPage;

    //     // Extract article data and store in database
    //     for (const article of results) {
    //         // Check if article already exists in the database by checking article id
    //         const articleId = article.article_id;

    //         if (!articleIdList.includes(articleId)) {
    //             // Article not inside database yet so we store it

    //             const articleData: ArticleType = await convertArticleJSONToArticleType(article);
    //             // console.log(articleData);
    //             // fixNewsArticleContentWithAI(articleData);
    //             addNewArticle(articleId, articleData);
    //         }
    //     }
    // } 

}












async function convertArticleJSONToArticleType(article: any): Promise<ArticleType>  {
    const articleContent = article.content.toString();

    const promptString = `
        I am going to give you content for a news article. The content not only contains the news article, but it also contains also some random gibberish that corresponds to web UI elements found on websites. There is also advertisement content in the news article. I need you to give me the output in a specified format as shown:

        {
        "content": {content},
        "description": {description},
        "content_summary": {content_summary},
        "prompt_one": {prompt_one},
        "prompt_two": {prompt_two}
        }

        Replace {content} with the content of the article, but remove the gibberish, HTML content such as escape characters and advertisement content. Replace {description} with a one-liner description of what the article is about. Replace {content_summary} with a one-paragraph description of the main points of the article. Replace {prompt_one} with a question that a user could have about the article. Place {prompt_two} with another question that a user could have about the article, being distinct from the content you gave for {prompt_one}.

        Now, I will give you the article to process:
    `;

    let articleCreator = article.creator?.reduce((prev: string, curr: string) => prev + ', ' + curr);

    if (articleCreator === undefined) {
        articleCreator = "Author not found";
    }

    //Make an API call to OpenAI to process the content, generate 1-line description,
    //generate 1-paragraph summary and 2 different prompts to ask.
    const response = await generatePrompts('gpt-3.5-turbo', article.content.toString(), promptString);
    //const response = await refinedarticlefetch(new Blob([articleContent], { type: 'text/plain' }));
    console.log("Obtained response: " + response);
    const responseJSON = JSON.parse(
        response != null ? response
        : `{
            "content": No content,
            "description": No description,
            "content_summary": No summary,
            "prompt_one": No prompt,
            "prompt_two": No prompt
          }`
    );
    console.log("JSON response: " + responseJSON);

    const articleData: ArticleType = {
        article_id: article.article_id,
        category: article.category || "No Category",
        content: responseJSON.content, //To use openai
        creator: articleCreator,
        description: responseJSON.description, //To use openai
        image_url: article.image_url || "",
        link: article.link,
        pubDate: article.pubDate || "Date not found",
        source_id: article.source_id || "Source not found",
        title: article.title,
        content_summary: responseJSON.content_summary, //To use openai,
        prompt_one: responseJSON.prompt_one, //To use openai
        prompt_two: responseJSON.prompt_two //To use openai  
    };

    return articleData;
}
export {convertArticleJSONToArticleType};




// export async function fixNewsArticleContentWithAIAndSummarise(article: ArticleType, summarisationAmount: number): Promise<ArticleType> {

//     console.log("FIXING ARTICLE: " + article.article_id);
//     console.log("Summarise to " + summarisationAmount + " minutes");
//     console.log(article.content);
//     const fixedContent = await generatePrompts('gpt-3.5-turbo', article.content.toString(), finterestPrompts.finterestFixNewsArticle + summarisationAmount + ". The article content is: ");

//     console.log("FIXED: " + fixedContent);

//     article.content = fixedContent == null ? article.content : fixedContent;

//     return article;
// }

// const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

