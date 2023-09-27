import Script from 'next/script';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { checkOtherwiseCreateGeneralChat, fetchGeneralChatHistory, storeGeneralChatMessage } from '@/config/firestore';
import BouncingDots from './BouncingDots';
import finterestGenerateArticlePrompt from '../../utils/prompt.json';
import { BiSend } from "react-icons/bi";
import { generatePrompts } from '../../utils/openai';
import { convertArticleJSONToArticleType } from '../../lib/NewsController';
import { getArticle } from '../../config/firestore'


interface OpenAIMessage {
    role: string;
    content: string;
}

const testarticle = getArticle("aac637db7f5f4387cce3a32e3d6c4075")


//The UI component for a chatbot with general AI
export default function GeneralConvo() {
    /* Preparation Variables */
  
    //User id
    const { user } = useAuth();
    const userId = user.uid;


    /* States */

    //State to track message history
    const [messages, setMessages] = useState<OpenAIMessage[]>([]);
    const [messageJsxElements, setMessageJsxElements] = useState<JSX.Element[] | undefined>([]);

    //State to track if we are waiting a response from OpenAI
    const [isAwaitingMessageFromOpenAi, setIsAwaitingMessageFromOpenAI] = useState(false);

    //State to track user input in text area
    const [textInTextArea, setTextInTextArea] = useState('');


    //State to track general chat id
    const [generalChatId, setGeneralChatId] = useState('');


    /* Effects */

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
            ? <p key={index} className="text-white font-dmsans mt-4 self-end w-2/5 bg-neutral-headings-black rounded-2xl p-5 mr-4">{ openAiMessage.content }</p>
            : <p key={index} className="text-neutral-headings-black font-dmsans mt-4 self-start w-2/5 bg-neutral-color-300 rounded-2xl p-5">{ openAiMessage.content }</p>
        ));
        setMessageJsxElements(messageJsxElements);
    }, [messages]);

    //Fetch messages once we obtain the general chat id
    useEffect(() => {
        const fetchMessageHistory = async () => {
            //Fetch messages associated with the general chat
            if (generalChatId != '') {
                const messageHistory = await fetchGeneralChatHistory(generalChatId);
                const previousMessages = messageHistory.map((pastMessage, index) => (
                    { role: pastMessage.role, content: pastMessage.content }
                ));
                setMessages(previousMessages);
            } else {
                fetchGeneralChat();
            }
        }
        fetchMessageHistory();
    }, [generalChatId]);


    /* Helper Functions */

    //Check if user has a general chat instance
    const fetchGeneralChat = async () => {
        //Check if user has a prior general chat instance. If not, we create the instance.
        const generalChatIdNew = await checkOtherwiseCreateGeneralChat(userId)
        if (generalChatIdNew != null) {
            setGeneralChatId(generalChatIdNew);
            const test = await convertArticleJSONToArticleType(testarticle);
        }
    };

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
       

        // Store the prompt in general messages
        const newMessageHistory = await storeGeneralChatMessage(generalChatId, userMessage, 'user');
        const previousMessages = newMessageHistory.map((pastMessage, index) => (
            { role: pastMessage.role, content: pastMessage.content }
        ));


        //Send message to OpenAI to get response
        const response = await generatePrompts('gpt-3.5-turbo', userMessage, finterestGenerateArticlePrompt.finterestGenerateArticlePrompt, previousMessages);
        //const response = "Sample response 1";

        

        //Show new response on the UI
        if (response != null) {
                //Add the response to the MESSAGES database
                await storeGeneralChatMessage(generalChatId, response, 'system'); 

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
                            <p className='font-dmsans text-neutral-headings-black font-bold text-center'>Hey there! Finterest AI helps you learn financial concepts through the news.</p>
                           
                            {/* Messages from the user and the system */}
                            <div className='flex flex-col justify-start'>
                                { messageJsxElements }
                            </div>
                            <div className='h-20' ref={ref} />
                    </div>

                    {/* Input area */}
                    <div className='flex flex-col h-1/3 lg:h-1/4 xl:h-1/5 items-center w-full'>
                        { isAwaitingMessageFromOpenAi ? <BouncingDots /> : <div style={{ height: '22px' }}></div> }
                        <div className='bg-neutral-text-gray flex items-center flex-1 w-full mt-5 leading-8'>
                            {/* Input field  */}
                            <textarea id="chatboxTextInput"
                                className={'bg-neutral-color-300 w-11/12 h-auto m-5 font-dmsans text-neutral-text-gray pl-5 pt-3 pr-5 pb-3 focus:outline-neutral-headings-black outline-none align-middle leading-6' }
                                style={{ verticalAlign: 'middle', overflowY: 'auto', resize: 'none' }}
                                placeholder="Ask your question here"
                                value={textInTextArea}
                                onChange={handleChangesInTextArea}
                                onKeyDown={handleEnterSubmission}
                                disabled={isAwaitingMessageFromOpenAi}
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
