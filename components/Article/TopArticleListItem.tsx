import { ArticleType } from "@/types/ArticleTypes"
import Link from "next/link"
import { generateColorFromTitle } from '../../utils/colors';
import { useEffect, useState } from "react";
import { convertTimestampToString } from "@/utils/convertTimeStampToString";

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
        <div className={`flex-shrink-0`}>
            <Link href="/articles/[id]" as={`/articles/${article.article_id}`}
                className={`text-xl font-extra-bold text-stone-900 flex flex-col max-h-500p max-w-xs
                rounded-lg items-start justify-start pb-5 space-y-2 bg-${bgColor} h-500p`}>
                <img src={article.image_url} alt={article.title} className='rounded-lg object-cover w-[100%] h-150p self-center' />
                <div className="content flex flex-col px-4 py-2 justify-between" style={{ height: 'inherit' }}>
                    <div className="text">
                        <h5 className='font-dmsans text-stone-700 text-sm uppercase tracking-widest'>{article.source_id}</h5>
                        <h3 className='font-dmsans font-bold text-neutral-headings-black text-xl lg:line-clamp-5'>{article.title}</h3>
                        <p className={`font-dmsans text-stone-700 text-base line-clamp-5`}>{article.description}</p>
                    </div>
                    <div className="date">
                        <h5 className='font-dmsans text-stone-600 text-sm tracking-widest'>{convertTimestampToString(article.pubDate)}</h5>
                    </div>
                </div>
            </Link>
        </div>
    );
}
