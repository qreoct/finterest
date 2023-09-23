
import { ArticleType } from "@/types/ArticleTypes";
import { getArticle } from "@/config/firestore";
import { ArticleListItem } from "./ArticleListItem";
import { useEffect, useState } from "react";
import { convertToArticleType } from "@/types/ArticleTypes";

export const ArticleList = ({ articleIdList }: { articleIdList: string[] }) => {
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
        <div className="space-y-5">
            {articles.map((article: ArticleType) => {
                return <ArticleListItem key={article.article_id} article={article} />;
            })}
        </div>
    );
};


