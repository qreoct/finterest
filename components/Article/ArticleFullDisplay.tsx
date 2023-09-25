import { ArticleType } from "@/types/ArticleTypes"
import { useEffect, useState } from "react";
import { getArticle } from "@/config/firestore";
import { convertToArticleType } from "@/types/ArticleTypes";
import Head from 'next/head';
import { BiArrowBack, BiSolidMagicWand } from "react-icons/bi";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import ArticleConvo from "../ChatStuff/ArticleConvo";
import { HighlightMenu, MenuButton } from "react-highlight-menu";
import LeftNavigationBar  from '@/components/common/LeftNavigationBar'

//Represents a component that shows the full information of an article when the user clicks into it
export const ArticleFullDisplay = ({ articleId }: { articleId: string }) => {

    /* Routing */
    const router = useRouter();


    /* State variables */

    //To pass highlighted text information to article convo, which is a child component
    let [highlightedText, setHighlightedText] = useState('');
    
    //JSX elements that contain the currently displayed content
    let [articleContent, setArticleContent] = useState<JSX.Element[] | undefined>([
        <div key={1}>Placeholder element</div>,
    ]);
    
    //Retrieved article from the database
    let [currArticle, setConvertedArticle] = useState<ArticleType | null>(null);

    //Checks whether text is currently summarised
    let [isTextSummarised, setIsTextSummarised] = useState<Boolean>(false);

    //JSX elements that contain the paragraphs of the article
    let [processedContent, setProcessedContent] = useState<JSX.Element[] | undefined>();


    /* Effects */
    
    //Runs when component first gets mounted to fetch the article from the database
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



    //Runs when the article has been fetched from the database, to parse it into JSX paragraph elements
    useEffect(() => {
        parseArticleContent()
    }, [currArticle]);


    /* Miscelleanous */

    //Displays loading indicator if article has not been retrieved
    if (! currArticle) {
        return <div className="flex justify-center items-center font-dmsans text-neutral-headings-black font-bold text-4xl h-screen w-screen bg-neutral-color-300">
            <h3>Loading article...</h3>
        </div>;
    }


    /* Helper Functions */

    // Parse article content string and add some new lines after fullstops. This is to make the article content look nicer.
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

    //Converts between summarised text and original article on the UI
    function toggleBetweenOriginalAndSummary() {
        if (isTextSummarised) {
            //Display original text
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
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Gupter:wght@400;500;700&display=swap"/>
            </Head>

            <div className="flex">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={0} />
                                    
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

                        <div id='article-content' className='article-content-div'>
                            {/* Highlighting feature */}
                            <HighlightMenu
                                target=".article-content-div"
                                allowedPlacements={["top", "bottom"]}
                                styles = {{ backgroundColor: "#5D5A88" }}
                                menu={({ selectedText = ""}) => (
                                <>
                                    <MenuButton
                                    title="Search Term"
                                    onClick={() => {
                                       setHighlightedText(selectedText);
                                    }}
                                    icon="magnifying-glass"
                                    style = {{ backgroundColor: "#5D5A88" }}
                                    />
                                </>
                                )}
                            />

                            {articleContent}
                        </div>


                    </div>

                </div>

                 {/* Right Content */}
                 <div className="w-1/4 bg-neutral-color-300 overflow-y-auto">
                   <ArticleConvo textFromArticle={highlightedText} />
                </div>
            </div>

        </ProtectedRoute>
    );
}
