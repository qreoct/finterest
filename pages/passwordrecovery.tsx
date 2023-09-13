import PasswordRecoveryForm from '@/components/PasswordRecoveryForm';
import Head from 'next/head';

const passwordrecovery = () => {
    return (
        <>
            <Head>
                <title>Password Recovery</title>
                <meta
                    name="Finterest"
                    content="Recover your password for Finterest"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="m-0 min-h-screen bg-gradient-to-br from-primary-color to-blue-400 px-4">
                <PasswordRecoveryForm />
            </main>
        </>
    );
};

export default passwordrecovery;