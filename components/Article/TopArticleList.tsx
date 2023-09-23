
import { ArticleType } from "@/types/ArticleTypes";
import { getArticle } from "@/config/firestore";
import { TopArticleListItem } from "./TopArticleListItem";
import { useEffect, useState } from "react";
import { convertToArticleType } from "@/types/ArticleTypes";

export const TopArticleList = ({ articleIdList }: { articleIdList: string[] }) => {
    const [articles, setArticles] = useState<ArticleType[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            const articlePromises = articleIdList.map(async (articleId) => {
                const articleData = await getArticle(articleId);
                return articleData ? convertToArticleType(articleData) : null;
            });

            const resolvedArticles = await Promise.all(articlePromises);
            setArticles(resolvedArticles.filter(Boolean) as ArticleType[]);
        };

        fetchArticles();
    }, [articleIdList]);

    return (
        <div className='mt-8 ml-16 mr-4 flex justify-start space-x-12 overflow-x-scroll'>
            {articles.map((article: ArticleType) => {
                return <TopArticleListItem key={article.article_id} article={article} />;
            })}
        </div>
    );
};


