import RegistrationForm from '@/components/RegistrationForm';
import Head from 'next/head';

const register = () => {
    return (
        <>
            <Head>
                <title>Finterest</title>
                <meta
                    name="description"
                    content="Register for a new Finterest account"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="m-0 min-h-screen bg-gradient-to-br from-primary-color to-blue-400 px-4">
                <RegistrationForm />
            </main>
        </>
    );
};

export default register;