import { ArticleType } from "@/types/ArticleTypes"
import { DocumentData } from "firebase/firestore"
import NextLink from "next/link"
import { convertTimestampToString } from "@/utils/convertTimeStampToString"

export const TopArticleListItem = ({ article }: { article: DocumentData }) => {

    let currArticle: ArticleType;

    try {
        currArticle = article as ArticleType;
    } catch (error) {
        console.log(error);
        return;
    }

    return (
        <div className='w-1/5 flex-shrink-0 '>
            <NextLink href={`/articles/${currArticle.article_id}`}className="text-xl font-extra-bold text-blue-600 flex flex-col items-start justify-center space-y-2">
                <img src={currArticle.image_url} alt={ currArticle.title } className='rounded-lg w-full h-1/16' />
                <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase'>{currArticle.source_id}</h5>
                <h3 className='font-dmsans font-bold text-neutral-headings-black text-2xl'>{currArticle.title}</h3>
                <p className='font-dmsans text-neutral-text-gray text-base'>{currArticle.description}</p>
                <h5 className='font-dmsans text-neutral-text-gray text-sm'>{currArticle.pubDate}</h5>
                {/* Empty division to create vertical spacing between text and horizontal scroll bar */}
                <div className='h-5'></div>
            </NextLink>
        </div>
    );
}
