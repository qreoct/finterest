import { ChatHistoryArticleType } from "@/types/ChatHistoryArticleType";
import { GeneralArticleListItem } from "./GeneralArticleListItem";


export const GeneralArticleList = ({ listOfChatHistory }: { listOfChatHistory: ChatHistoryArticleType[] }) => {
   
    return (
        <div className="space-y-12 mb-4">
            {listOfChatHistory.map((article: ChatHistoryArticleType) => {
                return <GeneralArticleListItem key={article.article_id} article={article} />;
            })}
        </div>
    );
};


