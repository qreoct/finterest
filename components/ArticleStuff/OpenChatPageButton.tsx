import { ArticleType } from '@/types/ArticleTypes';
import { useRouter } from 'next/router';

const OpenChatPageButton = ({ article }: { article: ArticleType }) => {
    const router = useRouter();

    const article_id = article.article_id;

    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
                router.push(`/chats/new-chat?id=${article_id}`);
            }}
        >
            Chat with Finterest AI about this article!
        </button>

    )

}
export default OpenChatPageButton;
