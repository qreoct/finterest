import Head from 'next/head';
import Landing from '@/components/Landing/landing';
import Script from 'next/script';

//Entry point of the application
export default function Home() {
    return (
        <>
            <Head>
                <title>Finterest</title>
                <meta
                    name="description"
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
                <Landing />
            </main>
        </>
    );
}