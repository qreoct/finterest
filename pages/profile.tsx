import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getUserReadCountNDays, getUserReadTotalNDays } from '@/config/firestore';
import { useEffect, useState } from 'react';
import LeftNavigationBar from '@/components/common/LeftNavigationBar'
import { BiLogOut } from "react-icons/bi";


/*
    The page where the user first enters after he logs in
*/
const Profile = () => {

    // Get user read counts
    const { user, logOut } = useAuth();
    const router = useRouter();
    const userId = user.uid;

    const [readCounts, setReadCounts] = useState<number[][]>([]);
    const [readWeeklyTotal, setReadWeeklyTotal] = useState<number>(0);
    const [readMonthlyTotal, setReadMonthlyTotal] = useState<number>(0);
    const [readYearlyTotal, setReadYearlyTotal] = useState<number>(0);

    useEffect(() => {
        const fetchUserReadCounts = async () => {
            const res = await getUserReadCountNDays(userId, 7);
            setReadCounts(res);
        };

        const fetchUserReadTotals = async () => {
            const resWeekly = await getUserReadTotalNDays(userId, 7);
            const resMonthly = await getUserReadTotalNDays(userId, 30);
            const resYearly = await getUserReadTotalNDays(userId, 365);
            setReadWeeklyTotal(resWeekly);
            setReadMonthlyTotal(resMonthly);
            setReadYearlyTotal(resYearly);
        }

        fetchUserReadCounts();
        fetchUserReadTotals();
    }, []);

    return (
        <ProtectedRoute>
            <Head>
                <h2 className="font-gupter text-neutral-headings-black font-bold text-4xl ml-16 mt-16">Your Stats</h2>
                <meta
                    name="description"
                    content="Finterest AI"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
                @import url(`https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Gupter:wght@400;500;700&display=swap`);

            </Head>

            <div className="flex">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={1} />

                {/* Right Content */}
                <div className="bg-white w-full overflow-y-auto space-y-5" style={{ height: '100vh' }}>
                    <h2 className="font-gupter text-neutral-headings-black font-bold text-4xl ml-16 mt-16">Your Article Stats</h2>

                    {/* Yellow cards with rounded corners that show your read counts this week / month / year */}
                    <div className="flex flex-row justify-center items-center space-x-8">
                        <div className="flex flex-col justify-center items-center bg-gold-100 rounded-lg w-1/4 h-1/4">
                            <h3 className="font-gupter text-neutral-headings-black font-bold text-4xl">{readWeeklyTotal}</h3>
                            <h5 className="font-dmsans text-neutral-headings-black text-xl">This Week</h5>
                        </div>
                        <div className="flex flex-col justify-center items-center bg-gold-100 rounded-lg w-1/4 h-1/4">
                            <h3 className="font-gupter text-neutral-headings-black font-bold text-4xl">{readMonthlyTotal}</h3>
                            <h5 className="font-dmsans text-neutral-headings-black text-xl">This Month</h5>
                        </div>
                        <div className="flex flex-col justify-center items-center bg-gold-100 rounded-lg w-1/4 h-1/4">
                            <h3 className="font-gupter text-neutral-headings-black font-bold text-4xl">{readYearlyTotal}</h3>
                            <h5 className="font-dmsans text-neutral-headings-black text-xl">This Year</h5>
                        </div>
                    </div>

                    {/* 7 vertically stacked cards that show your read counts for the past week */}
                    <div className="flex flex-col justify-center items-center space-y-5">
                        {readCounts.map((count, index) => (
                            <div key={index} className={`flex justify-center items-center ${count[1] >= 5 ? 'bg-yellow-100' : 'bg-yellow-50'} rounded-lg w-1/2 h-1/4 space-x-20`}>
                                <h3 className="font-gupter text-neutral-headings-black font-bold text-4xl">{count[1]}</h3>
                                <h5 className="font-dmsans text-neutral-headings-black text-xl">{count[0]}</h5>
                            </div>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <div className="flex justify-center items-center">
                        <button className="bg-gold-500 hover:bg-gold-900 text-white font-semibold py-2 px-8 rounded-full flex items-center mt-5"
                        onClick={
                            () => {
                                logOut();
                                router.push('/');
                            }}>
                            <BiLogOut className='text-3xl cursor-pointer m-2' />
                            <span className="mr-2">Logout</span>
                        </button>
                    </div>

                </div>

            </div>

        </ProtectedRoute>
    );
};

export default Profile;