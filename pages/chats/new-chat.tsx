import Head from 'next/head';
import NextLink from 'next/link';
import Script from 'next/script';
import { generatePrompts } from '../../utils/openai';
import finterestGenerateArticlePrompt from '../../utils/prompt.json';
import ProtectedRoute from '@/components/ProtectedRoute';
import chatboxStyles from '@/styles/chatbox.module.css';
import Footer from '@/components/common/Footer';
import { useRouter } from 'next/router';
import { getArticle } from '@/config/firestore';
import { useEffect, useState } from 'react';
import { ArticleType, convertToArticleType } from '@/types/ArticleTypes';
import { addChat, addMessage } from '@/config/firestore';
import { useAuth } from '@/context/AuthContext';

interface OpenAIMessage {
    role: string;
    content: string;
}

interface ChatStruct {
    article_id: string;
    messages: number[];
}

export default function NewChat() {

    const { id } = useRouter().query;

    const { user } = useAuth();

    const userId = user.uid;

    const [currArticle, setArticles] = useState<ArticleType | null>({} as ArticleType);

    useEffect(() => {
        const fetchArticle = async () => {
            const articlePromises = await getArticle(id);
            const resolvedArticle = await articlePromises;

            let convertedArticle = convertToArticleType(resolvedArticle);

            if (convertedArticle == null) {
                console.log("Article not found");
                return;
            }

            // TESTING - When this is enabled, each time u load an article page GPT will run once
            // NVM THIS DOES NOT WORK IN THE WAY THAT I INTENDED
            // convertedArticle = await fixNewsArticleContentWithAI(convertedArticle);

            setArticles(convertedArticle);
        };

        fetchArticle();
    }, [id]);

    if (!currArticle) {
        return <div>Loading article...</div>;
    }

    if (currArticle.article_id === undefined) {
        return <div>Article not found</div>;
    }

    console.log(currArticle.article_id);
    console.log(currArticle.title);

    let previousMessages: OpenAIMessage[] = new Array<OpenAIMessage>();

    const newChatId = userId + currArticle.article_id;

    const newChat: ChatStruct = {
        article_id: currArticle.article_id,
        messages: []
    };

    addChat(newChat, currArticle.article_id, newChatId, userId);

    let articleContent = currArticle?.content == null ? '' : currArticle?.content;

    return (
        <ProtectedRoute>
            <Head>
                <title>Chat about Article: {currArticle?.title}</title>
            </Head>
            <div className="container mx-auto flex min-h-screen items-center py-2">
                <div className="mx-auto mt-7 border border-black p-10 rounded-xl text-gray-600">

                    <h2 className="text-2xl font-semibold mb-4">
                        New Chat with the awesome Finterest Chatbot!
                    </h2>
                    <h2 className="text-2xl font-semibold mb-4">
                        Current Article: {currArticle?.title}
                    </h2>

                    <div className="mb-4">
                        <p className="text-base">
                            WELCOME TO THE AWESOME FINANCE APP! Lets chat about this article that you had just read! You may start by asking me any questions about the article.
                        </p>
                    </div>

                    <div className={chatboxStyles.chatbox}>
                        <div id="chatboxMessageList" className={chatboxStyles.chatboxMessages}>
                            <div className={chatboxStyles.chatboxMessage}>
                                <p>WELCOME TO THE AWESOME FINANCE APP! Send me a new article to summarise:</p>
                            </div>
                        </div>
                        <div className={chatboxStyles.chatboxInput + ' border-t border-black pt-4'}>
                            <textarea id="chatboxTextInput" className={chatboxStyles.chatboxInputTextArea + ' w-full p-2 border border-black rounded'} placeholder="Type your message here..."></textarea>
                            <button className={'w-1/6 ml-2 bg-green-400 border border-black rounded'} onClick={
                                async () => {
                                    console.log('Send button clicked!');

                                    // Get the message from the text area
                                    // This uses typescript method of query selecting where we specify the type of the element 
                                    // that we are selecting using <> and then we check if the element exists
                                    // If it does, we can then use it as a normal element otherwise typescript will complain that it could be null
                                    const messageEle = document.getElementById('chatboxTextInput') as HTMLTextAreaElement;
                                    if (!messageEle) {
                                        console.log('Message element does not exist!');
                                        return;
                                    }

                                    const message = messageEle.value;

                                    // Add the typed message into the chat box
                                    const mySentMessage = document.createElement('div');
                                    mySentMessage.className = chatboxStyles.chatboxMessage + ' ' + chatboxStyles.chatboxMessageFromUser;
                                    mySentMessage.innerHTML = `<p>${message}</p>`;
                                    document.getElementById('chatboxMessageList')?.appendChild(mySentMessage);

                                    messageEle.value = '';

                                    // Generate a response from the OpenAI API
                                    const response = await generatePrompts('gpt-3.5-turbo', message, finterestGenerateArticlePrompt.finterestGenerateArticlePrompt + articleContent, previousMessages);

                                    // Create a new message element
                                    const newMessage = document.createElement('div');
                                    newMessage.className = chatboxStyles.chatboxMessage + ' ' + chatboxStyles.chatboxMessageFromSystem;
                                    newMessage.innerHTML = `<p>${response}</p>`;

                                    // Adds the new message to the chat box
                                    // Another way to use querySelector safely without explicitly checking if the element exists
                                    // is to use the optional chaining operator (?) 
                                    // Then we can do whatever after the ? safely such as running one of the methods
                                    // If the object does not exist then the method will just not run
                                    document.getElementById('chatboxMessageList')?.appendChild(newMessage);

                                    // We can also use the ! operator to tell typescript to ignore the null error and pretend the thing always exists
                                    // But this can be unsafe and cause errors if the object does not exist so we should 
                                    // usually use the first 2 options (explicitly checking if the thing exists or using ?) instead

                                    const promptUnNulled = message == null ? '' : String(message);
                                    const responseUnNulled = response == null ? '' : String(response);

                                    const newMessageButOpenAI: OpenAIMessage = {
                                        role: "user",
                                        content: promptUnNulled
                                    };

                                    const newResponseButOpenAI: OpenAIMessage = {
                                        role: "system",
                                        content: responseUnNulled
                                    };


                                    previousMessages.push(newMessageButOpenAI);
                                    previousMessages.push(newResponseButOpenAI);
                                    addMessage(newMessageButOpenAI, newChatId);
                                    addMessage(newResponseButOpenAI, newChatId);

                                    console.log(previousMessages);

                                }}>Send</button>
                        </div>
                    </div>

                    <Footer children={false} showBackButton={true} />
                </div>
            </div>

            <Script src="/utils/openai.js" />

        </ProtectedRoute >
    );
}
