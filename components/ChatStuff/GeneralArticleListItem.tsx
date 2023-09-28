import { convertTimestampToString } from "@/utils/convertTimeStampToString";
import { DocumentData } from "firebase/firestore"
import Link from "next/link"
import { ChatHistoryArticleType } from "@/types/ChatHistoryArticleType";
import { convertDateToString } from "@/utils/convertTimeStampToString";

//A component that shows an article list item in the dashboard
export const GeneralArticleListItem = ({ article }: { article: DocumentData }) => {

    let currArticle: ChatHistoryArticleType;

    try {
        currArticle = article as ChatHistoryArticleType
    } catch (error) {
        console.log(error);
        return;
    }


    return (
        <div className="mt-8 ml-8 mr-8 lg:ml-16 lg:mr-16">
            <Link href="articles/[id]" as={`articles/${currArticle.article_id}`} className="text-xl font-extra-bold text-blue-600">
                <div className="flex flex-col space-y-8 xs:space-y-0 xs:flex-row">
                    {/* Left Column (75% width) */}
                    <div className="xs:w-3/5 lg:w-3/4 max-w-prose space-y-2">
                        <h5 className='font-dmsans text-stone-700 text-sm uppercase tracking-widest'>{currArticle.source_id}</h5>
                        <h3 className='font-dmsans font-bold text-stone-900 text-xl lg:text-2xl'>{currArticle.title}</h3>
                        <p className='font-dmsans text-stone-700 text-base'>{currArticle.description}</p>
                        <h5 className='font-dmsans text-stone-700 text-sm tracking-widest'>{convertTimestampToString(currArticle.pubDate)}</h5>
                        <h5 className='font-dmsans text-stone-700 font-bold text-sm tracking-widest'>Last Chatted On: { convertDateToString(currArticle.datetimeOfChat)}</h5>
                    </div>

                    {/* Right Column (25% width) */}
                    <div className="xs:w-2/5 lg:w-1/4 xs:ml-16 md:ml-8 lg:ml-16 xl:ml-32 2xl:ml-48 self-start xs:self-center">
                        <img src={currArticle.image_url} alt={ currArticle.title } className='rounded-lg w-48 md:h-28 md:w-80 lg:h-28 lg:w-64 xl:h-36 xl:w-64 2xl:h-40 2xl:w-64' />
                    </div>
                </div>
            </Link>
        </div>

    );
}
