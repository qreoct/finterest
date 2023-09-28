import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getArticle } from "@/config/firestore";
import { ArticleType, convertToArticleType } from "@/types/ArticleTypes";
import { HighlightMenu, MenuButton } from "react-highlight-menu";
import { BiNews, BiSolidMagicWand } from "react-icons/bi";
import router from 'next/router';
import summarizeArticleAndStoreInDb from "@/lib/SummaryController";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface ArticleDisplayProps {
    articleId: string;
    openChat: () => void;
    setHighlightedText: Dispatch<SetStateAction<string>>;
    setHighlighterError: Dispatch<SetStateAction<string>>;
};

export const ArticleDisplay = ({ articleId, openChat, setHighlightedText, setHighlighterError }: ArticleDisplayProps) => {

    let [highlighterLoading, setHighlighterLoading] = useState(false);

    //Checks whether text is currently summarised
    let [isTextSummarised, setIsTextSummarised] = useState<Boolean>(false);
    let [isSummaryShowing, setIsSummaryShowing] = useState<Boolean>(false);

    //Retrieved article from the database
    let [currArticle, setCurrArticle] = useState<ArticleType | null>(null);

    //JSX elements that contain the paragraphs of the article
    let [processedContent, setProcessedContent] = useState<JSX.Element[] | undefined>();

    //JSX elements that contain the currently displayed content
    let [displayedArticleContent, setDisplayedArticleContent] = useState<JSX.Element[] | undefined>([
        <div key={1}>Placeholder element</div>,
    ]);

    let [articleSummary, setArticleSummary] = useState("");

    let [isArticleFetching, setIsArticleFetching] = useState(true);
    let [isSummaryFetching, setIsSummaryFetching] = useState(false);

    /* Effects */

    //Runs when component first gets mounted to fetch the article from the database
    useEffect(() => {
        const fetchArticle = async () => {
            const resolvedArticle = await getArticle(articleId);
            let currArticle = convertToArticleType(resolvedArticle);
            if (currArticle == null) {
                console.warn("Article not found");
                return (
                    <div className="flex justify-center items-center font-dmsans text-neutral-headings-black font-bold text-4xl h-screen w-screen bg-neutral-color-300">
                        <h3>Encountered an error fetching this article.</h3>
                    </div>
                );
            }
            if (currArticle.content_summary && currArticle.content_summary != "") {
                console.log("text is already summarized: " + currArticle.content_summary);
                setIsTextSummarised(true);
                setArticleSummary(currArticle.content_summary);
            }
            setCurrArticle(currArticle);
            setIsArticleFetching(false);
            console.log("fetched article " + JSON.stringify(currArticle));
        };

        fetchArticle();
    }, []);

    //Runs when the article has been fetched from the database, to parse it into JSX paragraph elements
    useEffect(() => {
        currArticle && parseArticleContent(currArticle.content)
    }, [currArticle]);


    /* Helper Functions */

    // Parse article content string and add some new lines after fullstops. This is to make the article content look nicer.
    function parseArticleContent(content: string) {
        const parsedContent = content.split(new RegExp("[.?!] ")).map((sentence) => {
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

        setDisplayedArticleContent(paragraphs);
        setProcessedContent(paragraphs);
    }


    //Converts between summarised text and original article on the UI
    async function toggleSummary() {
        if (isSummaryShowing) {
            // Display original text
            setDisplayedArticleContent(processedContent);
            setIsSummaryShowing(false);
        } else {
            setIsSummaryFetching(true);
            setIsSummaryShowing(true);
            const summarisedText = [<p key={1} className="text-stone-600 font-dmsans mt-4">Fetching summary...</p>];
            setDisplayedArticleContent(summarisedText);

            if (!isTextSummarised && currArticle) {
                const summary = await summarizeArticleAndStoreInDb(articleId, currArticle.content)
                const summarisedText = [<p key={1} className="text-stone-600 font-dmsans mt-4">{summary}</p>];
                setDisplayedArticleContent(summarisedText);
                setArticleSummary(summary);
                setIsTextSummarised(true);
            } else {
                const summarisedText = [<p key={1} className="text-stone-600 font-dmsans mt-4">{articleSummary}</p>];
                setDisplayedArticleContent(summarisedText);
            }
            setIsSummaryFetching(false);
        }
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
        <>
            {!currArticle || isArticleFetching ?
                <div className="flex justify-center items-center font-dmsans text-neutral-headings-black font-bold text-4xl h-screen w-screen bg-neutral-color-300">
                    <h3>Loading article...</h3>
                </div> :
                <>
                    <div id="article-summary" className="hidden w-1/4 flex-col justify-start mt-8 ml-8 mr-16 space-y-2">
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase tracking-widest'>{currArticle.source_id}</h5>
                        <h1 className='font-dmsans font-bold text-neutral-headings-black text-2xl'>{currArticle.title}</h1>
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase'>{currArticle.creator}</h5>
                        <p className='font-dmsans text-neutral-text-gray text-base' style={{ marginBottom: '30px' }}>{currArticle.pubDate}</p>
                        <p className='font-dmsans text-neutral-text-gray text-base' style={{ marginBottom: '30px' }}>{currArticle.description}</p>
                    </div>

                    <div className="flex flex-col justify-start mt-8 ml-2 mr-12 md:ml-8 md:mr-16 space-y-2">
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase tracking-widest'>{currArticle.source_id}</h5>
                        <h1 className='font-dmsans font-bold text-neutral-headings-black text-2xl'>{currArticle.title}</h1>
                        <h5 className='font-dmsans text-neutral-text-gray text-sm uppercase'>{currArticle.creator}</h5>
                        <p className='font-dmsans text-neutral-text-gray text-base' style={{ marginBottom: '30px' }}>{currArticle.pubDate}</p>

                        <img src={currArticle.image_url} alt={currArticle.title} className='w-2/3 h-2/3 md:w-2/3 md:h-2/3 xl:w-3/4 xl:h-3/4 2xl:w-1/2 2xl:h-1/2 self-center' />

                        <button className="bg-stone-100 border-2 border-stone-200 hover:bg-stone-200 text-finterest-solid font-bold p-2
                    xl:w-2/3 2xl:w-max rounded-xl flex justify-center items-center mt-5 self-center duration-200"
                            disabled={isSummaryFetching}
                            style={{ marginTop: '5%', marginBottom: '5%' }}
                            onClick={toggleSummary}>
                            {isSummaryFetching ? <LoadingSpinner /> :
                                <>

                                    {isSummaryShowing ?
                                        <BiNews className='text-2xl cursor-pointer' /> :
                                        <BiSolidMagicWand className='text-2xl cursor-pointer' />
                                    }
                                    <span className="ml-2"> {isSummaryShowing ?
                                        "Read Full Article" :
                                        "AI Summary"}
                                    </span>
                                </>
                            }
                        </button>


                        <div id='article-content' className='article-content-div pb-10 lg:mr-8'>
                            {/* Highlighting feature */}
                            <HighlightMenu
                                target=".article-content-div"
                                allowedPlacements={["top", "bottom"]}
                                styles={{ backgroundColor: "#FFFFFF" }}
                                menu={({ selectedText = "", setMenuOpen }) => (
                                    <>
                                        {highlighterLoading ?
                                            <LoadingSpinner />
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

                            {displayedArticleContent}
                        </div>
                    </div>
                </>
            }
        </>
    )
}