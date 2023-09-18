import { ArticleType } from "@/types/ArticleTypes"
import { DocumentData } from "firebase/firestore"
import NextLink from "next/link"
import { useEffect, useState } from "react";
import { getArticle } from "@/config/firestore";
import { convertToArticleType } from "@/types/ArticleTypes";
import Footer from "../common/Footer";
import { fixNewsArticleContentWithAI } from "@/utils/newsfetcher";
import OpenChatPageButton from "./OpenChatPageButton";

export const ArticleFullDisplay = ({ articleId }: { articleId: string }) => {

    const [currArticle, setArticles] = useState<ArticleType | null>({} as ArticleType);

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

    console.log(currArticle?.article_id);
    console.log(currArticle?.title);

    if (!currArticle) {
        return <div>Loading article...</div>;
    }

    const pubDateString = currArticle?.pubDate === undefined ? "Unknown" : new Date(currArticle?.pubDate.valueOf()).toLocaleString();
    const categoryString = currArticle?.category === undefined ? "None" : currArticle?.category.join(', ');

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
                        <p className="text-gray-600 mb-2">Description: {currArticle.description}</p>
                    </section>

                    <section className="mb-4 flex justify-center gap-96">
                        <p className="text-gray-600 mb-2">Creator: {currArticle.creator}</p>
                        <p className="text-gray-600 mb-2">Published On: {pubDateString}</p>
                    </section>

                    <section className="mb-4 flex justify-center gap-96">
                        <p className="text-gray-600 mb-2">Source ID: {currArticle.source_id}</p>
                        <p className="text-gray-600 mb-2">Categories: {currArticle.category}</p>
                    </section>

                </section>
                <img src={currArticle.image_url} alt={currArticle.title} className="max-w-full mb-4" />

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
