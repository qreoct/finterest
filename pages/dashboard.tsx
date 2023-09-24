import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import utilStyles from '@/styles/utils.module.css';
import runGetNews from '@/utils/newsfetcher';
import { ArticleList } from '@/components/ArticleStuff/ArticleList';
import { getPersonalisedArticleIdList } from '@/config/firestore';
import { useEffect, useState } from 'react';

/*
    The page where the user first enters after he logs in
*/
const Dashboard = () => {
    const { logOut, user } = useAuth();
    const router = useRouter();

    // Instead of const articleIdList = getArticleIdList()
    // For react need to use this state management thing so that the the Promise will be awaited
    const [articleIdList, setArticleIdList] = useState<string[]>([]);

    useEffect(() => {
        const fetchArticleIdList = async () => {
            const NUMBER_OF_ARTICLES_TO_RECOMMEND = 10
            const idList = await getPersonalisedArticleIdList(user.uid, NUMBER_OF_ARTICLES_TO_RECOMMEND);
            setArticleIdList(idList);
        };

        fetchArticleIdList();
    }, []);

    const articleIdListPersonalised = articleIdList;

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
            </Head>

            <div className="container mx-auto flex min-h-screen items-center py-2">
                <div className="mx-auto mt-24 overflow-y-hidden px-12 py-24 text-gray-600">

                    <section>
                        <h1 className={utilStyles.h1heading}>Finterest</h1>

                        <h2 className="mb-4 text-2xl font-semibold">
                            You are logged in!
                        </h2>

                        <p>
                            Test Page for Page Routing: <NextLink className={utilStyles.linkNormal} href="/articles/article-main">article</NextLink>
                        </p>
                    </section>

                    <section>
                        <h4 className="p-10 text-2xl">Recommended Articles</h4>
                        <ArticleList articleIdList={articleIdListPersonalised} />
                    </section>

                    <section className={utilStyles.headingMd}>
                        <h4 className={utilStyles.h4heading}>Finterest Chats</h4>
                        <p>
                            <NextLink className={utilStyles.linkNormal} href="/chats/first-chat">Start a new chat!</NextLink>
                        </p>
                        <br />
                    </section>


                    <div>
                        <button
                            onClick={() => {
                                runGetNews();
                            }}
                            className="rounded-md bg-green-600 px-10 py-3 text-white shadow-sm hover:bg-green-700"
                        >
                            (Test Button) Run News Fetcher
                        </button>
                    </div>

                    {/* <div className="mb-8 flex items-center justify-center">
                        <button
                            onClick={() => {
                                logOut();
                                router.push('/');
                            }}
                            className="rounded-md bg-green-600 px-10 py-3 text-white shadow-sm hover:bg-green-700"
                        >
                            Logout
                        </button>
                    </div> */}
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;