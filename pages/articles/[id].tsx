import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import { ArticlePage } from '@/components/Article/ArticlePage';

export default function ArticleMain() {

    // Get current id from page context
    const { id } = useRouter().query;

    return (
        <ProtectedRoute>
            <ArticlePage articleId={String(id)} />
        </ProtectedRoute>
    );
}