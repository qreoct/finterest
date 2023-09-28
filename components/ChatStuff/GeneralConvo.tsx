import Script from 'next/script';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { checkOtherwiseCreateGeneralChat, fetchGeneralChatHistory, storeGeneralChatMessage } from '@/config/firestore';
import finterestGenerateArticlePrompt from '../../utils/prompt.json';
import { generatePrompts } from '../../utils/openai';
import ChatMessageTextArea from './ChatMessageTextArea';
import { BiMessageAltDetail, BiNews } from 'react-icons/bi';
import Link from 'next/link';
import chatboxStyles from '@/styles/chatbox.module.css';

interface OpenAIMessage {
    role: string;
    content: string;
}

type GeneralConvoProps = {
    tabIndex: number;
};



//The UI component for a chatbot with general AI
export default function GeneralConvo(tabIndex : GeneralConvoProps) {
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

    //State to track tab
    //Tab 0 is general chat, tab 1 is article chat
    const [currentSelectedTab, setCurrentSelectedTab] = useState(tabIndex.tabIndex);


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
                ? <p key={index} className="text-white font-dmsans mt-4 self-end w-3/4 md:w-1/2 bg-gold-900 rounded-2xl p-5 mr-4">{openAiMessage.content}</p>
                : <p key={index} className="text-neutral-headings-black font-dmsans mt-4 self-start w-1/2 bg-stone-100 rounded-2xl p-5 ml-4">{openAiMessage.content}</p>
            
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
        }
    };

    //Helper function to add messages into the UI
    const addMessagesToInterface = (role: string, message: string) => {
        setMessages((prevMessages) => [...prevMessages, { role: role, content: message }]);
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
        // const response = await generatePrompts('gpt-3.5-turbo', userMessage, finterestGenerateArticlePrompt.finterestGenerateArticlePrompt, previousMessages);
        const response = "Sample response 1";



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

    //Function that toggles tab
    const handleToggleTab = async (selectedTab: number) => {
        if (selectedTab == 0) {
            //Need to change to article chats tab
            switchToGeneralChats();
        } else {
            //Need to change to general chats tab
            switchToArticleChats();
        }
    }
    

    //Helper function
    const switchToArticleChats = async () => {
        const chatBoxMessageListElement = document.getElementById('chatboxMessageList');
        const chatboxInputElement = document.getElementById('chatboxInput');
        const articleChatList = document.getElementById('article-chats-list');
        const generalConvoContainer = document.getElementById('generalConvoContainer');


        //Make chat bot disappear
        chatBoxMessageListElement?.classList.remove(chatboxStyles['animateshow']);
        chatBoxMessageListElement?.classList.remove('flex-col');
        chatBoxMessageListElement?.classList.add('hidden');
        chatboxInputElement?.classList.remove(chatboxStyles['animateshow']);
        //chatboxInputElement?.classList.remove('flex');
        chatboxInputElement?.classList.add('hidden');



        //Make article chat list appear
        articleChatList?.classList.add('flex');
        articleChatList?.classList.remove('hidden');
        articleChatList?.classList.add(chatboxStyles['hiddenelement']);

        //Update flex alignment for container
        generalConvoContainer?.classList.remove('justify-between');
        generalConvoContainer?.classList.add('justify-start');
        
        
        setTimeout(function () {
            articleChatList?.classList.add(chatboxStyles['animateshow']);
            articleChatList?.classList.remove(chatboxStyles['hiddenelement']);
      
        }, 40);

            //Update state and cause page to re-render
            setCurrentSelectedTab(1);
    }

    //Helper function
    const switchToGeneralChats = async () => {
        const chatBoxMessageListElement = document.getElementById('chatboxMessageList');
        const chatboxInputElement = document.getElementById('chatboxInput');
        const articleChatList = document.getElementById('article-chats-list');
        const generalConvoContainer = document.getElementById('generalConvoContainer');
        

        //Make general chats appear
        chatBoxMessageListElement?.classList.add('flex-col');
        chatBoxMessageListElement?.classList.remove('hidden');
        chatBoxMessageListElement?.classList.add(chatboxStyles['hiddenelement']);
        //chatboxInputElement?.classList.add('flex');
        chatboxInputElement?.classList.remove('hidden');
        chatboxInputElement?.classList.add(chatboxStyles['hiddenelement']);


        articleChatList?.classList.remove(chatboxStyles['animateshow']);

        //Update flex alignment for container
        generalConvoContainer?.classList.add('justify-between');
        generalConvoContainer?.classList.remove('justify-start');
       

        setTimeout(function () {
            chatBoxMessageListElement?.classList.add(chatboxStyles['animateshow']);
            chatBoxMessageListElement?.classList.remove(chatboxStyles['hiddenelement']);
            chatboxInputElement?.classList.add(chatboxStyles['animateshow']);
            chatboxInputElement?.classList.remove(chatboxStyles['hiddenelement']);
        }, 40);

        //Make the rest of the content disappear
        articleChatList?.classList.remove('flex');
        articleChatList?.classList.add('hidden');

    
        //Update state and cause page to re-render
        setCurrentSelectedTab(0);

    }



    return (
        <div className='flex-grow'>
            <div>
                <div id='generalConvoContainer' className="flex flex-col justify-between h-screen overflow-y-hidden">
                    {/* Toggle tab between general and article chats */}
                    <div className='flex self-center justify-center rounded-lg space-x-8 mt-5 w-4/5 xl:w-2/5'>
                        { (currentSelectedTab == 0)
                          ? <button className="bg-stone-100 text-finterest-solid font-bold font-dmsans p-2 rounded-xl flex justify-center items-center  self-center duration-200 w-3/4 text-xs md:text-base" onClick={ () => handleToggleTab(0) } >
                                <BiMessageAltDetail className='text-2xl cursor-pointer' />
                                <span className="ml-2">General Chat</span>
                             </button>
                          : <button className="hover:bg-stone-100 text-finterest-solid font-bold font-dmsans p-2 rounded-xl flex justify-center items-center  self-center duration-200 w-3/4 text-xs md:text-base" onClick={ () => handleToggleTab(0) } >
                                <BiMessageAltDetail className='text-2xl cursor-pointer' />
                                <span className="ml-2">General Chat</span>
                            </button>
                        }

                        { (currentSelectedTab == 0)
                          ?  <button className="hover:bg-stone-100 text-finterest-solid font-bold font-dmsans p-2  rounded-xl flex justify-center items-center self-center duration-200 w-3/4 text-xs md:text-base" onClick= { () => handleToggleTab(1) } >
                                <BiNews className='text-2xl cursor-pointer' />
                                <span className="ml-2">Article Chats</span>
                             </button>
                 
                          : <button className="bg-stone-100 text-finterest-solid font-bold font-dmsans p-2  rounded-xl flex justify-center items-center self-center duration-200 w-3/4 text-xs md:text-base" onClick= { () => handleToggleTab(1) } >
                                <BiNews className='text-2xl cursor-pointer' />
                                <span className="ml-2">Article Chats</span>
                            </button>
                        }


                       

                    </div>

                    {/* General Chat */}
                    <div id="chatboxMessageList" className="ml-4 mr-4 mt-4 md:mt-8 overflow-y-auto pr-0 h-70">
                        <p className='font-dmsans text-neutral-headings-black font-bold text-center'>Hey there! Finterest AI helps you learn financial concepts through the news.</p>

                        {/* Messages from the user and the system */}
                        <div className='flex flex-col justify-start'>
                            {/* {messageJsxElements} */}
                            <p className="text-white font-dmsans mt-4 self-end w-3/4 md:w-1/2 bg-gold-900 rounded-2xl p-5 mr-4">User Message says hello and this is just a message</p>
                            <p className="text-neutral-headings-black font-dmsans mt-4 self-start w-3/4 md:w-1/2 bg-stone-100 rounded-2xl p-5 ml-4">Long response from the system ai to reply to the user message</p>
                            <p className="text-white font-dmsans mt-4 self-end w-3/4 md:w-1/2 bg-gold-900 rounded-2xl p-5 mr-4">User Message says hello and this is just a message</p>
                            <p className="text-neutral-headings-black font-dmsans mt-4 self-start w-3/4 md:w-1/2 bg-stone-100 rounded-2xl p-5 ml-4">Long response from the system ai to reply to the user message</p>
                            <p className="text-white font-dmsans mt-4 self-end w-3/4 md:w-1/2 bg-gold-900 rounded-2xl p-5 mr-4">User Message says hello and this is just a message</p>
                            <p className="text-neutral-headings-black font-dmsans mt-4 self-start w-3/4 md:w-1/2 bg-stone-100 rounded-2xl p-5 ml-4">Long response from the system ai to reply to the user message</p>
                        </div>
                        <div className='h-20' ref={ref} />
                    </div>

                    {/* Input area */}
                    <div id='chatboxInput'>
                        <ChatMessageTextArea isAwaitingMessageFromOpenAi={isAwaitingMessageFromOpenAi}
                            textInTextArea={textInTextArea}
                            handleChangesInTextArea={handleChangesInTextArea}
                            handleEnterSubmission={handleEnterSubmission}
                            handleSubmitIconClick={handleSubmitIconClick}
                        />
                    </div>


                    {/* List of history articles */}
                    <div id='article-chats-list' className="mt-8 ml-16 mr-16 hidden">
                        <Link href="articles/[id]" as={`articles/123`} className="text-xl font-extra-bold text-blue-600">
                            <div className="flex">
                                {/* Left Column (75% width) */}
                                <div className="w-full flex-grow xs:flex-grow-0 xs:w-3/4 max-w-prose space-y-2">
                                    <h5 className='font-dmsans text-stone-700 text-sm uppercase tracking-widest'>The New York Times</h5>
                                    <h3 className='font-dmsans font-bold text-stone-900 text-2xl'>An Example of an Article Title</h3>
                                    <p className='font-dmsans text-stone-700 text-base'>An article that describes what is happening in the area lately due to the changes in interest rates.</p>
                                    <h5 className='font-dmsans text-stone-700 text-sm tracking-widest'>2023-09-26</h5>
                                </div>

                                {/* Right Column (25% width) */}
                                <div className="hidden xs:flex w-1/4 pl-4 2xl:ml-72">
                                    <img src='https://www.investopedia.com/thmb/W2u8B017D-GDqZxH-ddc8BLS8qo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/top_6_apps_for_financial_news-5bfc3459c9e77c0026b6a2bf.jpg' alt='Image title' className='rounded-lg' />
                                </div>
                            </div>
                        </Link>
                    </div>


                </div>
            </div>

            <Script src="/utils/openai.js" />

        </div>
    );
}
