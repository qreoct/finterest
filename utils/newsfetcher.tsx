
import { getArticleIdList, addNewArticle } from "@/config/firestore";
import { ArticleType } from '@/types/ArticleTypes';
import { NewsDataIoResponseType } from '@/types/ApiTypes';
import schedule from 'node-schedule';
import { generatePrompts } from "./openai";
import finterestPrompts from "./prompt.json";

// This runs everyday at midnight - DISABLED NOW
// schedule.scheduleJob('0 0 * * *', () => {
//     runGetNews();
// });

export default async function runGetNews() {

    // List of existing article IDs in db
    const articleIdList = await getArticleIdList();
    console.log(articleIdList);

    // Finance keywords const maybe move to some config file later
    // These are the search keywords used
    const financeKeywords = "(finance AND stock AND economic OR GDP OR inflation OR interest)";

    console.log(`https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWS_KEY}&q=${financeKeywords}&full_content=1&category=business,world,top,technology&language=en`);

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

            const articleData: ArticleType = convertArticleJSONToArticleType(article);
            // console.log(articleData);
            // fixNewsArticleContentWithAI(articleData);
            addNewArticle(articleId, articleData);
        }
    }

    let currNextPageToken = nextPage;

    // TODO: Increase to 10 or 15 next time
    for (let i = 0; i < 1; i++) {
        // Wait 10 seconds before sending next API request otherwise we will get "Too Many Requests please try again later"
        await wait(10000);

        const apiResponse = await fetch(
            `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWS_KEY}&q=${financeKeywords}&full_content=1&category=business,world,top,technology&language=en&page=${currNextPageToken}`,
            {
                headers: {
                    // Add any headers here if we need next time
                },
            },
        );

        const json = await apiResponse.json();
        const { status, results, nextPage } = json as NewsDataIoResponseType;
        console.log(results);

        if (status !== "success") {
            console.log("API Request Failed");
            return;
        }

        currNextPageToken = nextPage;

        // Extract article data and store in database
        for (const article of results) {
            // Check if article already exists in the database by checking article id
            const articleId = article.article_id;

            if (!articleIdList.includes(articleId)) {
                // Article not inside database yet so we store it

                const articleData: ArticleType = convertArticleJSONToArticleType(article);
                // console.log(articleData);
                // fixNewsArticleContentWithAI(articleData);
                addNewArticle(articleId, articleData);
            }
        }
    }

}


function convertArticleJSONToArticleType(article: any): ArticleType {
    let articleCreator = article.creator?.reduce((prev: string, curr: string) => prev + ', ' + curr);

    if (articleCreator === undefined) {
        articleCreator = "";
    }

    const articleData: ArticleType = {
        article_id: article.article_id,
        title: article.title,
        link: article.link,
        creator: articleCreator,
        image_url: article.image_url,
        description: article.description,
        content: article.content,
        pubDate: Date.parse(article.pubDate),
        source_id: article.source_id,
        category: article.category,
        dateStored: (new Date()).getTime()
    };

    return articleData;
}

export async function fixNewsArticleContentWithAIAndSummarise(article: ArticleType, summarisationAmount: number): Promise<ArticleType> {

    console.log("FIXING ARTICLE: " + article.article_id);
    console.log("Summarise to " + summarisationAmount + " minutes");
    console.log(article.content);
    const fixedContent = await generatePrompts('gpt-3.5-turbo', article.content.toString(), finterestPrompts.finterestFixNewsArticle + summarisationAmount + ". The article content is: ");

    console.log("FIXED: " + fixedContent);

    article.content = fixedContent == null ? article.content : fixedContent;

    return article;
}

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

