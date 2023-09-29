
import { getArticleIdList, addNewArticleToDB } from "@/config/firestore";
import { ArticleType } from '@/types/ArticleTypes';
import { generateAISummary, generatePrompts } from "../utils/openai";
import { getNewsFromNewsData } from "./NewsService";
import { NewsDataIoArticleType } from "@/types/ApiTypes";

// This runs everyday at midnight - DISABLED NOW
// The scheduling can be done on Vercel instead, calling our getNews API
// schedule.scheduleJob('0 0 * * *', () => {
//     runGetNews();
// });


export default async function runGetNewsAndStoreInDb() {
    // List of existing article IDs in db
    const articleIdList = await getArticleIdList();
    // const articleIdList = [''];
    console.log("runGetNews -- articlesIDs in Firestore: " + articleIdList);

    const {status, results } = await getNewsFromNewsData();

    let processed = [];

    if (status !== "success") {
        console.log("API Request Failed");
        return;
    }

    // Extract article data and store in database
    console.log("NewsController processing " + results.length + " articles");
    for (const article of results) {
        console.log("NewsController processing article " + article.article_id)

        const articleId = article.article_id;
        if (!articleIdList.includes(articleId)) {
            // Article not inside database yet so we store it


            // If article is too long or short, ignore it to protect our openai tokens :)
            if (article.content.split(' ').length > 750 || article.content.split(' ').length < 50 ) {
                console.log("ignore article for length. id: " + article.article_id + " length: " + article.content.split(' ').length);
                continue;
            }
            
            console.log("processing with AI==============")
            const processedArticleData = await processArticleWithAi(article);
            console.log("completed with AI==============")
            if (processedArticleData == null) {
                continue;
            }
            console.log("Processed article to parse: " + processedArticleData);
            const JSONArticleData = convertProcessedArticleToJSON(processedArticleData, article);

            // The article content isn't long enough. We reject it.
            if (JSONArticleData.content.split(" ").length < 50) {
                console.log("ignore article because ai output content is too short")
                continue;
            }
            processed.push(JSONArticleData)
            addNewArticleToDB(articleId, JSONArticleData);
        } else {
            console.log("article already in db. ignored")
            continue;
        }
    }
    return processed;
}

async function processArticleWithAi(initialArticle: NewsDataIoArticleType): Promise<string|null> {


    const promptString = `I will give you some text. Please process it and return the output in this JSON format:
        {
        "content": {content},
        "description": {description},
        "prompt_one": {prompt_one},
        "prompt_two": {prompt_two}
        }
        Replace {content} with the content of the article, but remove any additional unwanted information like HTML elements from websites, spam or advertisements, and superfluous information like "Read more" that links to related articles in the text. Replace {description} with one sentence description of the article. Replace {prompt_one} and {prompt_two} with distinct questions that a user could ask about the article.
        Escape all quotes and single quotes in JSON values with a backslash. Ensure {content} is fully grammatical.
        Here's the text to process:`;

    //Make an API call to OpenAI to process the content, generate 1-line description,
    //generate 1-paragraph summary and 2 different prompts to ask.

    const response = await generateAISummary('gpt-3.5-turbo', initialArticle.content.toString(), promptString);
    return response;
}

function convertProcessedArticleToJSON(processedArticle: string, initialArticle: NewsDataIoArticleType): ArticleType {

    const responseJSON = JSON.parse(processedArticle);

    let articleCreator = initialArticle.creator?.reduce((prev: string, curr: string) => prev + ', ' + curr);

    if (articleCreator === undefined) {
        articleCreator = initialArticle.source_id || "Author not found";
    }
    let imageUrl = initialArticle.image_url != null ? initialArticle.image_url : "/assets/image-placeholder-svg.svg";


    const articleData: ArticleType = {
        article_id: initialArticle.article_id,
        category: initialArticle.category || "No Category",
        content: responseJSON.content, //To use openai
        creator: articleCreator,
        description: responseJSON.description, //To use openai
        image_url: imageUrl,
        link: initialArticle.link,
        pubDate: initialArticle.pubDate || "Date not found",
        source_id: initialArticle.source_id || "Source not found",
        title: initialArticle.title,
        content_summary: "", //To use openai, generated on demand
        prompt_one: responseJSON.prompt_one, //To use openai
        prompt_two: responseJSON.prompt_two, //To use openai  
    };

    return articleData;
}
