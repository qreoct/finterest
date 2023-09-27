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
import LeftNavigationBar from '@/components/common/LeftNavigationBar';

//Represents a component that shows the full information of an article when the user clicks into it
export const ArticleFullDisplay = ({ articleId }: { articleId: string }) => {

    /* Routing */
    const router = useRouter();

    /* State variables */

    //To pass highlighted text information to article convo, which is a child component
    let [highlightedText, setHighlightedText] = useState('');

    let [highlighterLoading, setHighlighterLoading] = useState(false);
    let [highlighterError, setHighlighterError] = useState('');

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
    if (!currArticle) {
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
            const summarisedText = [<p key={1} className="text-neutral-text-gray font-dmsans mt-4">{currArticle?.content_summary}</p>];
            setArticleContent(summarisedText);
        }
        setIsTextSummarised(!isTextSummarised);
    }

    //Checks if text is explainable before sending to OpenAI
    function explainText(text: string, callback: Function) {
        setHighlighterLoading(true);
        if (text.trim().length <= 3) {
            setHighlighterLoading(false);
            setHighlighterError("Please select longer text.");
        } else if (text.length > 300) {
            setHighlighterLoading(false);
            setHighlighterError("Your selected text is too long. Please select shorter text.");
        } else {
            setHighlighterLoading(false);
            setHighlightedText(text);
        }
        setTimeout(() => setHighlighterError(""), 500);
        callback();
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
                <LeftNavigationBar tabIndex={0} />

                {/* Middle Content */}
                <div className="w-full bg-white overflow-y-auto flex items-start" style={{ height: '100vh' }}>
                    {/* Back navigation button */}
                    <button onClick={() => { router.push('/'); }} className="bg-transparent text-neutral-headings-black hover:text-gold-500 ml-12 mr-2 mt-12">
                        <BiArrowBack className='text-3xl cursor-pointer m-2' />
                    </button>

                    <div className="flex flex-col justify-start mt-8 ml-8 mr-16 space-y-2">
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase tracking-widest'>{currArticle.source_id}</h5>
                        <h1 className='font-dmsans font-bold text-neutral-headings-black text-2xl'>{currArticle.title}</h1>
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase'>{currArticle.creator}</h5>
                        <p className='font-dmsans text-neutral-text-gray text-base'>{currArticle.pubDate}</p>

                        <img src={currArticle.image_url} alt={currArticle.title} className='w-1/2 h-1/2 self-center' />

                        {!isTextSummarised ? (
                            <button className="bg-neutral-color-300 hover:bg-neutral-text-gray text-neutral-headings-black hover:text-white p-2 w-1/4 font-semibold rounded-md flex justify-center items-center mt-5 self-center duration-200" style={{ marginTop: '5%', marginBottom: '5%' }} onClick={toggleBetweenOriginalAndSummary}>
                                <BiSolidMagicWand className='text-3xl cursor-pointer' />
                                <span className="ml-2">AI Summary</span>
                            </button>
                        ) : (
                            <button className="bg-neutral-text-gray hover:bg-neutral-color-300 text-white hover:text-neutral-headings-black
                            p-2 w-1/4 font-semibold rounded-md flex justify-center items-center mt-5 self-center duration-200"
                                style={{ marginTop: '5%', marginBottom: '5%' }}
                                onClick={toggleBetweenOriginalAndSummary}>
                                <BiSolidMagicWand className='text-3xl cursor-pointer' />
                                <span className="ml-2">AI Summary</span>
                            </button>

                        )}

                        <div id='article-content' className='article-content-div max-w-prose'>
                            {/* Highlighting feature */}
                            <HighlightMenu
                                target=".article-content-div"
                                allowedPlacements={["top", "bottom"]}
                                styles={{ backgroundColor: "#FFFFFF" }}
                                menu={({ selectedText = "", setMenuOpen }) => (
                                    <>
                                        {highlighterLoading ?
                                                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid
                                            border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                    role="status">
                                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </div>
                                                :
                                                <MenuButton
                                                    title="Explain with AI"
                                                    onClick={() => {
                                                        explainText(selectedText, setMenuOpen);
                                                    }}
                                                    icon="magnifying-glass"
                                                    style={{ backgroundColor: "#FFFFFF", color: "#1C1917" }}
                                                >
                                                    Explain
                                                </MenuButton>
                                        }
                                    </>
                                )}
                            />

                            {articleContent}
                        </div>


                    </div>

                </div>

                {/* Right Content */}
                <div className="w-1/2 max-w-lg bg-neutral-color-300 overflow-y-auto">
                    <ArticleConvo textFromArticle={highlightedText} chatError={highlighterError} />
                </div>
            </div>

        </ProtectedRoute>
    );
}
