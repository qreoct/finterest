import Head from 'next/head';
import LoginForm from '@/components/LoginForm';
import Landing from '@/components/Landing/landing';

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
                <link rel="icon" href="/favicon.ico" />
                {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Gupter:wght@400;500;700&display=swap"/> */}
            </Head>
            <main>
                <Landing />
            </main>
        </>
    );
}