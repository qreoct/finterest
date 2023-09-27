import { ArticleType } from "@/types/ArticleTypes"
import Link from "next/link"
import { generateColorFromTitle } from '../../utils/colors';
import { useEffect, useState } from "react";

//Represents an item in the top article list shown in the dashboard
export const TopArticleListItem = ({ article }: { article: ArticleType }) => {

    /*
    possibilities: (comments needed for tailwind to compile dynamic class)
    bg-gold-100 bg-gold-500 bg-rose-100 bg-rose-500
    bg-sapphire-100 bg-sapphire-500 bg-stone-200 bg-pine-100 bg-pine-500 bg-firecracker-100
    */
    const [bgColor, setBgColor] = useState('gold-100');

    useEffect(() => {
        setBgColor(generateColorFromTitle(article.title));
    }, [article]);

    return (
        <div className={`w-1/5 flex-shrink-0 pb-4`}>
            <Link href="/articles/[id]" as={`/articles/${article.article_id}`}
                className={`text-xl font-extra-bold text-stone-900 flex flex-col rounded-lg items-start justify-center space-y-2 bg-${bgColor}`}>
                <img src={article.image_url} alt={article.title} className='rounded-lg w-full h-1/16' />
                <div className="content px-4 py-2">
                    <h5 className='font-dmsans text-stone-700 text-sm uppercase tracking-widest'>{article.source_id}</h5>
                    <h3 className='font-dmsans font-bold text-neutral-headings-black text-xl'>{article.title}</h3>
                    <p className={`font-dmsans text-stone-700 text-base`}>{article.description}</p>
                    <div className='h-5'></div>
                    <h5 className='font-dmsans text-stone-600 text-sm tracking-widest'>{article.pubDate}</h5>
                </div>
            </Link>
        </div>
    );
}
