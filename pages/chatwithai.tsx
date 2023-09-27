import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArticleList } from '@/components/Article/ArticleList';
import { TopArticleList } from '@/components/Article/TopArticleList';
import { getArticleIdList } from '@/config/firestore';
import { useEffect, useState } from 'react';
import LeftNavigationBar from '@/components/common/LeftNavigationBar'
import GeneralConvo from '@/components/ChatStuff/GeneralConvo';


/*
    The page where the user first enters after he logs in
*/
const ChatWithAi = () => {
    return (
        <ProtectedRoute>
            <Head>
                <title>Chat with Finterest AI</title>
                <meta
                    name="description"
                    content="Finterest AI"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Gupter:wght@400;500;700&display=swap"/>

            </Head>

            <div className="flex">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={1} />

                {/* Right Content */}
                <div className="bg-white w-full overflow-y-auto" style={{ height: '100vh' }}>
                    <GeneralConvo />
                </div>

            </div>

        </ProtectedRoute>
    );
};

export default ChatWithAi;