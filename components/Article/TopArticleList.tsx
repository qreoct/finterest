
import { ArticleType } from "@/types/ArticleTypes";
import { getArticle } from "@/config/firestore";
import { TopArticleListItem } from "./TopArticleListItem";
import { useEffect, useState } from "react";
import { convertToArticleType } from "@/types/ArticleTypes";
import LoadingText from "../common/LoadingText";

//A component representing the list of top article items shown in the dashboard
export const TopArticleList = ({ articleIdList }: { articleIdList: string[] }) => {
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    //Fetches the top articles from the database given a list of id values
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
        <div className='mt-8 ml-8 xs:ml-16 lg:mr-2 flex justify-start space-x-6 overflow-x-scroll overflow-y-hidden pb-4'>
            {isFetching
                ? <> <LoadingText />  <LoadingText />  <LoadingText /> </>
                :
                <>
                    {articles.map((article: ArticleType) => {
                        return <TopArticleListItem key={article.article_id} article={article} />;
                    })}
                    < div className='pr-4'></div>
                </>

            }
        </div>
    );
};


