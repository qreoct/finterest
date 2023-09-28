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

                <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />

                <Script id='google-analytics' strategy="lazyOnload">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                    `}
                </Script>
               
            </Head>
      
            <div className="flex items-center flex-col-reverse overflow-y-hidden h-screen md:flex-row">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={1} />

                {/* Right Content */}
                <div className="bg-white w-full overflow-y-hidden h-screen">
                    <GeneralConvo tabIndex={0} />
                </div>

            </div>

        </ProtectedRoute>
    );
};

export default ChatWithAi;