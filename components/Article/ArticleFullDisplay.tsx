import { ArticleType } from "@/types/ArticleTypes"
import { useEffect, useState } from "react";
import { getArticle, updateUserHistory } from "@/config/firestore";
import { convertToArticleType } from "@/types/ArticleTypes";
import Head from 'next/head';
import { BiArrowBack, BiSolidMagicWand, BiMessage } from "react-icons/bi";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import ArticleConvo from "../ChatStuff/ArticleConvo";
import { HighlightMenu, MenuButton } from "react-highlight-menu";
import LeftNavigationBar from '@/components/common/LeftNavigationBar';
import chatboxStyles from '@/styles/chatbox.module.css';

//Represents a component that shows the full information of an article when the user clicks into it
export const ArticleFullDisplay = ({ articleId }: { articleId: string }) => {

    /* Routing */
    const router = useRouter();

    /* State variables */
    const { user } = useAuth();

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

    //Toggle between chat view and non chat view
    let [isChatOpen, setChatOpen] = useState(false);


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

    // Update user history on clicking into article
    updateUserHistory(user.uid, currArticle.article_id);

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
            <p key={index} className="text-stone-600 font-dmsans mt-4">{paragraph}</p>
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
            const summarisedText = [<p key={1} className="text-stone-600 font-dmsans mt-4">{currArticle?.content_summary}</p>];
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

  
  
    const closeChat = () => {
        const chatItem = document.getElementById('chat-element');
        const articleItem = document.getElementById('article-element');
        const leftNavigationItem = document.getElementById('left-navigation-element');
        const summaryItem = document.getElementById('article-summary');
        const aiChatButton = document.getElementById('ai-chat-button');

        //Make menu disappear
        chatItem?.classList.remove(chatboxStyles['animateshow']);
        chatItem?.classList.remove('flex');
        chatItem?.classList.add('hidden');
        summaryItem?.classList.remove(chatboxStyles['animateshow']);
        summaryItem?.classList.remove('flex');
        summaryItem?.classList.add('hidden');


        //Make menu appear
        articleItem?.classList.add('flex');
        articleItem?.classList.remove('hidden');
        articleItem?.classList.add(chatboxStyles['hiddenelement']);
        leftNavigationItem?.classList.add('flex');
        leftNavigationItem?.classList.remove('hidden');
        leftNavigationItem?.classList.add(chatboxStyles['hiddenelement']);


    
        setTimeout(function () {
            articleItem?.classList.add(chatboxStyles['animateshow']);
            articleItem?.classList.remove(chatboxStyles['hiddenelement']);
            leftNavigationItem?.classList.add(chatboxStyles['animateshow']);
            leftNavigationItem?.classList.remove(chatboxStyles['hiddenelement']);
            aiChatButton?.classList.add('right-10');
            aiChatButton?.classList.remove('left-10');

        }, 40);

        //Update state and cause page to re-render
        setChatOpen(false);


    }


    const openChat = () => {
        //Menu is closed. Need to open it.
        const chatItem = document.getElementById('chat-element');
        const articleItem = document.getElementById('article-element');
        const leftNavigationItem = document.getElementById('left-navigation-element');
        const summaryItem = document.getElementById('article-summary');
        const aiChatButton = document.getElementById('ai-chat-button');


        //Make menu appear
        chatItem?.classList.add('flex');
        chatItem?.classList.remove('hidden');
        chatItem?.classList.add(chatboxStyles['hiddenelement']);
      
        if (window.innerWidth >= 768) {
            summaryItem?.classList.add('flex');
            summaryItem?.classList.remove('hidden');
            summaryItem?.classList.add(chatboxStyles['hiddenelement']);
        }
        
        articleItem?.classList.remove(chatboxStyles['animateshow']);
        articleItem?.classList.remove(chatboxStyles['animateshow']);
        leftNavigationItem?.classList.remove(chatboxStyles['animateshow']);
        leftNavigationItem?.classList.remove(chatboxStyles['animateshow']);
    


        setTimeout(function () {
            chatItem?.classList.add(chatboxStyles['animateshow']);
            chatItem?.classList.remove(chatboxStyles['hiddenelement']);
            if (window.innerWidth >= 768) {
                summaryItem?.classList.add(chatboxStyles['animateshow']);
                summaryItem?.classList.remove(chatboxStyles['hiddenelement']);
            }

            aiChatButton?.classList.add('left-10');
            aiChatButton?.classList.remove('right-10');
        
        }, 40);

        //Make the rest of the content disappear
        articleItem?.classList.remove('flex');
        articleItem?.classList.add('hidden');
       
            leftNavigationItem?.classList.remove('flex');
            leftNavigationItem?.classList.add('hidden');
      


        //Update state and cause page to re-render
        setChatOpen(true);

    }


    
    //Function that handles toggling of chat element
    const handleChatOpenOnClick = async () => {
        if (isChatOpen) {
            closeChat();
            console.log(isChatOpen);
        } else {
            openChat();
            console.log(isChatOpen);
        }
    }


    

    //Xl Media Query
    const xlBreakpoint = window.matchMedia('(min-width: 1280px)');

    // Function to handle the 'xl' breakpoint change
    function handleXlBreakpointChange(event: MediaQueryListEvent) {
    if (event.matches) {
        // 'xl' breakpoint has been reached
        closeChat();
        const aiChatButton = document.getElementById('ai-chat-button');
        aiChatButton?.classList.add('hidden');
    } else {
        const aiChatButton = document.getElementById('ai-chat-button');
        aiChatButton?.classList.remove('hidden');

    }
    }

    // Add an event listener to the media query
    xlBreakpoint.addEventListener('change', handleXlBreakpointChange);

    //Md Media Query
    // Define a media query for the 'md' breakpoint
    const mdBreakpoint = window.matchMedia('(min-width: 768px)');

    // Function to handle the 'md' breakpoint change
    function handleMdBreakpointChange(event: MediaQueryListEvent) {
        if (event.matches) {
            const summaryItem = document.getElementById('article-summary');
            // 'md' breakpoint has been reached
            if (summaryItem?.classList.contains('hidden') && isChatOpen) {
                summaryItem?.classList.add('flex');
                summaryItem?.classList.remove('hidden');
                summaryItem?.classList.remove(chatboxStyles['hiddenelement']);
            } else if (summaryItem?.classList.contains('flex') && !isChatOpen) {
                const summaryItem = document.getElementById('article-summary');
                summaryItem?.classList.remove(chatboxStyles['animateshow']);
                summaryItem?.classList.remove('flex');
                summaryItem?.classList.add('hidden');
            }

        }
    }


    // Add an event listener to the media query
    mdBreakpoint.addEventListener('change', handleMdBreakpointChange);

    const mdMaxBreakpoint = window.matchMedia('(max-width: 768px)');

    function handleMdMaxBreakpointChange(event: MediaQueryListEvent) {
        if (event.matches) {
            const summaryItem = document.getElementById('article-summary');
            summaryItem?.classList.remove(chatboxStyles['animateshow']);
            summaryItem?.classList.remove('flex');
            summaryItem?.classList.add('hidden');
        }
    }




    mdMaxBreakpoint.addEventListener('change', handleMdMaxBreakpointChange);








;
















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
            </Head>

            <div id='parent-container' className="flex items-center flex-col-reverse md:flex-row md:items-start h-screen overflow-y-hidden">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={0} />
                <div id="article-summary" className="hidden w-1/4 flex-col justify-start mt-8 ml-8 mr-16 space-y-2">
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase tracking-widest'>{currArticle.source_id}</h5>
                        <h1 className='font-dmsans font-bold text-neutral-headings-black text-2xl'>{currArticle.title}</h1>
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase'>{currArticle.creator}</h5>
                        <p className='font-dmsans text-neutral-text-gray text-base' style={{ marginBottom: '30px' }}>{currArticle.pubDate}</p>
                        <p className='font-dmsans text-neutral-text-gray text-base' style={{ marginBottom: '30px' }}>{currArticle.description}</p>
                </div>


                {/* Middle Content */}
                <div id="article-element" className="w-full bg-white overflow-y-auto flex items-start h-screen">
                    {/* Back navigation button */}
                    <button onClick={() => { router.back(); }} className="bg-transparent text-neutral-headings-black hover:text-gold-500 ml-4 lg:ml-6 xl:ml-8 2xl:ml-12 mr-2 mt-12">
                        <BiArrowBack className='text-3xl cursor-pointer m-2' />
                    </button>

                    <div className="flex flex-col justify-start mt-8 ml-2 mr-12 md:ml-8 md:mr-16 space-y-2">
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase tracking-widest'>{currArticle.source_id}</h5>
                        <h1 className='font-dmsans font-bold text-neutral-headings-black text-2xl'>{currArticle.title}</h1>
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase'>{currArticle.creator}</h5>
                        <p className='font-dmsans text-neutral-text-gray text-base' style={{ marginBottom: '30px' }}>{currArticle.pubDate}</p>

                        <img src={currArticle.image_url} alt={currArticle.title} className='w-2/3 h-2/3 md:w-2/3 md:h-2/3 xl:w-3/4 xl:h-3/4 2xl:w-1/2 2xl:h-1/2 self-center'/>

                        {!isTextSummarised ? (
                            <button className="bg-stone-100 border-2 border-stone-200 hover:bg-stone-200 text-finterest-solid font-bold p-2 xl:w-2/3 2xl:w-1/4 rounded-xl flex justify-center items-center mt-5 self-center duration-200" style={{ marginTop: '5%', marginBottom: '5%' }} onClick={toggleBetweenOriginalAndSummary}>
                                <BiSolidMagicWand className='text-2xl cursor-pointer' />
                                <span className="ml-2">AI Summary</span>
                            </button>
                        ) : (
                            <button className="bg-stone-200 border-2 border-stone-200 hover:bg-stone-100 text-finterest-solid font-bold p-2 xl:w-2/3 2xl:w-1/4 rounded-xl
                            flex justify-center items-center mt-5 self-center duration-200"
                                style={{ marginTop: '5%', marginBottom: '5%' }}
                                onClick={toggleBetweenOriginalAndSummary}>
                                <BiSolidMagicWand className='text-2xl cursor-pointer' />
                                <span className="ml-2">AI Summary</span>
                            </button>

                        )}

                        <div id='article-content' className='article-content-div pb-10 lg:mr-8'>
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
                                                        if (window.innerWidth < 1280) {
                                                            openChat();
                                                        }
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
                <div id="chat-element" className="hidden flex-1 w-4/5 xl:flex xl:flex-auto xl:w-1/2 xl:max-w-lg bg-neutral-color-300 overflow-y-hidden py-8">
                    <ArticleConvo textFromArticle={highlightedText} chatError={highlighterError} />
                </div>



                {/* AI Chat Button */}
                <div id='ai-chat-button' className="flex xl:hidden fixed bottom-28 md:bottom-16 right-10">
                    <button id='ai-chat-button-element' className="bg-gold-500 hover:bg-gold-900 text-white font-bold px-4 py-3 rounded-full flex justify-center items-center mt-5 self-center duration-200" onClick={ handleChatOpenOnClick }>
                        <BiMessage className='text-4xl cursor-pointer' />
                        <span className="ml-2">AI Chat</span>
                    </button>
                </div>
                
            </div>

        </ProtectedRoute>
    );
}
