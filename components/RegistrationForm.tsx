import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { RegistrationType } from '@/types/AuthTypes';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PageWrapper } from './PageWrapper';
import { FiChevronLeft } from 'react-icons/fi';
import React, { useEffect } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';


/*
A registration form component that consits of the registration fields available
for the user.
Adapted from https://github.com/realstoman/nextjs-firebase-auth/tree/main
*/


const RegistrationForm = () => {
    //State variables
    const [data, setData] = useState<RegistrationType>({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState(''); //Error message when registering
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    //Regex patterns for email and password
    const emailPattern = "[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
    const passwordPattern = ".{8,}";

    //Get registration functionalities from the current context

    //Use the signUp method from the AuthContext
    const { user, signUpViaEmail: signUpViaEmail } = useAuth();
    //Prepare router for transitions between routes
    const router = useRouter();

    //Checks if the user is currently signed in
    useEffect(() => {
        if (user.uid) {
            //User is authenticated. Redirect to dashboard.
            router.push('/dashboard');
        }
    }, [user]);


    //Handler that runs when user clicks on register
    const handleRegistration = async (e: any) => {
        e.preventDefault();
        try {
            await signUpViaEmail(data.email, data.password);
            router.push('/dashboard');
        } catch (error: any) {
            console.log(error.code);
            if (error.code == "auth/email-already-in-use") {
                setErrorMessage("Email has already been taken");
            } else {
                setErrorMessage("Something went wrong. Please try again later.");
            }
        }
    };

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
            <div className="flex items-center justify-center">
                <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-4 py-8 shadow-md dark:border-stone-700 dark:bg-stone-800 sm:p-6 sm:py-10 md:p-8 md:py-14">
                    <form action="" onSubmit={handleRegistration} className="group">
                        <h5 className="mb-2 text-center text-2xl font-medium text-stone-900 dark:text-white sm:text-3xl sm:font-semibold">
                            Register
                        </h5>
                        <p className="text-center text-stone-500 dark:text-stone-200 text-md mb-8">
                            Create a new Finterest account today!
                        </p>
                        <div className="mb-5">
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-900 dark:text-white">
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-stone-50 border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-500 dark:placeholder-stone-400 dark:text-white focus:outline-none placeholder-stone-300 valid:[&:not(:placeholder-shown)]:border-pine-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-firecracker-500"
                                autoComplete="off"
                                required
                                pattern="[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                placeholder="user@gmail.com"
                                onChange={(e: any) => {
                                    setData({
                                        ...data,
                                        email: e.target.value
                                    });
                                    if (e.target.value.match(emailPattern) || e.target.value == '') {
                                        setEmailErrorMessage('');
                                    } else {
                                        setEmailErrorMessage('Please enter a valid email address');
                                    };
                                }}
                            />
                            <span className="mt-1 text-sm text-firecracker-500">
                                {emailErrorMessage}
                            </span>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-900 dark:text-white">
                                Your password
                            </label>
                            <div className=' flex relative'>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-stone-50 border border-stone-300 text-stone-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-500 dark:placeholder-stone-400 dark:text-white focus:outline-none placeholder-stone-300 valid:[&:not(:placeholder-shown)]:border-pine-500 invalid:[&:not(:placeholder-shown):not(:focus)]:border-firecracker-500"
                                    pattern=".{8,}"
                                    required
                                    onChange={(e: any) => {
                                        setData({
                                            ...data,
                                            password: e.target.value
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

                        <button type="submit" disabled={!canSubmit} className="mb-8 mt-2 w-full rounded-lg bg-pine-500 px-5 py-3 text-center text-sm font-medium text-white hover:bg-pine-900 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gradient-to-br disabled:from-stone-100 disabled:to-stone-300 disabled:text-stone-400 group-invalid:pointer-events-none group-invalid:bg-gradient-to-br group-invalid:from-stone-100 group-invalid:to-stone-300 group-invalid:text-stone-400 group-invalid:opacity-70">
                            Create account
                        </button>

                        <div className="text-md flex items-center justify-center text-center font-medium text-stone-500 dark:text-stone-300">
                            <NextLink
                                href="/"
                                className="flex w-32 items-center justify-between text-stone-500 hover:text-stone-800 hover:underline dark:text-stone-200 dark:hover:text-white"
                            >
                                <FiChevronLeft className="text-xl" /> Login Instead
                            </NextLink>
                        </div>
                    </form>
                    <h4 className="mt-5 text-rose-500 text-center">{errorMessage}</h4>
                </div>
            </div>
        </PageWrapper>
    );
};

export default RegistrationForm;