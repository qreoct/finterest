import { ArticleType } from "@/types/ArticleTypes"
import { DocumentData } from "firebase/firestore"
import NextLink from "next/link"
import { useAuth } from "@/context/AuthContext"

export const ChatListItem = ({ article }: { article: DocumentData }) => {

    let currArticle: ArticleType;

    try {
        currArticle = article as ArticleType;
    } catch (error) {
        console.log(error);
        return;
    }

    const userId = useAuth().user.uid;
    const chatIdForThisChat = userId + article.article_id;

    console.log(currArticle.article_id);
    console.log(currArticle.title);

    return (
        <div className="border border-black p-5 rounded-lg text-gray-600">
            <NextLink
                href={`/chats/${chatIdForThisChat}`}
                className="text-xl font-extra-bold text-blue-600">
                Open Chat About: {currArticle.title}
            </NextLink>
            <div className="font-light">
                {currArticle.description}
            </div>
        </div>
    );
}