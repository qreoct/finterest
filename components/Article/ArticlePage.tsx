import { ArticleType } from "@/types/ArticleTypes"
import { useState } from "react";
import { updateUserHistory } from "@/config/firestore";
import Head from 'next/head';
import { BiArrowBack, BiSolidMagicWand, BiMessage, BiLeftArrow, BiLeftArrowAlt } from "react-icons/bi";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import ArticleConvo from "../ChatStuff/ArticleConvo";
import LeftNavigationBar from '@/components/common/LeftNavigationBar';
import chatboxStyles from '@/styles/chatbox.module.css';
import { ArticleDisplay } from "./ArticleDisplay";

//Represents a component that shows the full information of an article when the user clicks into it
export const ArticlePage = ({ articleId }: { articleId: string }) => {

    /* Routing */
    const router = useRouter();

    /* State variables */
    const { user } = useAuth();

    //To pass highlighted text information to article convo, which is a child component
    let [highlightedText, setHighlightedText] = useState('');
    let [highlighterError, setHighlighterError] = useState('');

    //Toggle between chat view and non chat view
    let [isChatOpen, setChatOpen] = useState(false);

    /* Miscelleanous */

    // Update user history on clicking into article
    updateUserHistory(user.uid, articleId);

    const closeChat = () => {
        const chatItem = document.getElementById('chat-element');
        const articleItem = document.getElementById('article-element');
        const leftNavigationItem = document.getElementById('left-navigation-element');
        const summaryItem = document.getElementById('article-summary');
        const aiChatButton = document.getElementById('ai-chat-button');
        const aiChatButtonText = document.getElementById('ai-chat-button-text');

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
            if (aiChatButtonText != null) {
                aiChatButtonText.textContent = 'AI Chat';
            }

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
        const aiChatButtonText = document.getElementById('ai-chat-button-text');


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
           
            if (aiChatButtonText != null) {
                aiChatButtonText.textContent = 'Back';
            }

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
            
        } else {
            openChat();
          
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

                {/* Middle Content */}
                <div id="article-element" className="w-full bg-white overflow-y-auto flex items-start h-screen md:h-screen">
                    {/* Back navigation button */}
                    <button onClick={() => { router.back(); }} className="bg-transparent text-neutral-headings-black hover:text-gold-500 ml-4 lg:ml-6 xl:ml-8 2xl:ml-12 mr-2 mt-12">
                        <BiArrowBack className='text-3xl cursor-pointer m-2' />
                    </button>

                    <ArticleDisplay articleId={articleId} setHighlightedText={setHighlightedText} setHighlighterError={setHighlighterError} openChat={openChat} />
                </div>

                {/* Right Content */}
                <div id="chat-element" className="hidden flex-1 w-4/5 xl:flex xl:flex-auto xl:w-1/2 xl:max-w-lg bg-neutral-color-300 overflow-y-hidden py-8 h-80vh md:h-screen">
                    <ArticleConvo textFromArticle={highlightedText} chatError={highlighterError} />
                </div>

                {/* AI Chat Button */}
                <div id='ai-chat-button' className="flex xl:hidden fixed bottom-28 md:bottom-16 right-10">
                    <button id='ai-chat-button-element' className="bg-gold-500 hover:bg-gold-900 text-white font-bold px-5 py-3 rounded-full flex justify-center items-center mt-5 self-center duration-200" onClick={handleChatOpenOnClick}>
                        {isChatOpen ? <BiArrowBack className='text-4xl cursor-pointer' /> : <BiMessage className='text-4xl cursor-pointer' />}
                        <span id='ai-chat-button-text' className="ml-3">AI Chat</span>
                    </button>
                </div>

            </div>

        </ProtectedRoute>
    );
}
