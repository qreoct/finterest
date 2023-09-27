import Head from 'next/head';
import Landing from '@/components/Landing/landing';
import Script from "next/script";

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
            </Head>
            <main>
                <Landing />
            </main>
        </>
    );
}