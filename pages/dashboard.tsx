import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import utilStyles from '@/styles/utils.module.css';
import runGetNews from '@/lib/NewsController';
import { ArticleList } from '@/components/Article/ArticleList';
import { TopArticleList } from '@/components/Article/TopArticleList';
import { getArticleIdList } from '@/config/firestore';
import { useEffect, useState } from 'react';
import LeftNavigationBar  from '@/components/common/LeftNavigationBar'
import Script from 'next/script';

/*
    The page where the user first enters after he logs in
*/
const Dashboard = () => {

    // Instead of const articleIdList = getArticleIdList()
    // For react need to use this state management thing so that the the Promise will be awaited
    const [articleIdList, setArticleIdList] = useState<string[]>([]);

    useEffect(() => {
        const fetchArticleIdList = async () => {
            const idList = await getArticleIdList();
            setArticleIdList(idList);
        };

        fetchArticleIdList();
    }, []);

    const articleIdListRandom = articleIdList.sort(() => Math.random() - Math.random()).slice(0, 10);
    //const articleIdListRandom = ['FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u'];
    const topArticleIdListRandom = ['FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', 'FTxPhS9YXs3DlrTANB3u', ];

    
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
                <link rel="icon" href="/favicon.png" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Gupter:wght@400;500;700&display=swap"/>
                
                <Script strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                />

                <Script strategy="lazyOnload">
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

            <div className="flex">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={0} />
                                    

                {/* Right Content */}
                <div className="width-3/4 bg-white overflow-y-auto" style={{ height: '100vh' }}>
                    {/* Top articles */}
                    <h2 className="font-gupter text-neutral-headings-black font-bold text-4xl ml-16 mt-16">Today's Top Stories</h2>
                    <TopArticleList articleIdList={topArticleIdListRandom} />

                    {/* Other articles, as recommended by the algorithm */}
                    <h2 className="font-gupter text-neutral-headings-black font-bold text-4xl ml-16 mt-16">Stories For You</h2>
                    <ArticleList articleIdList={articleIdListRandom} />
                </div>

    
            </div>


            
        </ProtectedRoute>
    );
};

export default Dashboard;