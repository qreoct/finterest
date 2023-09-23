import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import utilStyles from '@/styles/utils.module.css';
import runGetNews from '@/lib/NewsController';
import { ArticleList } from '@/components/ArticleStuff/ArticleList';
import { getArticleIdList } from '@/config/firestore';
import { useEffect, useState } from 'react';
import { BiNews, BiMessage, BiSmile, BiLogOutCircle, BiStar } from "react-icons/bi";

/*
    The page where the user first enters after he logs in
*/
const Dashboard = () => {
    const { logOut } = useAuth();
    const router = useRouter();

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
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Gupter:wght@400;500;700&display=swap');
                

            </Head>

            <div className="flex min-h-screen">
                {/* Navigation Bar */}
                <div className="w-1/4 flex flex-col justify-between bg-neutral-color-300 p-16 fixed top-0 left-0 bottom-0 overflow-y-auto">
                    {/* Logo Bar */}
                    <div className="flex-none flex flex-col justify-center items-center text-center">
                        {/* First Row */}
                        <div className="flex items-center">
                            {/* Image */}
                            <img src="/assets/finterest-logo.png" alt="Finterest Logo" className="w-7 h-10 m-2" />
                            {/* Title */}
                            <h2 className="font-gupter text-neutral-headings-black font-bold text-4xl ml-2">Finterest</h2>
                        </div>

                        {/* Second Row */}
                        <div className="mt-2 pt-2">
                            {/* Subtitle */}
                            <h6 className="text-sm text-neutral-text-gray uppercase">Where wisdom meets wealth</h6>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex-grow flex justify-center items-center">
                        <div className="flex-col justify-center items-start space-y-8">
                            <div className="flex justify-center items-center">
                                <BiNews className='text-3xl cursor-pointer text-neutral-headings-black m-2' />
                                <h5 className="font-dmsans text-neutral-headings-black font-bold text-xl ml-2">News</h5>
                            </div>

                            <div className="flex justify-center items-center">
                                <BiMessage className='text-3xl cursor-pointer text-neutral-headings-black m-2' />
                                <h5 className="font-dmsans text-neutral-headings-black text-xl ml-2">AI Chat</h5>
                            </div>

                            <div className="flex justify-center items-center">
                                <BiSmile className='text-3xl cursor-pointer text-neutral-headings-black m-2' />
                                <h5 className="font-dmsans text-neutral-headings-black text-xl ml-2">Profile</h5>
                            </div>

                           
                            <div className="flex justify-center items-center">
                                <button onClick={
                                        () => { logOut();
                                        router.push('/');
                                        }}
                                
                                    className="bg-transparent text-neutral-headings-black hover:text-neutral-text-gray py-2 px-8 rounded-full flex items-center">
                                    <BiLogOutCircle className='text-3xl cursor-pointer m-2' />
                                    <span className="font-dmsans text-xl ml-2">Logout</span>
                                </button>
                            </div>

                            <div className="flex justify-center items-center">
                                <button className="bg-netural-headings-black hover:bg-neutral-text-gray text-white font-semibold py-2 px-8 rounded-full flex items-center mt-5">
                                    <BiStar className='text-3xl cursor-pointer text-white m-2' />
                                    <span className="mr-2">Upgrade</span>
                                </button> 
                            </div>
                        </div>
                    </div>
                    <div className="flex-none flex justify-center items-center">
                    <h6 className="text-sm text-neutral-text-gray uppercase">Copyright 2023</h6>
                    </div>
                </div>
                                    

                {/* Right Content */}
                <div className="flex-1 bg-white p-4 overflow-y-auto">
                    {/* Your right content goes here */}
                </div>
            </div>


            
        </ProtectedRoute>
    );
};

export default Dashboard;