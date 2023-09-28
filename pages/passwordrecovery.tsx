import Head from 'next/head';
import { PageWrapper } from '@/components/PageWrapper';
import PasswordRecoveryForm from '@/components/PasswordRecoveryForm';
import Header from '@/components/Landing/header';
import Footer from '@/components/Landing/footer';
import Script from 'next/script';

const passwordrecovery = () => {
   

    return (
        <>
            <Head>
                <title>Finterest - Login</title>
                <meta
                    name="Login to Finterest"
                    content="Turning Wisdom Into Wealth"
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
            <main>
                <PageWrapper>
                    <div className="flex flex-col justify-between h-screen w-full overflow-y-auto overflow-x-hidden">
                        {/* Header */}
                        <Header tabIndex={2} />
                       

                        {/* Body */}
                        <div id="body-element" className='-mt-0 sm:-mt-10 flex justify-center'>
                            <div>
                            <PasswordRecoveryForm />
                            </div>
                           
                        </div>

                        {/* Footer */}
                        <Footer />


                    
                        



                    
                    </div>
                </PageWrapper>
            </main>
        </>
    );





};

export default passwordrecovery;