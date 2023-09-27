

// import Head from 'next/head';
// import NextLink from 'next/link';
// import Script from 'next/script';
// import { generatePrompts } from '../../utils/openai';
// import finterestGenerateArticlePrompt from '../../utils/prompt.json';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import chatboxStyles from '@/styles/chatbox.module.css';
// import Footer from '@/components/common/Footer';
// import { useRouter } from 'next/router';
// import { getArticle } from '@/config/firestore';
// import { useEffect, useState } from 'react';
// import { ArticleType, convertToArticleType } from '@/types/ArticleTypes';
// import { addChat, addMessage } from '@/config/firestore';
// import { useAuth } from '@/context/AuthContext';
// import { getMessageList } from '@/config/firestore';
// import { getChat, getMessage } from '@/config/firestore';

// interface OpenAIMessage {
//     role: string;
//     content: string;
// }

// interface ChatStruct {
//     article_id: string;
//     messages: number[];
// }

// function convertToChatType(data: any): ChatStruct | null {
//     if (data == null) {
//         return null;
//     }

//     const chat: ChatStruct = {
//         article_id: data.article_id,
//         messages: data.messages
//     };

//     return chat;
// }

// function convertToOpenAIMessageType(data: any): OpenAIMessage | null {
//     if (data == null) {
//         return null;
//     }

//     const message: OpenAIMessage = {
//         role: data.role,
//         content: data.content
//     };

//     return message;
// }

// export const ExistingChatDisplay = ({ chatId }: { chatId: string }) => {

//     // const { id } = useRouter().query;

//     const { user } = useAuth();

//     const userId = user.uid;

//     // Get the current chat from database
//     const [currSavedChat, setSavedChat] = useState<ChatStruct | null>({} as ChatStruct);

//     useEffect(() => {
//         const fetchChat = async () => {
//             const chatPromises = await getChat(chatId);
//             const resolvedChat = await chatPromises;

//             let convertedChat = convertToChatType(resolvedChat);

//             setSavedChat(convertedChat);
//         };

//         fetchChat();
//     }, [chatId]);




//     // Get the relevant article from database
//     const [currArticle, setArticles] = useState<ArticleType | null>({} as ArticleType);

//     useEffect(() => {
//         const fetchArticle = async () => {
//             if (currSavedChat?.article_id) {
//                 const articlePromises = await getArticle(currSavedChat.article_id);
//                 const resolvedArticle = await articlePromises;

//                 let convertedArticle = convertToArticleType(resolvedArticle);

//                 if (convertedArticle == null) {
//                     console.log("Article not found");
//                     return;
//                 }

//                 setArticles(convertedArticle);
//             }
//         };

//         fetchArticle();
//     }, [currSavedChat?.article_id]);

//     const messageIdSavedList = currSavedChat?.messages === undefined ? [] : currSavedChat.messages;



//     let [loadedMessages, setLoadedMessages] = useState<OpenAIMessage[]>([]);

//     useEffect(() => {
//         if (messageIdSavedList.length > 0) {
//             const fetchMessages = async () => {
//                 const messagePromises = messageIdSavedList.map(async (messageId) => {
//                     const messageData = await getMessage(messageId);
//                     return messageData ? convertToOpenAIMessageType(messageData) : null;
//                 });

//                 const resolvedMessages = await Promise.all(messagePromises);
//                 setLoadedMessages(resolvedMessages.filter(Boolean) as OpenAIMessage[]);
//             };

//             fetchMessages();
//         }
//     }, [messageIdSavedList]);

//     useEffect(() => {
//         for (let loadedMessage of loadedMessages) {
//             addMessageToChatbox(loadedMessage);
//         }
//     }, [loadedMessages]);


//     if (currSavedChat?.article_id == undefined) {
//         console.log("Chat not found");
//         return (
//             <div>Chat not found</div>
//         )
//     }

//     if (!currArticle) {
//         return <div>Loading article...</div>;
//     }

//     if (currArticle.article_id === undefined) {
//         return <div>Article not found</div>;
//     }

//     console.log("SAVED CHAT AND LOADED MESSAGES");
//     console.log(currSavedChat);
//     console.log(loadedMessages);

//     let previousMessages: OpenAIMessage[] = loadedMessages;



//     const newChatId = chatId;

//     let articleContent = currArticle?.content == null ? '' : currArticle?.content;

//     return (
//         <div>
//             <Head>
//                 <title>Chat about Article: {currArticle?.title}</title>
//             </Head>
//             <div className="container mx-auto flex min-h-screen items-center py-2">
//                 <div className="mx-auto mt-7 border border-black p-10 rounded-xl text-gray-600">

//                     <h2 className="text-2xl font-semibold mb-4">
//                         Your Existing Chat with the awesome Finterest Chatbot has been loaded!
//                     </h2>
//                     <h2 className="text-2xl font-semibold mb-4">
//                         Current Article: {currArticle?.title}
//                     </h2>

//                     <div className="mb-4">
//                         <p className="text-base">
//                             WELCOME TO THE AWESOME FINANCE APP! Lets chat about this article that you had just read! You may start by asking me any questions about the article.
//                         </p>
//                     </div>

//                     <div className={chatboxStyles.chatbox}>
//                         <div id="chatboxMessageList" className={chatboxStyles.chatboxMessages}>
//                             <div className={chatboxStyles.chatboxMessage}>
//                                 <p>WELCOME TO THE AWESOME FINANCE APP! Send me a new article to summarise:</p>
//                             </div>
//                         </div>
//                         <div className={chatboxStyles.chatboxInput + ' border-t border-black pt-4'}>
//                             <textarea id="chatboxTextInput" className={chatboxStyles.chatboxInputTextArea + ' w-full p-2 border border-black rounded'} placeholder="Type your message here..."></textarea>
//                             <button className={'w-1/6 ml-2 bg-green-400 border border-black rounded'} onClick={
//                                 async () => {
//                                     console.log('Send button clicked!');

//                                     // Get the message from the text area
//                                     // This uses typescript method of query selecting where we specify the type of the element 
//                                     // that we are selecting using <> and then we check if the element exists
//                                     // If it does, we can then use it as a normal element otherwise typescript will complain that it could be null
//                                     const messageEle = document.getElementById('chatboxTextInput') as HTMLTextAreaElement;
//                                     if (!messageEle) {
//                                         console.log('Message element does not exist!');
//                                         return;
//                                     }

//                                     const message = messageEle.value;

//                                     const promptUnNulled = message == null ? '' : String(message);
//                                     const newMessageButOpenAI: OpenAIMessage = {
//                                         role: "user",
//                                         content: promptUnNulled
//                                     };

//                                     addMessageToChatbox(newMessageButOpenAI);

//                                     messageEle.value = '';

//                                     // Generate a response from the OpenAI API
//                                     const response = await generatePrompts('gpt-3.5-turbo', message, finterestGenerateArticlePrompt.finterestGenerateArticlePrompt + articleContent, previousMessages);

//                                     // We can also use the ! operator to tell typescript to ignore the null error and pretend the thing always exists
//                                     // But this can be unsafe and cause errors if the object does not exist so we should 
//                                     // usually use the first 2 options (explicitly checking if the thing exists or using ?) instead


//                                     const responseUnNulled = response == null ? '' : String(response);

//                                     const newResponseButOpenAI: OpenAIMessage = {
//                                         role: "system",
//                                         content: responseUnNulled
//                                     };

//                                     addMessageToChatbox(newResponseButOpenAI);


//                                     previousMessages.push(newMessageButOpenAI);
//                                     previousMessages.push(newResponseButOpenAI);
//                                     addMessage(newMessageButOpenAI, newChatId);
//                                     addMessage(newResponseButOpenAI, newChatId);

//                                     console.log(previousMessages);

//                                 }}>Send</button>
//                         </div>
//                     </div>

//                     <Footer children={false} showBackButton={true} />
//                 </div>
//             </div>

//             <Script src="/utils/openai.js" />

//         </div>
//     );
// }


// function addMessageToChatbox(message: OpenAIMessage) {
//     const myNewMessage = document.createElement('div');

//     let fromWhoStyle = "";
//     if (message.role === "user") {
//         fromWhoStyle = chatboxStyles.chatboxMessageFromUser;
//     } else if (message.role === "system") {
//         fromWhoStyle = chatboxStyles.chatboxMessageFromSystem;
//     }

//     myNewMessage.className = chatboxStyles.chatboxMessage + ' ' + fromWhoStyle;
//     myNewMessage.innerHTML = `<p>${message.content}</p>`;
//     document.getElementById('chatboxMessageList')?.appendChild(myNewMessage);
// }