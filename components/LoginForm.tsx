import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PageWrapper } from './PageWrapper';
import { FiChevronRight } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { LoginType } from '@/types/AuthTypes';
import React, { useEffect } from 'react';
import { BsGoogle, BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { addUserIfNotExist } from '@/config/firestore';

/*
A login form component that consists of the login options available
for the user.
Adapted from https://github.com/realstoman/nextjs-firebase-auth/tree/main
*/

const LoginForm = () => {
    //State variables
    const [data, setData] = useState<LoginType>({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState(''); //Error message when logging in
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');


    //Regex patterns for email and password
    const emailPattern = "[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
    const passwordPattern = ".{8,}";

    //Get login functionalities from the current context
    const { user, loginViaEmail: loginViaEmail, googleSignIn: googleSignIn } = useAuth();
    //Prepare router for transitions between routes
    const router = useRouter();


    //Checks if the user is currently signed in
    useEffect(() => {
        if (user.uid) {
            //User is authenticated. Redirect to dashboard.
            addUserIfNotExist(user.uid);
            router.push('/dashboard');
        }
    }, [user])


    //Handler that runs when user clicks on login via email
    const handleEmailLogin = async (e: any) => {
        e.preventDefault();
        try {
            await loginViaEmail(data.email, data.password);
            router.push('/dashboard');
        } catch (error: any) {
            console.log(error.code);
            if (error.code === 'auth/invalid-login-credentials') {
                setErrorMessage("Invalid credentials");
            } else {
                setErrorMessage("Something went wrong. Please try again later.");
            }


        }
    };


    //Handler that runs when user clicks on login via google
    const handleGoogleLogin = async (e: any) => {
        e.preventDefault();
        try {
            await googleSignIn();
        } catch (error: any) {
        }
        router.push('/dashboard');
    }

    //Handler that runs when user clicks on reset password button
    const passwordResetButtonClick = () => {
        router.push('/passwordrecovery');
    }

    //Handler that toggles password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisibility(!isPasswordVisible);
    }


    // Destructure data from the data object
    const { ...allData } = data;
    // Disable submit button until all fields are filled in
    const canSubmit = [...Object.values(allData)].every(Boolean);

    return (
        <PageWrapper>
            <div className="flex justify-center items-center">
                <div className="w-full max-w-sm p-4 py-8 bg-white border border-stone-200 rounded-lg shadow-md sm:p-6 sm:py-10 md:p-8 md:py-14 dark:bg-stone-800 dark:border-stone-700">

                    <form action="" onSubmit={handleEmailLogin} className="group">
                        <h5 className="text-2xl sm:text-3xl font-medium sm:font-semibold text-stone-900 dark:text-white text-center mb-2">
                            Login
                        </h5>
                        <p className="text-center text-stone-500 dark:text-stone-200 text-md mb-8">
                            Please enter your login credentials to login into Finterest.
                        </p>
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-stone-900 dark:text-white">Your email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-stone-50 border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-sapphire-500 focus:border-sapphire-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-500 dark:placeholder-stone-400 dark:text-white focus:outline-none placeholder-stone-300 valid:[&:not(:placeholder-shown)]:border-pine-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                                autoComplete="off"
                                required
                                pattern="[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                placeholder="user@gmail.com"
                                onChange={(e: any) => {
                                    setData({
                                        ...data,
                                        email: e.target.value,
                                    });
                                    if (e.target.value.match(emailPattern) || e.target.value == '') {
                                        setEmailErrorMessage('');
                                    } else {
                                        setEmailErrorMessage('Please enter a valid email address');
                                    };
                                }}
                            />
                            <span className="mt-1 text-sm text-red-400">
                                {emailErrorMessage}
                            </span>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-stone-900 dark:text-white">Your password</label>
                            <div className='flex relative'>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-stone-50 border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-500 dark:placeholder-stone-400 dark:text-white focus:outline-none placeholder-stone-300 valid:[&:not(:placeholder-shown)]:border-pine-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                                    pattern=".{8,}"
                                    required
                                    onChange={(e: any) => {
                                        setData({
                                            ...data,
                                            password: e.target.value,
                                        });
                                        if (e.target.value.match(passwordPattern) || e.target.value == '') {
                                            setPasswordErrorMessage('');
                                        } else {
                                            setPasswordErrorMessage('Password must be at least 8 characters.');
                                        };
                                    }}
                                />
                                <span className='absolute inset-y-0 right-0 flex items-center pr-3 mr-3'>
                                    {!isPasswordVisible ? (
                                        <BsFillEyeSlashFill className='text-lg cursor-pointer text-stone-300' onClick={togglePasswordVisibility} />
                                    ) : (
                                        <BsFillEyeFill className='text-lg cursor-pointer text-blue-500' onClick={togglePasswordVisibility} />
                                    )}
                                </span>

                            </div>
                            <span className="mt-1 text-sm text-firecracker-500">
                                {passwordErrorMessage}
                            </span>
                        </div>

                        <button type="submit" disabled={!canSubmit}
                            className="w-full text-white bg-pine-500 hover:bg-pine-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center mb-8 mt-2 disabled:bg-gradient-to-br disabled:from-stone-100 disabled:to-stone-300 disabled:text-stone-400 disabled:cursor-not-allowed group-invalid:bg-gradient-to-br group-invalid:from-stone-100 group-invalid:to-stone-300 group-invalid:text-stone-400 group-invalid:pointer-events-none group-invalid:opacity-70">
                            Login
                        </button>

                        <div className="text-md font-medium text-stone-500 dark:text-stone-300 flex text-center justify-center items-center">
                            <NextLink
                                href="/register"
                                className="text-stone-500 hover:text-stone-800 hover:underline dark:text-stone-200 dark:hover:text-white flex justify-between items-center w-20"
                            >
                                Register <FiChevronRight className="text-lg" />
                            </NextLink>
                        </div>
                    </form>
                    <button onClick={handleGoogleLogin} className="flex justify-center content-center w-full text-white mt-5 bg-sapphire-500 p-3 rounded-md hover:bg-sapphire-900">
                        <BsGoogle className="text-lg mr-3 mt-auto mb-auto" />
                        Google Sign In
                    </button>
                    <button onClick={passwordResetButtonClick} className="flex justify-center content-center w-full text-white mt-5 bg-rose-500 p-3 rounded-md hover:bg-rose-900">
                        Forgot Password
                    </button>
                    <h4 className="mt-5 text-rose-500 text-center">{errorMessage}</h4>

                </div>
            </div>
        </PageWrapper>
    );
};

export default LoginForm;