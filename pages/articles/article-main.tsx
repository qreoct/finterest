import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Footer from '@/components/common/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ArticleMain() {
    return (
        <ProtectedRoute>
            <Head>
                <title>First Post</title>
            </Head>
            <body>
                <h1>First Post</h1>
                <Footer children={false} showBackButton={true} />
            </body>
        </ProtectedRoute>
    );
}