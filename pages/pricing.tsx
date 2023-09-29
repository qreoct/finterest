import NextLink from 'next/link';
import { PageWrapper } from '@/components/PageWrapper';
import Head from 'next/head';
import Header from '@/components/Landing/header';
import Footer from '@/components/Landing/footer';
import Script from 'next/script';
import PricingContent from '@/components/Pricing/PricingContent';

/*
Pricing page
*/

const Pricing = () => {
  
    return (
        <>
            <Head>
                <title>Finterest - Pricing </title>
                <meta
                    name="description"
                    content="Turning Wisdom Into Wealth"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                
            </Head>
            <main>
                <PageWrapper>
                    <div className="flex flex-col justify-between h-screen w-full overflow-y-auto">
                        {/* Header */}
                        <Header tabIndex={1} />

                        {/* Body */}
                        <PricingContent isLoggedIn={false}/>


                        {/* Footer */}
                        <Footer />

                    </div>
                </PageWrapper>
            </main>
        </>
    );
};

export default Pricing;