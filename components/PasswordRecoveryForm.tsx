import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { PageWrapper } from './PageWrapper';
import { FiChevronLeft } from 'react-icons/fi';
import { auth } from '../config/firebase.config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

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
                setMessage("Recovery email successfully sent");
            })
        .catch((error) => (
            setMessage("Something went wrong. Please try again later.")
        ))
    };


    // Disable submit button until all fields are filled in
    const canSubmit = email !== '';

    return (
        <PageWrapper>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 py-8 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6 sm:py-10 md:p-8 md:py-14">
                    <form action="" onSubmit={handleSendPasswordRecoveryEmail} className="group">
                        <h5 className="mb-2 text-center text-2xl font-medium text-gray-900 dark:text-white sm:text-3xl sm:font-semibold">
                            Reset Password
                        </h5>
                        <p className="text-center text-gray-500 dark:text-gray-200 text-md mb-8">
                            We will send you a password recovery email.
                        </p>
                        <div className="mb-5">
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-green-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
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
                            <span className="mt-1 text-sm text-red-400">
                                { emailErrorMessage }
                            </span>
                        </div>
                       
                        <button type="submit" disabled={!canSubmit}
                            className="mb-8 mt-2 w-full rounded-lg bg-green-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gradient-to-br disabled:from-gray-100 disabled:to-gray-300 disabled:text-gray-400 group-invalid:pointer-events-none group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:opacity-70">
                            Send Recovery Email
                        </button>
                        <div className="text-md flex items-center justify-center text-center font-medium text-gray-500 dark:text-gray-300">
                            <NextLink
                                href="/"
                                className="flex w-32 items-center justify-between text-gray-500 hover:text-gray-800 hover:underline dark:text-gray-200 dark:hover:text-white"
                            >
                                <FiChevronLeft className="text-xl" /> Login Instead
                            </NextLink>
                        </div>
                        <h4 className="mt-5 text-rose-500 text-center">{ message }</h4>
                    </form>
                </div>
            </div>
        </PageWrapper>
    );
};

export default PasswordRecoveryForm;