import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';

/*
    The page where the user first enters after he logs in
*/
const Dashboard = () => {
    const { logOut } = useAuth();
    const router = useRouter();

    return (
        <ProtectedRoute>
            <Head>
                <title>Dashboard - Finterest</title>
                <meta
                    name="description"
                    content="Finterest dashboard"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container mx-auto flex min-h-screen items-center py-2">
                <div className="mx-auto mt-24 overflow-y-hidden px-12 py-24 text-gray-600">
                    <h2 className="mb-4 text-2xl font-semibold">
                        You are logged in!
                    </h2>

                    <div className="mb-8 flex items-center justify-center">
                        <button
                            onClick={() => {
                                logOut();
                                router.push('/');
                            }}
                            className="rounded-md bg-green-600 px-10 py-3 text-white shadow-sm hover:bg-green-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;