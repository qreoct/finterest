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
            router.push('/dashboard');
        } catch (error: any) {
        }
       
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
        <div className="flex justify-center items-center">
            <div className="w-1/4 h-full p-4 py-8 sm:p-6 sm:py-10 md:p-8 md:py-14 dark:bg-gray-800 dark:border-gray-700">

                <form action="" onSubmit={handleEmailLogin} className="group">
                    <h3 className='font-dmsans text-4xl sm:text-5xl font-bold text-center'>Welcome back.</h3>

                    <div className="mt-5 mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-dmsans font-bold text-finterest-black">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 font-dmsans text-finterest-solid text-sm rounded-lg focus:growth-gold-500 focus:border-growth-gold-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-prosperity-pine-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
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
                        <span className="mt-1 text-sm font-dmsans text-red-400">
                            {emailErrorMessage}
                        </span>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-dmsans font-bold text-finterest-black">Your password</label>
                        <div className='flex relative'>
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-growth-gold-500 focus:border-growth-gold-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-prosperity-pine-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
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
                                    <BsFillEyeSlashFill className='text-lg cursor-pointer text-gray-300' onClick={togglePasswordVisibility} />
                                ) : (
                                    <BsFillEyeFill className='text-lg cursor-pointer text-growth-gold-900' onClick={togglePasswordVisibility} />
                                )}
                            </span>

                        </div>
                        <span className="mt-1 text-sm text-red-400">
                            {passwordErrorMessage}
                        </span>
                    </div>

                    <button type="submit" disabled={!canSubmit}
                        className="w-full text-white bg-prosperity-pine-500 hover:bg-prosperity-pine-900 focus:ring-4 focus:outline-none focus:growth-gold-500 rounded-lg text-lg font-bold font-dmsans px-5 py-3 text-center mb-8 mt-2 disabled:bg-gradient-to-br disabled:gray-100disabled:cursor-not-allowed group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:pointer-events-none group-invalid:opacity-70">
                        Login
                    </button>

                    <div className="text-md font-bold text-gray-500 dark:text-gray-300 flex text-center font-lg justify-center items-center mb-3">
                        <NextLink
                            href="/register"
                            className="text-finterest-solid hover:text-growth-gold-500 font-dmsans font-lg font-bold hover:underline dark:text-gray-200 flex justify-between items-center w-20"
                        >
                            Register <FiChevronRight className="text-lg" />
                        </NextLink>
                    </div>
                </form>
                <div className='flex justify-center items-center space-x-5'>
                    <button onClick={handleGoogleLogin} className="flex justify-center content-center w-full text-white mt-5 font-dmsans font-bold  bg-steady-sapphire-500 p-3 rounded-md hover:bg-steady-sapphire-900">
                        <BsGoogle className="text-lg mr-3 mt-auto mb-auto" />
                        Google Sign In
                    </button>
                    <button onClick={passwordResetButtonClick} className="flex justify-center content-center w-full text-white mt-5 font-dmsans font-bold bg-finance-firecracker-500 p-3 rounded-md hover:bg-finance-firecracker-900">
                        Forgot Password
                    </button>
                </div>
                <h4 className="mt-5 text-rose-500 text-center">{errorMessage}</h4>
            </div>
        </div>

    );
};

export default LoginForm;