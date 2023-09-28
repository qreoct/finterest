import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getUserReadCountNDays, getUserReadTotalNDays } from '@/config/firestore';
import { useEffect, useState } from 'react';
import LeftNavigationBar from '@/components/common/LeftNavigationBar'
import { BiLogOut } from "react-icons/bi";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { getAuth, updatePassword } from 'firebase/auth';
import Script from 'next/script';


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
        if (!userId) {
            return;
        }

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
    }, [userId]);


    const [password, setPassword] = useState<string>('');
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [message, setMessage] = useState('');


    const passwordPattern = ".{8,}";

     //Handler that toggles password visibility
     const togglePasswordVisibility = () => {
        setPasswordVisibility(!isPasswordVisible);
    }

    const canSubmit = password !== '';

    //Handler that runs when user wants to change password
    const handleChangePassword = async (e: any) => {
        e.preventDefault();
        changePassword(password)
            .then(() => {
                setMessage("Password has been successfully changed.");
                setPassword('');

                const submitButton = document.getElementById('submitButton');
              
                submitButton?.classList.remove("disabled");
                const inputField = document.getElementById('password') as HTMLInputElement | null;
                if (inputField != null) {
                 inputField.value = '';
                }
            })
        .catch((error) => (
            setMessage("Password cannot be changed. Please try again later.")
        ))
        setTimeout(function () {
            setMessage('');

        }, 3000);
    };


    //Change password
    const changePassword = async (password: string) => {
        const currentUser =  getAuth().currentUser
        if (currentUser != null)
        updatePassword(currentUser, password).then(() => {
            // Update successful.
        });
    }




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
            </Head>

            <div className="flex items-center flex-col-reverse md:flex-row md:items-start h-screen overflow-y-hidden">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={2} />

                {/* Right Content */}
                <div className="flex flex-col bg-white w-full h-screen overflow-y-auto space-y-8 md:space-y-5">
                    <h2 className="text-center md:text-start font-gupter text-neutral-headings-black font-bold text-4xl mx-16 mt-16">Your Article Stats</h2>

                    {/* Yellow cards with rounded corners that show your read counts this week / month / year */}
                    <div className="flex flex-row justify-center md:justify-start items-center xs:space-x-8 mx-4 lg:mx-16">
                        <div className="flex flex-col justify-center items-center rounded-lg px-8 py-4 space-y-2">
                            <h3 className="font-gupter text-gold-500 font-bold text-6xl">{readWeeklyTotal}</h3>
                            <h5 className="font-dmsans text-center text-neutral-headings-black text-xl">This Week</h5>
                        </div>
                        <div className="flex flex-col justify-center items-center rounded-lg px-8 py-4 space-y-2">
                            <h3 className="font-gupter text-gold-500 font-bold text-6xl">{readMonthlyTotal}</h3>
                            <h5 className="font-dmsans text-center text-neutral-headings-black text-xl">This Month</h5>
                        </div>
                        <div className="flex flex-col justify-center items-center rounded-lg px-8 py-4 space-y-2">
                            <h3 className="font-gupter text-gold-500 font-bold text-6xl">{readYearlyTotal}</h3>
                            <h5 className="font-dmsans text-center text-neutral-headings-black text-xl">This Year</h5>
                        </div>
                    </div>

                    {/* 7 horizontally stacked cards that show your read counts for the past week */}
                    <div className='h-64'>
                        <div className="flex justify-start items-center space-x-5 mx-16 mt-4 md:mt-8 lg:mt-16 overflow-x-auto overflow-y-hidden py-4">
                            {readCounts.map((count, index) => (
                                <div key={index} className={`flex-col justify-center items-center ${count[1] >= 5 ? 'bg-gold-500' : 'bg-bg-slate-200'} ${count[1] >= 5 ? 'border-0' : 'border-2' } rounded-lg h-28 lg:h-36 w-28 px-2 py-2 lg:py-8`}>
                                    <h3 className={`font-gupter text-center self-center text-neutral-headings-black font-bold text-3xl xl:text-4xl ${count[1] >= 5 ? 'text-white' : 'text-finterest-solid' }`}>{count[1]}</h3>
                                    <h5 className={`font-dmsans text-neutral-headings-black text-lg xl:text-xl text-center ${count[1] >= 5 ? 'text-white' : 'text-finterest-solid'} `}>{count[0]}</h5>
                                </div>
                            ))}
                        </div>
                    </div>


                    <h2 className="text-center md:text-start font-gupter text-neutral-headings-black font-bold text-4xl mx-8 md:mx-16 pt-8">Change Password</h2>
                    <div className="self-center md:self-start mb-5 w-3/5 md:w-2/5 xl:w-1/4 mx-16">
                        <label htmlFor="password" className="block mb-2 font-dmsans font-bold text-finterest-black">New Password</label>
                        <div className='flex relative'>
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gold-500 focus:border-gold-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-pine-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                                pattern=".{8,}"
                                required
                                onChange={(e: any) => {
                                    setPassword(e.target.value);
                                    if (e.target.value.match(passwordPattern) || e.target.value == '') {
                                        setPasswordErrorMessage('');
                                    } else {
                                        setPasswordErrorMessage('Password must be at least 8 characters.');
                                    };
                                }}
                            />
                            <span className='absolute inset-y-0 right-0 flex items-center pr-3 mr-3'>
                                {!isPasswordVisible ? (
                                    <BsFillEyeSlashFill className='text-lg cursor-pointer text-gray-300' onClick={togglePasswordVisibility} />
                                ) : (
                                    <BsFillEyeFill className='text-lg cursor-pointer text-gold-900' onClick={togglePasswordVisibility} />
                                )}
                            </span>
                        </div>
                        <span className="mt-1 text-sm font-dmsans text-firecracker-500">
                            {passwordErrorMessage}
                        </span>

                        <button id='submitButton' type="submit" disabled={!canSubmit}
                        className="w-full text-white bg-pine-500 hover:bg-pine-900 focus:ring-4 focus:outline-none focus:gold-500 rounded-lg text-lg font-bold font-dmsans px-5 py-3 text-center mb-8 mt-5 disabled:bg-gray-300 disabled:cursor-not-allowed group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:pointer-events-none group-invalid:opacity-70"
                        onClick={ handleChangePassword }>
                            Confirm
                        </button>

                        <h4 className="mt-5 text-firecracker-500 text-center">{ message }</h4>

                    </div>


                    {/* Logout Button */}
                    <div className="flex justify-center items-center md:hidden">
                        <button className="bg-gold-500 hover:bg-gold-900 text-white font-semibold py-2 px-8 rounded-full flex items-center mb-5"
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