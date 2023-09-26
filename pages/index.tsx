import Head from 'next/head';
import LoginForm from '@/components/LoginForm';

//Entry point of the application
export default function Home() {
    return (
        <>
            <Head>
                <title>Finterest</title>
                <meta
                    name="description"
                    content="Turning learning into earning for youths"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/icon.ico" />
            </Head>
            <main className="m-0 bg-gradient-to-br from-primary-color to-blue-400 px-4">
                <LoginForm />
            </main>
        </>
    );
}