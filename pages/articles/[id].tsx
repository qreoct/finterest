import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import { ArticleFullDisplay } from '@/components/Article/ArticleFullDisplay';

export default function ArticleMain() {

    // Get current id from page context
    const { id } = useRouter().query;

    return (
        <ProtectedRoute>
            <ArticleFullDisplay articleId={String(id)} />
        </ProtectedRoute>
    );
}