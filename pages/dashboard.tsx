import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { ArticleList } from '@/components/Article/ArticleList';
import { TopArticleList } from '@/components/Article/TopArticleList';
import { getPersonalisedArticleIdList, getTrendingArticleIdList } from '@/config/firestore';
import { useEffect, useState } from 'react';
import LeftNavigationBar  from '@/components/common/LeftNavigationBar'
import Script from 'next/script';

/*
    The page where the user first enters after he logs in
*/
const Dashboard = () => {
    const { user } = useAuth();
    
    // Instead of const articleIdList = getArticleIdList()
    // For react need to use this state management thing so that the the Promise will be awaited
    // For personalised articles
    const [personalisedArticleIdList, setPersonalisedArticleIdList] = useState<string[]>([]);
    
    useEffect(() => {
        // If user is not logged in, wait for user to log in
        if (!user.uid) {
            return;
        }

        const fetchPersonalisedArticleIdList = async () => {
            const NUMBER_OF_PERSONALISED_ARTICLES_TO_RECOMMEND = 30
            const idList = await getPersonalisedArticleIdList(user.uid, NUMBER_OF_PERSONALISED_ARTICLES_TO_RECOMMEND);
            setPersonalisedArticleIdList(idList);
        };
        
        fetchPersonalisedArticleIdList();
    }, [user.uid]);

    // For trending articles
    const [trendingArticleIdList, setTrendingArticleIdList] = useState<string[]>([]);
    useEffect(() => {
        if (!user.uid) {
            return;
        }

        const fetchTrendingArticleIdList = async () => {
            const NUMBER_OF_TRENDING_ARTICLES_TO_RECOMMEND = 6
            const idList = await getTrendingArticleIdList(user.uid, NUMBER_OF_TRENDING_ARTICLES_TO_RECOMMEND);
            setTrendingArticleIdList(idList);
        };

        fetchTrendingArticleIdList();
    }, [user.uid]);

    const articleIdListPersonalised = personalisedArticleIdList; 
    const articleIdListTrending = trendingArticleIdList;

    return (
        <ProtectedRoute>
            <Head>
                <title>Dashboard - Finterest</title>
                <meta
                    name="description"
                    content="Finterest dashboard"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />

                <Script id='google-analytics' strategy="lazyOnload">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                    `}
                </Script>





            </Head>

            <div className="flex flex-col-reverse md:flex-row md:items-start h-screen overflow-y-hidden">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={0} />
                                    
                {/* Right Content */}
                <div className="width-3/4 bg-white overflow-y-auto" style={{ height: '100vh' }}>
                    {/* Top articles */}
                    <h2 className="font-gupter text-neutral-headings-black font-bold text-4xl ml-16 mt-16">Today&apos;s Top Stories</h2>
                    <TopArticleList articleIdList={articleIdListTrending} />

                    {/* Other articles, as recommended by the algorithm */}
                    <h2 className="font-gupter text-neutral-headings-black font-bold text-4xl ml-16 mt-16">Stories For You</h2>
                    <ArticleList articleIdList={articleIdListPersonalised} />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;