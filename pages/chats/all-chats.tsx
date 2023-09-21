

import { useAuth } from '@/context/AuthContext';
import { getChatIdList } from '@/config/firestore';
import { useEffect, useState } from 'react';
import { ChatList } from '@/components/ChatStuff/AllChatList';
import Footer from '@/components/common/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AllChatsPage() {

    const { user } = useAuth();

    const userId = user.uid;

    const [chatIdList, setChatIdList] = useState<string[]>([]);

    useEffect(() => {
        const fetchChatIdList = async () => {
            const chatIdPromise = await getChatIdList(userId);
            const resolvedChatIdList = await chatIdPromise;

            setChatIdList(resolvedChatIdList);
        };

        fetchChatIdList();
    }, [userId]);

    console.log("CHAT ID LIST: " + chatIdList);

    return (
        // Center the All Chat List on the screen to a reasonable size with nice styling
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <div className="flex flex-col items-center justify-center py-2 m-20">
                    <h1 className="text-4xl font-bold p-10">My Chats</h1>
                    <ChatList articleIdList={chatIdList} />
                </div>

                <Footer children={false} showBackButton={true} />
            </div>
        </ProtectedRoute>

    );
}