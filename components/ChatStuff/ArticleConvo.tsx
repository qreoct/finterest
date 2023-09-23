import Head from 'next/head';
import NextLink from 'next/link';
import Script from 'next/script';
import { generatePrompts } from '../../utils/openai';
import finterestGenerateArticlePrompt from '../../utils/prompt.json';
import ProtectedRoute from '@/components/ProtectedRoute';
import chatboxStyles from '@/styles/chatbox.module.css';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import { getArticle, getChat } from '@/config/firestore';
import { useEffect, useState } from 'react';
import { ArticleType, convertToArticleType } from '@/types/ArticleTypes';
import { addChat, addMessage } from '@/config/firestore';
import { useAuth } from '@/context/AuthContext';
import { BiSend } from "react-icons/bi";

interface OpenAIMessage {
    role: string;
    content: string;
}

interface ChatStruct {
    article_id: string;
    messages: number[];
}

export default function ArticleConvo() {

    // const { id } = useRouter().query;

    // const { user } = useAuth();

    // const userId = user.uid;

    // const router = useRouter();

    // const [currArticle, setArticles] = useState<ArticleType | null>({} as ArticleType);

    // useEffect(() => {
    //     const fetchArticle = async () => {
    //         const articlePromises = await getArticle(id);
    //         const resolvedArticle = await articlePromises;

    //         let convertedArticle = convertToArticleType(resolvedArticle);

    //         if (convertedArticle == null) {
    //             console.log("Article not found");
    //             return;
    //         }

    //         // TESTING - When this is enabled, each time u load an article page GPT will run once
    //         // NVM THIS DOES NOT WORK IN THE WAY THAT I INTENDED
    //         // convertedArticle = await fixNewsArticleContentWithAI(convertedArticle);

    //         setArticles(convertedArticle);
    //     };

    //     fetchArticle();
    // }, [id]);

    // if (!currArticle) {
    //     return <div>Loading article...</div>;
    // }

    // if (currArticle.article_id === undefined) {
    //     return <div>Article not found</div>;
    // }

    // console.log(currArticle.article_id);
    // console.log(currArticle.title);

    // let previousMessages: OpenAIMessage[] = new Array<OpenAIMessage>();

    // const newChatId = userId + currArticle.article_id;


    // // if chat already exists in db then route to that chat
    // if (getChat(newChatId) != null) {
    //     router.push('/chats/' + newChatId);
    // }


    // const newChat: ChatStruct = {
    //     article_id: currArticle.article_id,
    //     messages: []
    // };

    // addChat(newChat, currArticle.article_id, newChatId, userId);

    // let articleContent = currArticle?.content == null ? '' : currArticle?.content;

    return (
        <div>
            <div>
                <div className="flex flex-col justify-between h-screen">  
                    <div id="chatboxMessageList" className="ml-4 mr-4 mt-16 overflow-y-scroll">
                            <p className='font-dmsans text-neutral-headings-black font-bold'>Hey there! Finterest AI can help you understand this article better.</p>
                    </div>
                    
                    {/* Input area */}
                    <div className='bg-neutral-text-gray flex h-1/6 items-center'>
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

            <Script src="/utils/openai.js" />

        </div>
    );
}
