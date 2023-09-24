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
import { createNewArticleChat, checkOtherwiseCreateGeneralChat, fetchGeneralChatHistory } from '@/config/firestore';
import BouncingDots from './BouncingDots';
import { text } from 'stream/consumers';

interface OpenAIMessage {
    role: string;
    content: string;
}

interface ChatStruct {
    article_id: string;
    messages: number[];
}

export default function GeneralConvo() {
  

    //User id
    const { user } = useAuth();
    const userId = user.uid;

    //State to track message history
    const [messages, setMessages] = useState<OpenAIMessage[]>([]);
    const [messageJsxElements, setMessageJsxElements] = useState<JSX.Element[] | undefined>([]);

    //State to track if we are waiting a response from OpenAI
    const [isAwaitingMessageFromOpenAi, setIsAwaitingMessageFromOpenAI] = useState(false);

    //State to track user input in text area
    const [textInTextArea, setTextInTextArea] = useState('');


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


    //Update JSX elements whenever messages changes, in order to update the UI
    useEffect(() => {
        const messageJsxElements = messages.map((openAiMessage, index) => (
            (openAiMessage.role == 'user')
            ? <p key={index} className="text-white font-dmsans mt-4 self-end w-3/4 bg-neutral-headings-black rounded-2xl p-5 mr-4">{ openAiMessage.content }</p>
            : <p key={index} className="text-neutral-headings-black font-dmsans mt-4 self-start w-3/4 bg-white rounded-2xl p-5">{ openAiMessage.content }</p>
        ));
        setMessageJsxElements(messageJsxElements);
    }, [messages])


    //Fetch user messages when user enters the general chat bot page
    useEffect(() => {
        const fetchMessageHistory = async () => {
            //Check if user has a prior general chat instance. If not, we create the instance.
            const generalChatId = checkOtherwiseCreateGeneralChat(userId);
            //Fetch messages associated with the general chat
            const messageHistory = await fetchGeneralChatHistory(generalChatId);
            const previousMessages = messageHistory.map((pastMessage, index) => (
                { role: pastMessage.role, content: pastMessage.content }
            ));
            setMessages(previousMessages);
        };
        fetchMessageHistory();
    }
    , []);

    
    //Helper function to add messages into the UI
    const addMessagesToInterface = (role: string, message: string) => {
        setMessages((prevMessages) => [...prevMessages, {role: role, content: message}]);
    }


    //Processes a message given by the user
    const processUserMessage = async (userMessage: string) => {

        //Show loading indicator
        setIsAwaitingMessageFromOpenAI(true);


        // Add the message into the UI
        addMessagesToInterface('user', userMessage);
       

        // Store the prompt in MESSAGES and in message_history of the current article chat
        // const newMessageHistory = await storeArticleChatMessage(userId + currArticle.article_id, userMessage, 'user');
        // const previousMessages = newMessageHistory.map((pastMessage, index) => (
        //     { role: pastMessage.role, content: pastMessage.content }
        // ));



        

        //Send message to OpenAI to get response
        // const response = await generatePrompts('gpt-3.5-turbo', userMessage, finterestGenerateArticlePrompt.finterestGenerateArticlePrompt + currArticle.content, previousMessages);
        // const response = "Sample response 1";

        
     
        // console.log("Response" + response);

        // //Show new response on the UI
        // if (response != null) {
        //         //Add the response to the MESSAGES database
        //         await storeArticleChatMessage(userId + currArticle.article_id, response, 'system'); 

        //         //Show new response on the UI
        //         addMessagesToInterface('system', response != null ? response : '');
        // }

        // setNewMessageSubmitted(true);
        


        // //Hide loading indicator
        // setIsAwaitingMessageFromOpenAI(false);


    }

    //Function that handles changes in text area field
    const handleChangesInTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // setTextInTextArea(e.target.value);
    };

    //Function that handles submission of user prompt from text area
    const handleEnterSubmission = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        //Submit user text when they press enter when typing in the text area
        // if (e.key === 'Enter' && !e.shiftKey) {
        //     e.preventDefault();

        //     //Check if user submitted at least some content, otherwise reject
        //     if (textInTextArea.trim() === '') {
        //         return;
        //     }

        //     //Submit text in text area
        //     processUserMessage(textInTextArea);

        //     //Clear text area
        //     setTextInTextArea('');
        // }
    }

    //Function that handles submission when user presses the submit icon button
    const handleSubmitIconClick = async () => {
        // //Check if user submitted at least some content, otherwise reject
        // if (textInTextArea.trim() === '') {
        //     return;
        // }

        // //Submit text in text area
        // processUserMessage(textInTextArea);

        // //Clear text area
        // setTextInTextArea('');
    }

    return (
        <div>
            <div>
                <div className="flex flex-col justify-between h-screen overflow-y-hidden"> 
                    <div id="chatboxMessageList" className="ml-4 mr-4 mt-16 overflow-y-auto pr-0 h-70">
                            <p className='font-dmsans text-neutral-headings-black font-bold text-center'>Hey there! Finterest AI helps you learn financial concepts through the news.</p>
                           
                            {/* Messages from the user and the system */}
                            <div className='flex flex-col justify-start'>
                                { messageJsxElements }
                            </div>
                            <div className='h-20' ref={ref} />

                    </div>

        

                    {/* Input area */}
                    <div className='flex flex-col h-1/3 lg:h-1/4 xl:h-1/5 items-center w-full'>
                        {/* { isAwaitingMessageFromOpenAi ? <BouncingDots /> : <div style={{ height: '22px' }}></div> } */}
                        <div className='bg-neutral-text-gray flex items-center flex-1 w-full mt-5 leading-8'>
                            {/* Input field  */}
                            <textarea id="chatboxTextInput"
                                className={'bg-neutral-color-300 w-11/12 h-auto m-5 font-dmsans text-neutral-text-gray pl-5 pt-3 pr-5 pb-3 focus:outline-neutral-headings-black outline-none align-middle leading-6' }
                                style={{ verticalAlign: 'middle', overflowY: 'auto', resize: 'none' }}
                                placeholder="Ask your question here"
                                // value={textInTextArea}
                                onChange={handleChangesInTextArea}
                                onKeyDown={handleEnterSubmission}
                                // disabled={isAwaitingMessageFromOpenAi}
                            ></textarea>
                            {/* Send button */}
                            <button className={'w-1/12 ml-2'} onClick={ handleSubmitIconClick }>
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
