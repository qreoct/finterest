import { useState, useEffect } from 'react';
import { auth } from '../config/firebase.config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

/*
A password recovery form component that allows users to recover their password via email.
Adapted from https://github.com/realstoman/nextjs-firebase-auth/tree/main
*/
const PasswordRecoveryForm = () => {
    //State variables
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [message, setMessage] = useState('');


    //Auth variables
    const authInstance = auth;
    const { user } = useAuth();

    //Prepare router for transitions between routes
	const router = useRouter();



    //Regex patterns for email
    const emailPattern = "[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$";

    //Checks if the user is currently signed in
    useEffect(() => {
        if (user.uid) {
            //User is authenticated. Redirect to dashboard.
            router.push('/dashboard');
        }
    }, [user])


    //Handler that runs when user wants to receive a password recovery email
    const handleSendPasswordRecoveryEmail = async (e: any) => {
        e.preventDefault();
        sendPasswordResetEmail(authInstance, email)
            .then(() => {
                setMessage("Recovery email has been successfully sent");
            })
        .catch((error) => (
            setMessage("Something went wrong. Please try again later.")
        ))
    };


    // Disable submit button until all fields are filled in
    const canSubmit = email !== '';

    return (
        <div className="flex justify-center items-center w-screen">
            <div className="w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/2 h-full p-4 py-8 sm:p-6 sm:py-10 md:p-8 md:py-14">
                <form action="" onSubmit={handleSendPasswordRecoveryEmail} className="group">
                    <h3 className='font-dmsans text-3xl sm:text-4xl lg:text-5xl font-bold text-center'>Forgot your password?</h3>    
                    <p className="mt-5 text-center text-gray-400 text-md mb-8">
                        Don&apos;t worry. We will send you a password recovery email.
                    </p>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-dmsans font-bold text-finterest-black">Your email</label>    
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 font-dmsans text-finterest-solid text-sm rounded-lg focus:gold-500 focus:border-gold-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-pine-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                            autoComplete="off"
                            required
                            pattern="[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            placeholder="user@gmail.com"
                            onChange={(e: any) => {
                                setEmail(e.target.value);
                                if (e.target.value.match(emailPattern) || e.target.value == '') {
                                    setEmailErrorMessage('');
                                } else {
                                    setEmailErrorMessage('Please enter a valid email address');
                                };

                            }}
                        />
                        <span className="mt-1 text-sm font-dmsans text-firecracker-500">
                            { emailErrorMessage }
                        </span>
                    </div>
                    
                    <button type="submit" disabled={!canSubmit}
                        className="w-full text-white bg-pine-500 hover:bg-pine-900 focus:ring-4 focus:outline-none focus:gold-500 rounded-lg text-lg font-bold font-dmsans px-5 py-3 text-center mb-8 mt-2 disabled:bg-gradient-to-br disabled:gray-100disabled:cursor-not-allowed group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:pointer-events-none group-invalid:opacity-70">
                        Send Recovery Email
                    </button>
                    <div className="text-md text-finterest-solid flex text-center text-lg justify-center items-center mb-3 w-full">
                        <p>Return to login <span><Link href='/login' className='text-finterest-solid hover:text-gold-500 font-dmsans text-lg font-bold hover:underline'>here</Link>.</span></p>
                    </div>
                    
                    <h4 className="mt-5 text-rose-500 text-center">{ message }</h4>
                </form>
            </div>
        </div> 
    );
};

export default PasswordRecoveryForm;