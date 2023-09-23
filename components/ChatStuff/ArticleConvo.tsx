import Head from 'next/head';
import NextLink from 'next/link';
import Script from 'next/script';
import { generatePrompts } from '../../utils/openai';
import finterestGenerateArticlePrompt from '../../utils/prompt.json';
import ProtectedRoute from '@/components/ProtectedRoute';
import chatboxStyles from '@/styles/chatbox.module.css';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import { doesArticleChatExist, getArticle, getChat, storeArticleChatMessage, fetchArticleChatHistory } from '@/config/firestore';
import { useEffect, useState, useRef } from 'react';
import { ArticleType, convertToArticleType } from '@/types/ArticleTypes';
import { addChat, addMessage } from '@/config/firestore';
import { useAuth } from '@/context/AuthContext';
import { BiSend } from "react-icons/bi";
import { createNewArticleChat } from '@/config/firestore';
import BouncingDots from './BouncingDots';

interface OpenAIMessage {
    role: string;
    content: string;
}

interface ChatStruct {
    article_id: string;
    messages: number[];
}

export default function ArticleConvo() {

    //Article id
    const { id } = useRouter().query;

    //User id
    const { user } = useAuth();
    const userId = user.uid;

    //Does user have a prior chat
    const [doesUserHaveChatHistory, setDoesUserHaveChatHistory] = useState(false);

    const router = useRouter();

    const [currArticle, setCurrArticle] = useState<ArticleType | null>({} as ArticleType);

    //State to track message history
    const [messages, setMessages] = useState<OpenAIMessage[]>([]);
    const [messageJsxElements, setMessageJsxElements] = useState<JSX.Element[] | undefined>([]);

    //State to track if we are waiting a response from OpenAI
    const [isAwaitingMessageFromOpenAi, setIsAwaitingMessageFromOpenAI] = useState(false);

    //State to track user input in text area
    const [textInTextArea, setTextInTextArea] = useState('');


    //Enable auto-scrolling to the bottom of the chat
    //Taken from https://reacthustle.com/blog/react-auto-scroll-to-bottom-tutorial
    const ref = useRef<HTMLDivElement>(null);
    // useEffect(() => {
    //     if (messageJsxElements?.length) {
    //         ref.current?.scrollIntoView({
    //             behavior: "smooth",
    //             block: "end",
    //         })
    //     }
    // });
     
    
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


    useEffect(() => {
        const fetchArticle = async () => {
            const resolvedArticle = await getArticle(id);
            let convertedArticle = convertToArticleType(resolvedArticle);
            if (convertedArticle == null) {
                console.log("Article not found");
                return;
            }

            setCurrArticle(convertedArticle);
        };

        fetchArticle();
    }, []);


    //Update JSX elements whenever messages changes, in order to update the UI
    useEffect(() => {
        const messageJsxElements = messages.map((openAiMessage, index) => (
            (openAiMessage.role == 'user')
            ? <p key={index} className="text-white font-dmsans mt-4 self-end w-3/4 bg-neutral-headings-black rounded-2xl p-5">{ openAiMessage.content }</p>
            : <p key={index} className="text-neutral-headings-black font-dmsans mt-4 self-start w-3/4 bg-white rounded-2xl p-5">{ openAiMessage.content }</p>
        ));
        setMessageJsxElements(messageJsxElements);
    }, [messages])




    //Loading indicator
    if (! currArticle) {
        return <div className="flex justify-center items-center font-dmsans text-neutral-headings-black font-bold text-4xl h-screen w-screen bg-neutral-color-300">
            <h3>Loading chat...</h3>
        </div>;
    }



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
            if (chatInformation.message_history.length == 0) {
                //No message history. No action required.
            } else {
                setDoesUserHaveChatHistory(true); 

                //Fetch original messages
                const messageHistory = await fetchArticleChatHistory(newChatId);
                console.log(messageHistory);
                const previousMessages = messageHistory.map((pastMessage, index) => (
                    { role: pastMessage.role, content: pastMessage.content }
                ));
                setMessages(previousMessages);
            }
        }


    };

    //Process chat after article loads
    useEffect(() => {

        // Check if there is an existing chat
        checkUserChatHistory();
     
    }, [currArticle]);



    //Helper function to add messages into the UI
    const addMessagesToInterface = (role: string, message: string) => {
        setMessages((prevMessages) => [...prevMessages, {role: role, content: message}]);
    }



    //Process prompt selected by the user and feed into OpenAI
    const processPrompt = async (promptIndex: number) =>  {
        //Show loading indicator
        setIsAwaitingMessageFromOpenAI(true);

        //Get respective prompt
        const promptContent = (promptIndex == 1)
                              ? currArticle.prompt_one
                              : currArticle.prompt_two;
        
        //Process prompt accordingly
        await processUserMessage(promptContent);

        
    }


    //Processes a message given by the user
    const processUserMessage = async (userMessage: string) => {

        //Show loading indicator
        setIsAwaitingMessageFromOpenAI(true);

        // Make other prompts disappear
        setDoesUserHaveChatHistory(true);
        
        // Add the prompt into the UI
        addMessagesToInterface('user', userMessage);
       

        //Store the prompt in MESSAGES and in message_history of the current article chat
        const newMessageHistory = await storeArticleChatMessage(userId + currArticle.article_id, userMessage, 'user');
        const previousMessages = newMessageHistory.map((pastMessage, index) => (
            { role: pastMessage.role, content: pastMessage.content }
        ));


        //Send message to OpenAI to get response
        // const response = await generatePrompts('gpt-3.5-turbo', promptContent, finterestGenerateArticlePrompt.finterestGenerateArticlePrompt + currArticle.content, previousMessages);
        const response = "Sample response 1";

        
     
        console.log("Response" + response);

        //Show new response on the UI
        if (response != null) {
                //Add the response to the MESSAGES database
                await storeArticleChatMessage(userId + currArticle.article_id, response, 'system'); 

                //Show new response on the UI
                addMessagesToInterface('system', response != null ? response : '');
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

    

    return (
        <div>
            <div>
                <div className="flex flex-col justify-between h-screen overflow-y-hidden">  
                    <div id="chatboxMessageList" className="ml-4 mr-4 mt-16 overflow-y-auto pr-0 h-70">
                            <p className='font-dmsans text-neutral-headings-black font-bold text-center'>Hey there! Finterest AI can help you understand this article better.</p>
                            {/* Provide prompts */}
                            {
                                (doesUserHaveChatHistory)
                                ? null
                                :
                                    <div className='flex flex-col justify-center items-center mt-5 space-y-4'>
                                        <h6 className='text-neutral-text-gray uppercase'>Try these prompts</h6>
                                        <button id='prompt-one'
                                        className={'rounded-lg bg-white hover:bg-neutral-text-gray w-3/4 h-1/6 p-5 font-dmsans text-neutral-text-gray hover:text-white duration-200'}
                                        onClick= {() => processPrompt(1)}>
                                            <p>{currArticle.prompt_one}</p>
                                        </button>
                                        <button id='prompt-two'
                                        className={'rounded-lg bg-white hover:bg-neutral-text-gray w-3/4 h-1/6 p-5 font-dmsans text-neutral-text-gray hover:text-white duration-200'}
                                        onClick= {() => processPrompt(2)}>
                                            <p>{currArticle.prompt_two}</p>
                                        </button>

                                    </div>
                            }
                            {/* Messages from the user and the system */}
                            <div className='flex flex-col justify-start'>
                                { messageJsxElements }
                            </div>
                            <div className='h-20' ref={ref} />

                    </div>

        

                    
                    
                    {/* Input area */}
                    <div className='flex flex-col h-1/3 lg:h-1/4 xl:h-1/5 items-center w-full'>
                        { isAwaitingMessageFromOpenAi ? <BouncingDots /> : <div style={{ height: '22px' }}></div> }
                        <div className='bg-neutral-text-gray flex items-center flex-1 w-full mt-5'>
                            {/* Input field  */}
                            <textarea id="chatboxTextInput"
                                className={'bg-neutral-color-300 w-4/5 h-auto m-5 font-dmsans text-neutral-text-gray pl-5 pt-3 pr-5 pb-3 focus:outline-neutral-headings-black outline-none align-middle' }
                                style={{ lineHeight: 'normal', verticalAlign: 'middle', overflowY: 'auto', resize: 'none' }}
                                placeholder="Type your message here..."
                                value={textInTextArea}
                                onChange={handleChangesInTextArea}
                                onKeyDown={handleEnterSubmission}
                                disabled={isAwaitingMessageFromOpenAi}
                            ></textarea>
                            {/* Send button */}
                            <button className={'w-1/5 ml-2'} onClick={ handleSubmitIconClick }>
                                <BiSend className='text-3xl cursor-pointer text-white m-2 hover:text-neutral-headings-black' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Script src="/utils/openai.js" />

        </div>
    );
}
