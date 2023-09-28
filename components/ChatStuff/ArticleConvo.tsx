import Script from 'next/script';
import { generatePrompts } from '../../utils/openai';
import finterestGenerateArticlePrompt from '../../utils/prompt.json';
import { useRouter } from 'next/router';
import { doesArticleChatExist, getArticle, storeArticleChatMessage, fetchArticleChatHistory } from '@/config/firestore';
import { useEffect, useState, useRef } from 'react';
import { ArticleType, convertToArticleType } from '@/types/ArticleTypes';
import { useAuth } from '@/context/AuthContext';
import { BiSend } from "react-icons/bi";
import { createNewArticleChat } from '@/config/firestore';
import BouncingDots from './BouncingDots';
import { time } from 'console';
import ChatMessageTextArea from './ChatMessageTextArea';

//Helper interface
interface OpenAIMessage {
    role: string;
    content: string;
}

interface IArticleConvo {
    textFromArticle: string;
    chatError: string;
}


//Represents the chatbot interface for an article conversation
export default function ArticleConvo({ textFromArticle, chatError }: IArticleConvo) {
    /* Preparation variables */

    //Article id
    const { id } = useRouter().query;

    //User id
    const { user } = useAuth();
    const userId = user.uid;


    /* State variables */

    //Does user have a prior chat
    const [doesUserHaveChatHistory, setDoesUserHaveChatHistory] = useState(false);

    //Current article being fetched
    const [currArticle, setCurrArticle] = useState<ArticleType | null>({} as ArticleType);

    //State to track message history
    const [messages, setMessages] = useState<OpenAIMessage[]>([]);
    const [messageJsxElements, setMessageJsxElements] = useState<JSX.Element[] | undefined>([]);

    //State to track prompts
    const [chatPrompts, setChatPrompts] = useState<string[]>([]);

    //State to track if we are waiting a response from OpenAI
    const [isAwaitingMessageFromOpenAi, setIsAwaitingMessageFromOpenAI] = useState(false);

    //State to track user input in text area
    const [textInTextArea, setTextInTextArea] = useState('');


    /* Effects */

    //Obtain highlighted text from article
    useEffect(() => {
        if (textFromArticle != '') {
            handleArticleHighlighting(textFromArticle);
        }
    }, [textFromArticle])

    useEffect(() => {
        if (chatError != '') {
            addMessagesToInterface('system', chatError);
            setNewMessageSubmitted(true);
        }
    }, [chatError])


    //Enable auto-scrolling to the bottom of the chat
    //Adapted from https://reacthustle.com/blog/react-auto-scroll-to-bottom-tutorial and ChatGPT
    const ref = useRef<HTMLDivElement>(null);
    const [newMessageSubmitted, setNewMessageSubmitted] = useState(false);
    useEffect(() => {
        if (newMessageSubmitted && ref.current) {
            // Scroll to the bottom of the chat
            ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            })

            // Reset the flag to false
            setNewMessageSubmitted(false);
        }
    }, [newMessageSubmitted]);


    //Runs initially to fetch article from database
    useEffect(() => {
        const fetchArticle = async () => {
            const resolvedArticle = await getArticle(id);
            let convertedArticle = convertToArticleType(resolvedArticle);
            if (convertedArticle == null) {
                console.log("Article not found");
                return;
            }

            // process prompts
            let p1 = convertedArticle.prompt_one ? convertedArticle.prompt_one : "How is this article relevant to my life?";
            let p2 = convertedArticle.prompt_two ? convertedArticle.prompt_two : "What are three takeaways of this article for me?";
            setChatPrompts([p1, p2]);

            setCurrArticle(convertedArticle);
        };

        fetchArticle();
    }, []);


    //Update JSX elements whenever messages changes, in order to update the UI
    useEffect(() => {
        const messageJsxElements = messages.map((openAiMessage, index) => (
            (openAiMessage.role == 'user')
                ? <p key={index} className="text-white font-dmsans mt-4 self-end w-3/4 bg-gold-900 rounded-2xl p-5 mr-4">{openAiMessage.content}</p>
                : <p key={index} className="text-neutral-headings-black font-dmsans mt-4 self-start w-3/4 bg-white rounded-2xl p-5">{openAiMessage.content}</p>
        ));
        setMessageJsxElements(messageJsxElements);
    }, [messages])

    //Process chat after article loads
    useEffect(() => {
        // Check if there is an existing chat
        checkUserChatHistory();

    }, [currArticle]);



    //Loading indicator
    if (!currArticle) {
        return <div className="flex justify-center items-center font-dmsans text-neutral-headings-black font-bold text-4xl h-screen w-screen bg-neutral-color-300">
            <h3>Loading chat...</h3>
        </div>;
    }


    /* Helper functions */

    //Checks if user has a past chat history
    const checkUserChatHistory = async () => {
        if (currArticle.article_id == null) {
            //We do not want to create article chat entry in Firebase until article has been intiialised
            return;
        }

        const newChatId = userId + currArticle.article_id;
        const chatInformation = await doesArticleChatExist(newChatId);
        // Check if there is an existing chat
        if (chatInformation == null) {
            //Chat does not exist. Create a new chat instance.
            await createNewArticleChat(userId, currArticle.article_id, newChatId);
        } else {
            //Chat exists already. Check if there is any message
            if (!chatInformation.hasMessage) {
                //No message history. No action required.
            } else {
                setDoesUserHaveChatHistory(true);

                //Fetch original messages
                const messageHistory = await fetchArticleChatHistory(newChatId);
                const previousMessages = messageHistory.map((pastMessage, index) => (
                    { role: pastMessage.role, content: pastMessage.content }
                ));
                setMessages(previousMessages);
            }
        }


    };

    //Helper function to add messages into the UI
    const addMessagesToInterface = (role: string, message: string) => {
        setMessages((prevMessages) => [...prevMessages, { role: role, content: message }]);
    }

    //Process prompt selected by the user and feed into OpenAI
    const processPrompt = async (prompt: string) => {
        //Show loading indicator
        setIsAwaitingMessageFromOpenAI(true);

        //Process prompt accordingly
        await processUserMessage(prompt);
    }

    //Processes a message given by the user
    const processUserMessage = async (userMessage: string) => {

        //Show loading indicator
        setIsAwaitingMessageFromOpenAI(true);

        // Make other prompts disappear
        setDoesUserHaveChatHistory(true);

        // Add the message into the UI
        addMessagesToInterface('user', userMessage);


        //Store the prompt in MESSAGES and in message_history of the current article chat
        const newMessageHistory = await storeArticleChatMessage(userId + currArticle.article_id, userMessage, 'user');
        const previousMessages = newMessageHistory.map((pastMessage, index) => (
            { role: pastMessage.role, content: pastMessage.content }
        ));


        //Send message to OpenAI to get response
        const response = await generatePrompts('gpt-3.5-turbo', userMessage, finterestGenerateArticlePrompt.finterestGenerateArticlePrompt + currArticle.content, previousMessages, "article");
        console.log("Reponse" + reponse);

        //Show new response on the UI
        if (response != null) {
                //Add the response to the MESSAGES database
                await storeArticleChatMessage(userId + currArticle.article_id, response, 'assistant'); 

                //Show new response on the UI
                addMessagesToInterface('assistant', response != null ? response : '');
        }

        setNewMessageSubmitted(true);

        //Hide loading indicator
        setIsAwaitingMessageFromOpenAI(false);
    }

    //Function that handles changes in text area field
    const handleChangesInTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextInTextArea(e.target.value);
    };

    //Function that handles submission of user prompt from text area
    const handleEnterSubmission = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        //Submit user text when they press enter when typing in the text area
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            //Check if user submitted at least some content, otherwise reject
            if (textInTextArea.trim() === '') {
                return;
            }

            //Submit text in text area
            processUserMessage(textInTextArea);

            //Clear text area
            setTextInTextArea('');
        }
    }

    //Function that handles submission when user presses the submit icon button
    const handleSubmitIconClick = async () => {
        //Check if user submitted at least some content, otherwise reject
        if (textInTextArea.trim() === '') {
            return;
        }

        //Submit text in text area
        processUserMessage(textInTextArea);

        //Clear text area
        setTextInTextArea('');
    }

    //Function that passes in text as prompt from article highlighting
    const handleArticleHighlighting = async (articleText: string) => {
        processUserMessage('Can you explain "' + articleText + '" in the context of this article?');
    }

    return (
        <div className='flex-grow'>
            <div>
                <div className="flex flex-col justify-between h-screen overflow-y-hidden">
                    <div id="chatboxMessageList" className="ml-4 mr-4 mt-4 overflow-y-auto pr-0">
                        <p className='font-dmsans text-neutral-headings-black font-bold text-center'>Hey there! Finterest AI can help you understand this article better.</p>
                        {/* Provide prompts */}
                        {
                            (doesUserHaveChatHistory)
                                ? null
                                :
                                <div className='flex flex-col justify-center items-center mt-5 space-y-4'>
                                    <h6 className='text-neutral-text-gray uppercase tracking-widest'>Try these prompts</h6>
                                    {
                                        chatPrompts.map((prompt, idx) => (
                                            <button key={`${prompt}-${idx}`} id={`prompt-${idx}`}
                                                className={'rounded-lg bg-white hover:bg-stone-100 w-3/4 h-1/6 p-5 font-dmsans text-stone-600 hover:text-stone-800 duration-200'}
                                                onClick={() => processPrompt(prompt)}>
                                                <p>{prompt}</p>
                                            </button>
                                        ))
                                    }
                                </div>
                        }
                        {/* Messages from the user and the system */}
                        <div className='flex flex-col justify-start'>
                            {messageJsxElements}
                        </div>
                        <div className='h-20' ref={ref} />

                    </div>

                    {/* Input area */}
                    <ChatMessageTextArea isAwaitingMessageFromOpenAi={isAwaitingMessageFromOpenAi}
                        textInTextArea={textInTextArea}
                        handleChangesInTextArea={handleChangesInTextArea}
                        handleEnterSubmission={handleEnterSubmission}
                        handleSubmitIconClick={handleSubmitIconClick}
                    />
                </div>
            </div>

            <Script src="/utils/openai.js" />

        </div>
    );
}
