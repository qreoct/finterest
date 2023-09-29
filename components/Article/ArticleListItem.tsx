import { ArticleType } from "@/types/ArticleTypes"
import { convertTimestampToString } from "@/utils/convertTimeStampToString";
import { DocumentData } from "firebase/firestore"
import Link from "next/link"

//A component that shows an article list item in the dashboard
export const ArticleListItem = ({ article }: { article: DocumentData }) => {

    let currArticle: ArticleType;

    try {
        currArticle = article as ArticleType;
    } catch (error) {
        // console.log(error);
        return;
    }

    // console.log(currArticle.article_id);
    // console.log(currArticle.title);

    return (
        <div className="mt-8 ml-8 xs:ml-16 mr-16">
            <Link href="articles/[id]" as={`articles/${currArticle.article_id}`}
                className="text-xl font-extra-bold text-blue-600">
                <div className="flex flex-col space-y-8 xs:space-y-0 md:flex-row">
                    {/* Left Column (75% width) */}
                    <div className="md:w-3/5 lg:w-3/4 max-w-prose space-y-2">
                        <h5 className='font-dmsans text-stone-700 text-sm uppercase tracking-widest'>{currArticle.source_id}</h5>
                        <h3 className='font-dmsans font-bold text-stone-900 text-2xl'>{currArticle.title}</h3>
                        <p className='font-dmsans text-stone-700 text-base'>{currArticle.description}</p>
                        <h5 className='font-dmsans text-stone-700 text-sm tracking-widest'>{convertTimestampToString(currArticle.pubDate)}</h5>
                    </div>

                    {/* Right Column (25% width) */}
                    <div className="md:w-2/5 lg:w-1/4 md:ml-8 lg:ml-16 xl:ml-32 2xl:ml-48 self-start md:self-center">
                        <img src={currArticle.image_url} alt={currArticle.title} className='rounded-lg object-cover w-48 mt-5 md:mt-0 md:h-28 md:w-80 lg:h-28 lg:w-64 xl:h-36 xl:w-64 2xl:h-40 2xl:w-64' />
                    </div>
                </div>
            </Link>
        </div >

    );
}
