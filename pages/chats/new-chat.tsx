import Head from 'next/head';
import NextLink from 'next/link';
import Script from 'next/script';
import { generatePrompts } from '../../utils/openai';
import finterestGenerateArticlePrompt from '../../utils/prompt.json';
import ProtectedRoute from '@/components/ProtectedRoute';
import chatboxStyles from '@/styles/chatbox.module.css';
import { useEffect } from 'react';
import Footer from '@/components/common/Footer';


export default function FirstChat() {
    return (
        <ProtectedRoute>
            <Head>
                <title>New Chat</title>
            </Head>
            <h2>New Chat with the awesome Finterest Chatbot!</h2>

            <div className={chatboxStyles.chatbox}>
                <div id="chatboxMessageList" className={chatboxStyles.chatboxMessages}>
                    <div className={chatboxStyles.chatboxMessage}>
                        <p>WELCOME TO THE AWESOME FINANCE APP! Send me a new article to summarise:</p>
                    </div>
                </div>
                <div className={chatboxStyles.chatboxInput}>
                    <textarea id="chatboxTextInput" className={chatboxStyles.chatboxInputTextArea} placeholder="Type your message here..."></textarea>
                    <button className={chatboxStyles.chatboxInputButton} onClick={
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


                            // Generate a response from the OpenAI API
                            const response = await generatePrompts('gpt-3.5-turbo', message, finterestGenerateArticlePrompt.finterestGenerateArticlePrompt);

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
                            messageEle.value = '';
                        }
                    }>Send</button>
                </div>
            </div>

            <Footer children={false} showBackButton={true} />

            <Script src="/utils/openai.js" />

        </ProtectedRoute >
    );
}