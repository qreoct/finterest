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
        <div className="flex justify-center items-center w-screen">
            <div className="w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 h-full p-4 py-8 sm:p-6 sm:py-10 md:p-8 md:py-14 dark:bg-gray-800 dark:border-gray-700">

                <form action="" onSubmit={handleEmailLogin} className="group">
                    <h3 className='font-dmsans text-3xl sm:text-4xl lg:text-5xl font-bold text-center'>Welcome back.</h3>

                    <div className="mt-5 mb-5">
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
                        <span className="mt-1 text-sm font-dmsans font-bold text-firecracker-500">
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gold-500 focus:border-gold-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white focus:outline-none placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-pine-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
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
                                    <BsFillEyeFill className='text-lg cursor-pointer text-gold-900' onClick={togglePasswordVisibility} />
                                )}
                            </span>
                        </div>
                        <span className="mt-1 text-sm font-dmsans font-bold text-firecracker-500">
                            {passwordErrorMessage}
                        </span>
                    </div>

                    <button type="submit" disabled={!canSubmit}
                        className="w-full text-white bg-pine-500 hover:bg-pine-900 focus:ring-4 focus:outline-none focus:gold-500 rounded-lg text-lg font-bold font-dmsans px-5 py-3 text-center mb-8 mt-2 disabled:bg-gradient-to-br disabled:gray-100disabled:cursor-not-allowed group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:pointer-events-none group-invalid:opacity-70">
                        Login
                    </button>

                    <div className="text-md text-finterest-solid flex text-center text-lg justify-center items-center mb-3 w-full">
                        <p>Don't have an account? Register <span><a href='/register' className='text-finterest-solid hover:text-gold-500 font-dmsans text-lg font-bold hover:underline'>here</a></span></p>
                    </div>
                </form>
                <div className='flex flex-col sm:flex-row justify-center items-center space-y-5 sm:space-y-0 sm:space-x-5 mt-8'>
                    <div className='sm:w-1/2'>
                        <button onClick={handleGoogleLogin} className="flex justify-center content-center w-48 sm:w-full text-white font-dmsans font-bold  bg-sapphire-500 p-3 rounded-md hover:bg-sapphire-900">
                            <BsGoogle className="text-lg mr-3 mt-auto mb-auto" />
                            Google Sign In
                        </button>
                    </div>
                    <NextLink href='/passwordrecovery' className='sm:w-1/2 flex justify-center'>
                        <button onClick={passwordResetButtonClick} className="flex justify-center content-center w-48 sm:w-full text-white font-dmsans font-bold bg-firecracker-500 p-3 rounded-md hover:bg-firecracker-900">
                            Forgot Password
                        </button>
                    </NextLink>
                </div>
                <h4 className="mt-5 text-lg font-dmsans font-bold text-firecracker-500 text-center">{errorMessage}</h4>
            </div>
        </div>

    );
};

export default LoginForm;