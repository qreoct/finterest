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
        <div className="mt-8 ml-16 mr-16">
            <NextLink href={`/articles/${currArticle.article_id}`} className="text-xl font-extra-bold text-blue-600">
                <div className="flex">
                    {/* Left Column (75% width) */}
                    <div className="w-3/4 space-y-2">
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase'>{currArticle.source_id}</h5>
                        <h3 className='font-dmsans font-bold text-neutral-headings-black text-2xl'>{currArticle.title}</h3>
                        <p className='font-dmsans text-neutral-text-gray text-base'>{currArticle.description}</p>
                        <h5 className='font-dmsans text-neutral-text-gray text-sm'>{currArticle.pubDate}</h5>
                    </div>

                    {/* Right Column (25% width) */}
                    <div className="w-1/4 pl-4">
                        <img src={currArticle.image_url} alt={ currArticle.title } className='rounded-lg' />
                    </div>
                </div>
            </NextLink>
        </div>




        //     <NextLink href={`/articles/${currArticle.article_id}`} className="text-xl font-extra-bold text-blue-600">
        //         {currArticle.title}
        //     </NextLink>
        //     <div className="font-light">
        //         {currArticle.description}
        //     </div>
        // </div>
    );
}
