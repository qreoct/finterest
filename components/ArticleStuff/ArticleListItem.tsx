import { ArticleType } from "@/types/ArticleTypes"
import { DocumentData } from "firebase/firestore"
import NextLink from "next/link"

export const ArticleListItem = ({ article }: { article: DocumentData }) => {

    let currArticle: ArticleType;

    try {
        currArticle = article as ArticleType;
    } catch (error) {
        console.log(error);
        return;
    }

    console.log(currArticle.article_id);
    console.log(currArticle.title);

    return (
        <div className="border border-black p-5 rounded-lg text-gray-600">
            <NextLink
                href={`/articles/${currArticle.article_id}`}
                className="text-xl font-extra-bold text-blue-600">
                {currArticle.title}
            </NextLink>
            <div className="font-light">
                {currArticle.description}
            </div>
        </div>
    );
}
