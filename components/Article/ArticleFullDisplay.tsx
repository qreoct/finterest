import { ArticleType } from "@/types/ArticleTypes"
import { DocumentData } from "firebase/firestore"
import NextLink from "next/link"
import { useEffect, useState } from "react";
import { getArticle } from "@/config/firestore";
import { convertToArticleType } from "@/types/ArticleTypes";
import Head from 'next/head';
import { BiNews, BiMessage, BiSmile, BiLogOutCircle, BiStar, BiArrowBack, BiSolidMagicWand } from "react-icons/bi";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import ArticleConvo from "../ChatStuff/ArticleConvo";
import { parse } from "path";



export const ArticleFullDisplay = ({ articleId }: { articleId: string }) => {

    const { logOut } = useAuth();
    const router = useRouter();

 

    let [articleContent, setArticleContent] = useState<JSX.Element[] | undefined>([
        <div key={1}>Placeholder element</div>,
    ]);
    
    // Get the relevant article from database
    let [currArticle, setConvertedArticle] = useState<ArticleType | null>(null);


    // Checks whether text is currently summarised
    let [isTextSummarised, setIsTextSummarised] = useState<Boolean>(false);

    let [processedContent, setProcessedContent] = useState<JSX.Element[] | undefined>();


    useEffect(() => {
        const fetchArticle = async () => {
            const resolvedArticle = await getArticle(articleId);
            let convertedArticle = convertToArticleType(resolvedArticle);

            if (convertedArticle == null) {
                console.log("Article not found");
                return;
            }

            setConvertedArticle(convertedArticle);
            
        };

        fetchArticle();
    }, []);


    useEffect(() => {
        parseArticleContent()
    }, [currArticle]);

    //Loading indicator
    if (! currArticle) {
        return <div className="flex justify-center items-center font-dmsans text-neutral-headings-black font-bold text-4xl h-screen w-screen bg-neutral-color-300">
            <h3>Loading article...</h3>
        </div>;
    }

    // Parse article content string and add some new lines after fullstops.
    // This is to make the article content look nicer.
    function parseArticleContent() {
        const parsedContent = currArticle?.content?.split(new RegExp("[.?!] ")).map((sentence) => {
            const randomNum = Math.random();
            if (randomNum < 0.1) {
                return sentence + '.\n\n';
            } else if (randomNum < 0.2) {
                return sentence + '.\n';
            } else {
                return sentence + '.';
            }
        }).join('  ');

        // Need to manually add paragraph tags to each paragraph otherwise the text will be one big block
        const paragraphs = parsedContent?.split('\n').map((paragraph, index) => (
            <p key={index} className="text-neutral-text-gray font-dmsans mt-4">{paragraph}</p>
        ));

        setArticleContent(paragraphs);
        setProcessedContent(paragraphs);

    }








    //Converts between summarised text and original article
    function toggleBetweenOriginalAndSummary() {
        if (isTextSummarised) {
            //Display original text
            console.log(processedContent);
            setArticleContent(processedContent);
        } else {
            const summarisedText = [<p key={1} className="text-neutral-text-gray font-dmsans mt-4">{ currArticle?.content_summary}</p>];
            setArticleContent(summarisedText);
        }

        setIsTextSummarised(! isTextSummarised);

    }








    return (
        <ProtectedRoute>
            <Head>
                <title>View Article - Finterest</title>
                <meta
                    name="description"
                    content="Finterest Article"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Gupter:wght@400;500;700&display=swap');
                

            </Head>

            <div className="flex">
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
                                    

                {/* Middle Content */}
                <div className="w-1/2 bg-white overflow-y-auto p-4" style={{ marginLeft: '25%', height: '100vh' }}>
                    {/* Back navigation button */}
                    <button onClick={() => { router.push('/'); }} className="bg-transparent text-neutral-headings-black hover:text-neutral-text-gray ml-16 mr-16 mt-16">
                        <BiArrowBack className='text-3xl cursor-pointer m-2' />        
                    </button>

                    <div className="flex flex-col justify-start mt-8 ml-16 mr-16 space-y-2">
                        <h3 className='font-dmsans font-bold text-neutral-headings-black text-2xl'>{currArticle.title}</h3>
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase'>{currArticle.source_id}</h5>
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase'>Written by: {currArticle.creator}</h5>
                        <p className='font-dmsans text-neutral-text-gray text-base'>{currArticle.pubDate}</p>
                        
                        <img src={currArticle.image_url} alt={ currArticle.title } className='w-1/2 h-1/2 self-center' />

                        {! isTextSummarised ? (
                            <button className="bg-neutral-color-300 hover:bg-neutral-text-gray text-neutral-headings-black hover:text-white p-2 w-1/4 font-semibold rounded-md flex justify-center items-center mt-5 self-center duration-200" style={{ marginTop: '5%', marginBottom: '5%'  }} onClick={ toggleBetweenOriginalAndSummary }>
                                <BiSolidMagicWand className='text-3xl cursor-pointer' />
                                <span className="ml-2">AI Summary</span>
                            </button> 
                        ) : (
                            <button className="bg-neutral-text-gray hover:bg-neutral-color-300 text-white hover:text-neutral-headings-black p-2 w-1/4 font-semibold rounded-md flex justify-center items-center mt-5 self-center duration-200" style={{ marginTop: '5%', marginBottom: '5%' }} onClick={ toggleBetweenOriginalAndSummary }>
                                <BiSolidMagicWand className='text-3xl cursor-pointer' />
                                <span className="ml-2">AI Summary</span>
                            </button> 
             
                        )}




                        
                        


                        <div id='article-content'>
                            {articleContent}
                        </div>


                    </div>

                </div>

                 {/* Right Content */}
                 <div className="w-1/4 bg-neutral-color-300 overflow-y-auto">
                   <ArticleConvo />
                </div>
            </div>


            
        </ProtectedRoute>




    );

    // return (
    //     <div className="min-h-screen flex flex-col justify-between">
    //         <div className="p-6">
    //             <h1 className="text-3xl font-bold mb-4">{currArticle.title}</h1>
    //             <section className="flex-col">
    //                 <section className="mb-4">
    //                     <p className="text-gray-600 mb-2">Description: {currArticle.description ?? "None"}</p>
    //                 </section>

    //                 <section className="mb-4 flex justify-center gap-96">
    //                     <p className="text-gray-600 mb-2">Creator: {creatorString}</p>
    //                     <p className="text-gray-600 mb-2">Published On: {pubDateString}</p>
    //                 </section>

    //                 <section className="mb-4 flex justify-center gap-96">
    //                     <p className="text-gray-600 mb-2">Source ID: {currArticle.source_id}</p>
    //                     <p className="text-gray-600 mb-2">Categories: {categoryString}</p>
    //                 </section>

    //             </section>
    //             <img src={currArticle.image_url} alt={currArticle.title} className="max-w-full mb-4" />

    //             <p className="text-gray-600 p-3 font-bold text-xl">Summary Level: {summaryLevel}</p>

    //             <OpenChatPageButton article={currArticle} />

    //             <section className="mb-4 border-4 border-black m-10 p-10 text-lg">

    //                 {paragraphs}
    //             </section>

    //             <OpenChatPageButton article={currArticle} />
    //         </div>
    //         <Footer children={false} showBackButton={true} />
    //     </div>
    // );
}
