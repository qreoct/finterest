
import { ArticleType } from "@/types/ArticleTypes";
import { getArticle } from "@/config/firestore";
import { ArticleListItem } from "./ArticleListItem";
import { useEffect, useState } from "react";
import { convertToArticleType } from "@/types/ArticleTypes";
import LoadingText from "../common/LoadingText";

export const ArticleList = ({ articleIdList }: { articleIdList: string[] }) => {
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setIsFetching(true);
            const articlePromises = articleIdList.map(async (articleId) => {
                const articleData = await getArticle(articleId);
                return articleData ? convertToArticleType(articleData) : null;
            });

            const resolvedArticles = await Promise.all(articlePromises);
            setArticles(resolvedArticles.filter(Boolean) as ArticleType[]);
            setIsFetching(false);
        };

        fetchArticles();
    }, [articleIdList]);

    return (
        <div className="space-y-12 mb-4">
            {isFetching ? <div className='space-y-8 mt-8 ml-8 xs:ml-16 mr-16'> <LoadingText /> <LoadingText /> </div> :
                (
                    articles.map((article: ArticleType) => {
                        return <ArticleListItem key={article.article_id} article={article} />;
                    })
                )
            }
        </div>
    );
};


