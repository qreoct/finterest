import { ArticleType } from "@/types/ArticleTypes"
import { DocumentData } from "firebase/firestore"
import NextLink from "next/link"
import { useEffect, useState } from "react";
import { getArticle } from "@/config/firestore";
import { convertToArticleType } from "@/types/ArticleTypes";
import Footer from "../common/Footer";
import { fixNewsArticleContentWithAIAndSummarise } from "@/lib/NewsController";
import OpenChatPageButton from "./OpenChatPageButton";


const summaryAndGibberishRemovalEnabled = false;


export const ArticleFullDisplay = ({ articleId }: { articleId: string }) => {

    let [preCurrArticle, setArticles] = useState<ArticleType | null>({} as ArticleType);

    useEffect(() => {
        const fetchArticle = async () => {
            const articlePromises = await getArticle(articleId);
            const resolvedArticle = await articlePromises;

            let convertedArticle = convertToArticleType(resolvedArticle);

            if (convertedArticle == null) {
                console.log("Article not found");
                return;
            }

            // TESTING - When this is enabled, each time u load an article page GPT will run once
            // NVM THIS DOES NOT WORK IN THE WAY THAT I INTENDED
            // convertedArticle = await fixNewsArticleContentWithAI(convertedArticle);

            setArticles(convertedArticle);
        };

        fetchArticle();
    }, [articleId]);

    // Get the relevant article from database
    const [currArticle, setConvertedArticle] = useState<ArticleType | null>(null);

    useEffect(() => {
        const convertArticle = async () => {
            if (!preCurrArticle?.article_id) {
                return;
            }


            const summarisationAmount = 3;
            let convertedArticle;

            if (summaryAndGibberishRemovalEnabled) {
                convertedArticle = await fixNewsArticleContentWithAIAndSummarise(preCurrArticle, 3);
            } else {
                convertedArticle = preCurrArticle;
            }

            setConvertedArticle(convertedArticle);
        };

        convertArticle();
    }, [preCurrArticle]);



    console.log(currArticle?.article_id);
    console.log(currArticle?.title);

    if (!currArticle) {
        return <div className="flex justify-center font-bold text-4xl">Loading article...</div>;
    }

    const pubDateString = currArticle?.pubDate === undefined ? "Unknown" : new Date(currArticle?.pubDate.valueOf()).toLocaleString();
    const categoryString = currArticle?.category === undefined ? "None" : currArticle?.category.map(x => {
        // Capitalise the first letter of each category because it is stored as all small letters
        return x[0].toUpperCase() + x.slice(1);
    }).join(', ');

    const creatorString = currArticle.creator === "" ? "Unknown" : currArticle.creator;

    const summaryLevel = summaryAndGibberishRemovalEnabled ? "3 minutes" : "None";

    // Go through the article content string and add some new lines after fullstops
    // This is to make the article content look nicer
    const parsedContent = currArticle?.content?.split(new RegExp("[.?!] ")).map((sentence) => {
        const randomNum = Math.random();
        if (randomNum < 0.1) {
            return sentence + '.\n\n';
        } else if (randomNum < 0.2) {
            return sentence + '.\n';
        } else {
            return sentence + '.';
        }
    }).join('  ');

    // Need to manually add paragraph tags to each paragraph otherwise the text will be one big block
    const paragraphs = parsedContent?.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-4">{paragraph}</p>
    ));

    if (!currArticle) {
        return <div>Loading article...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{currArticle.title}</h1>
                <section className="flex-col">
                    <section className="mb-4">
                        <p className="text-gray-600 mb-2">Description: {currArticle.description ?? "None"}</p>
                    </section>

                    <section className="mb-4 flex justify-center gap-96">
                        <p className="text-gray-600 mb-2">Creator: {creatorString}</p>
                        <p className="text-gray-600 mb-2">Published On: {pubDateString}</p>
                    </section>

                    <section className="mb-4 flex justify-center gap-96">
                        <p className="text-gray-600 mb-2">Source ID: {currArticle.source_id}</p>
                        <p className="text-gray-600 mb-2">Categories: {categoryString}</p>
                    </section>

                </section>
                <img src={currArticle.image_url} alt={currArticle.title} className="max-w-full mb-4" />

                <p className="text-gray-600 p-3 font-bold text-xl">Summary Level: {summaryLevel}</p>

                <OpenChatPageButton article={currArticle} />

                <section className="mb-4 border-4 border-black m-10 p-10 text-lg">

                    {paragraphs}
                </section>

                <OpenChatPageButton article={currArticle} />
            </div>
            <Footer children={false} showBackButton={true} />
        </div>
    );
}
