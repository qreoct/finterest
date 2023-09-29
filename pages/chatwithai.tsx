import ProtectedRoute from '@/components/ProtectedRoute';
import Head from 'next/head';
import LeftNavigationBar from '@/components/common/LeftNavigationBar'
import GeneralConvo from '@/components/ChatStuff/GeneralConvo';
import Script from 'next/script';


/*
    The page where the user first enters after he logs in
*/
const ChatWithAi = () => {
    return (
        <ProtectedRoute>
            <Head>
                <title>Chat with Finterest AI</title>
                <meta
                    name="description"
                    content="Finterest AI"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

            </Head>
      
            <div className="flex items-center flex-col-reverse overflow-y-hidden h-screen md:flex-row">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={1} />

                {/* Right Content */}
                <div className="bg-white w-full overflow-y-hidden h-80vh md:h-screen">
                    <GeneralConvo tabIndex={1} />
                </div>

            </div>

        </ProtectedRoute>
    );
};

export default ChatWithAi;