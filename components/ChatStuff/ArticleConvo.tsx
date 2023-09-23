import Head from 'next/head';
import NextLink from 'next/link';
import Script from 'next/script';
import { generatePrompts } from '../../utils/openai';
import finterestGenerateArticlePrompt from '../../utils/prompt.json';
import ProtectedRoute from '@/components/ProtectedRoute';
import chatboxStyles from '@/styles/chatbox.module.css';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import { doesArticleChatExist, getArticle, getChat } from '@/config/firestore';
import { useEffect, useState } from 'react';
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
            createNewArticleChat(userId, currArticle.article_id, newChatId);
        } else {
            //Chat exists already. Check if there is any message
            if (chatInformation.message_history.length == 0) {
                //No message history. No action required.
            } else {
                setDoesUserHaveChatHistory(true); 
                //TODO: Fetch original messages
            }
        }


    };

    //Process chat after article loads
    useEffect(() => {

        // Check if there is an existing chat
        checkUserChatHistory();
     
    }, [currArticle]);



    //Process prompt selected by the user and feed into OpenAI
    const processPrompt = (promptIndex: number) => {
        const promptContent = (promptIndex == 1)
                              ? currArticle.prompt_one
                              : currArticle.prompt_two;

        // Make other prompts disappear
        setDoesUserHaveChatHistory(true);
        
        // Add the prompt into the UI
        const currentMessages = [...messages];
        currentMessages.push({role: 'user', content: promptContent});
        setMessages(currentMessages);
        const messageJsxElements = currentMessages.map((openAiMessage, index) => (
            (openAiMessage.role == 'user')
            ? <p key={index} className="text-white font-dmsans mt-4 self-end w-3/4 bg-neutral-headings-black rounded-2xl p-5">{ openAiMessage.content }</p>
            : <p key={index} className="text-neutral-headings-black font-dmsans mt-4 self-start w-3/4 bg-white rounded-2xl p-5">{ openAiMessage.content }</p>
        ));
        setMessageJsxElements(messageJsxElements);


        //TODO: Store the prompt in MESSAGES and in message_history of the current article chat




        //Send message to OpenAI to get response
        setIsAwaitingMessageFromOpenAI(true);





        // const mySentMessage = document.createElement('div');
        // mySentMessage.className = chatboxStyles.chatboxMessage + ' ' + chatboxStyles.chatboxMessageFromUser;
        // mySentMessage.innerHTML = `<p>${message}</p>`;
        // document.getElementById('chatboxMessageList')?.appendChild(mySentMessage);

        // messageEle.value = '';

        // // Generate a response from the OpenAI API
        // const response = await generatePrompts('gpt-3.5-turbo', message, finterestGenerateArticlePrompt.finterestGenerateArticlePrompt + articleContent, previousMessages);

        // // Create a new message element
        // const newMessage = document.createElement('div');
        // newMessage.className = chatboxStyles.chatboxMessage + ' ' + chatboxStyles.chatboxMessageFromSystem;
        // newMessage.innerHTML = `<p>${response}</p>`;

        // // Adds the new message to the chat box
        // // Another way to use querySelector safely without explicitly checking if the element exists
        // // is to use the optional chaining operator (?) 
        // // Then we can do whatever after the ? safely such as running one of the methods
        // // If the object does not exist then the method will just not run
        // document.getElementById('chatboxMessageList')?.appendChild(newMessage);

        // // We can also use the ! operator to tell typescript to ignore the null error and pretend the thing always exists
        // // But this can be unsafe and cause errors if the object does not exist so we should 
        // // usually use the first 2 options (explicitly checking if the thing exists or using ?) instead

        // const promptUnNulled = message == null ? '' : String(message);
        // const responseUnNulled = response == null ? '' : String(response);

        // const newMessageButOpenAI: OpenAIMessage = {
        //     role: "user",
        //     content: promptUnNulled
        // };

        // const newResponseButOpenAI: OpenAIMessage = {
        //     role: "system",
        //     content: responseUnNulled
        // };


        // previousMessages.push(newMessageButOpenAI);
        // previousMessages.push(newResponseButOpenAI);
        // addMessage(newMessageButOpenAI, newChatId);
        // addMessage(newResponseButOpenAI, newChatId);

        // console.log(previousMessages);
    };


    //Updates the UI whenever the chat history changes
    
   

























   
    return (
        <div>
            <div>
                <div className="flex flex-col justify-between h-screen overflow-y-hidden">  
                    <div id="chatboxMessageList" className="ml-4 mr-4 mt-16 overflow-y-auto pr-0">
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

                    </div>

        

                    
                    
                    {/* Input area */}
                    <div className='flex flex-col h-1/3 lg:h-1/4 xl:h-1/5 items-center w-full'>
                        { isAwaitingMessageFromOpenAi ? <BouncingDots /> : <div style={{ height: '22px' }}></div> }
                        <div className='bg-neutral-text-gray flex items-center flex-1 w-full mt-5'>
                            {/* Input field  */}
                            <textarea id="chatboxTextInput"
                                className={'bg-neutral-color-300 w-4/5 h-auto m-5 font-dmsans text-neutral-text-gray pl-5 pt-3 pr-5 pb-3 focus:outline-neutral-headings-black outline-none align-middle' }
                                style={{ lineHeight: 'normal', verticalAlign: 'middle', overflowY: 'auto', resize: 'none' }}
                                placeholder="Type your message here..."></textarea>
                            {/* Send button */}
                            <button className={'w-1/5 ml-2'}>
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
