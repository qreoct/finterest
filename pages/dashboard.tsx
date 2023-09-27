import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import utilStyles from '@/styles/utils.module.css';
import { ArticleList } from '@/components/Article/ArticleList';
import { TopArticleList } from '@/components/Article/TopArticleList';
import { getPersonalisedArticleIdList, getTrendingArticleIdList } from '@/config/firestore';
import { useEffect, useState } from 'react';
import LeftNavigationBar  from '@/components/common/LeftNavigationBar'

/*
    The page where the user first enters after he logs in
*/
const Dashboard = () => {
    const { logOut, user } = useAuth();
    const router = useRouter();

    // Instead of const articleIdList = getArticleIdList()
    // For react need to use this state management thing so that the the Promise will be awaited
    // For personalised articles
    const [personalisedArticleIdList, setPersonalisedArticleIdList] = useState<string[]>([]);
    
    useEffect(() => {
        const fetchPersonalisedArticleIdList = async () => {
            const NUMBER_OF_PERSONALISED_ARTICLES_TO_RECOMMEND = 10
            const idList = await getPersonalisedArticleIdList(user.uid, NUMBER_OF_PERSONALISED_ARTICLES_TO_RECOMMEND);
            setPersonalisedArticleIdList(idList);
        };

        fetchPersonalisedArticleIdList();
    }, [user.uid]);

    // For trending articles
    const [trendingArticleIdList, setTrendingArticleIdList] = useState<string[]>([]);
    useEffect(() => {
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
                <link rel="icon" href="/favicon.ico" />
                @import url(`https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Gupter:wght@400;500;700&display=swap`);
                

            </Head>

            <div className="flex">
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