import { ArticleType } from "@/types/ArticleTypes"
import { DocumentData } from "firebase/firestore"
import { generateColorFromTitle } from '../../utils/colors';
import NextLink from "next/link"
import { useEffect, useState } from "react";

//Represents an item in the top article list shown in the dashboard
export const TopArticleListItem = ({ article }: { article: DocumentData }) => {

    let currArticle: ArticleType;

    /*
    possibilities: (comments needed for tailwind to compile dynamic class)
    bg-gold-100 bg-gold-500 bg-rose-100 bg-rose-500
    bg-sapphire-100 bg-sapphire-500 bg-stone-200 bg-pine-100 bg-pine-500 bg-firecracker-100
    */
    const [bgColor, setBgColor] = useState('gold-100');

    try {
        currArticle = article as ArticleType;
    } catch (error) {
        console.log(error);
        return;
    }

    useEffect(() => {
        setBgColor(generateColorFromTitle(currArticle.title));
    }, [currArticle]);

    return (
        <div className={`w-1/5 flex-shrink-0 pb-4`}>
            <NextLink href={`/articles/${currArticle.article_id}`}
                className={`text-xl font-extra-bold text-stone-900 flex flex-col rounded-lg items-start justify-center space-y-2 bg-${bgColor}`}>
                <img src={currArticle.image_url} alt={currArticle.title} className='rounded-lg w-full h-1/16' />
                <div className="content px-4 py-2">
                    <h5 className='font-dmsans text-stone-700 text-sm uppercase tracking-widest'>{currArticle.source_id}</h5>
                    <h3 className='font-dmsans font-bold text-neutral-headings-black text-xl'>{currArticle.title}</h3>
                    <p className={`font-dmsans text-stone-700 text-base`}>{currArticle.description}</p>
                    <div className='h-5'></div>
                    <h5 className='font-dmsans text-stone-600 text-sm tracking-widest'>{currArticle.pubDate}</h5>
                </div>
            </NextLink>
        </div>
    );
}
