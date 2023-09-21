
import { ArticleType } from "@/types/ArticleTypes";
import { getArticle } from "@/config/firestore";
import { ChatListItem } from "./ChatListItem";
import { useEffect, useState } from "react";
import { convertToArticleType } from "@/types/ArticleTypes";

export const ChatList = ({ articleIdList }: { articleIdList: string[] }) => {
    const [articles, setArticles] = useState<ArticleType[]>([]);

    console.log("ARTICLE ID LIST: " + articleIdList);

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

    if (!articles) {
        return <div>No Articles Found</div>;
    }

    return (
        <div className="space-y-5">
            {articles.map((article: ArticleType) => {
                return <ChatListItem key={article.article_id} article={article} />;
            })}
        </div>
    );
};


