import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BsList, BsXLg } from 'react-icons/bs';
import chatboxStyles from '@/styles/chatbox.module.css';
import React, { useEffect } from 'react'
import { PageWrapper } from '@/components/PageWrapper';
import Head from 'next/head';


/*
Pricing page
*/

const Pricing = () => {
    const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);


    //Function that handles toggling of hamburger menu
    const handleHamburgerMenuOnClick = async () => {
        if (isHamburgerMenuOpen) {
            //Menu is open. Need to close it.
            const hamburgerMenuItem = document.getElementById('hamburger-menu-element');
            const headerItem = document.getElementById('header-element');
            const bodyItem = document.getElementById('body-element');
            const footerItem = document.getElementById('footer-element');


            //Make menu disappear
            hamburgerMenuItem?.classList.remove(chatboxStyles['animateshow']);
            hamburgerMenuItem?.classList.remove('flex');
            hamburgerMenuItem?.classList.add('hidden');


            //Make menu appear
            headerItem?.classList.add('flex');
            headerItem?.classList.remove('hidden');
            headerItem?.classList.add(chatboxStyles['hiddenelement']);
            bodyItem?.classList.add('flex');
            bodyItem?.classList.remove('hidden');
            bodyItem?.classList.add(chatboxStyles['hiddenelement']);
            footerItem?.classList.add('flex');
            footerItem?.classList.remove('hidden');
            footerItem?.classList.add(chatboxStyles['hiddenelement']);
            
            setTimeout(function () {
                headerItem?.classList.add(chatboxStyles['animateshow']);
                headerItem?.classList.remove(chatboxStyles['hiddenelement']);
                bodyItem?.classList.add(chatboxStyles['animateshow']);
                bodyItem?.classList.remove(chatboxStyles['hiddenelement']);
                footerItem?.classList.add(chatboxStyles['animateshow']);
                footerItem?.classList.remove(chatboxStyles['hiddenelement']);
            }, 40);




                //Update state and cause page to re-render
                setIsHamburgerMenuOpen(false);
            
        

    


        } else {
            //Menu is closed. Need to open it.
            const hamburgerMenuItem = document.getElementById('hamburger-menu-element');
            const headerItem = document.getElementById('header-element');
            const bodyItem = document.getElementById('body-element');
            const footerItem = document.getElementById('footer-element');


            //Make menu appear
            hamburgerMenuItem?.classList.add('flex');
            hamburgerMenuItem?.classList.remove('hidden');
            hamburgerMenuItem?.classList.add(chatboxStyles['hiddenelement']);
            headerItem?.classList.remove(chatboxStyles['animateshow']);
            bodyItem?.classList.remove(chatboxStyles['animateshow']);
            footerItem?.classList.remove(chatboxStyles['animateshow']);



            setTimeout(function () {
                hamburgerMenuItem?.classList.add(chatboxStyles['animateshow']);
                hamburgerMenuItem?.classList.remove(chatboxStyles['hiddenelement']);

            }, 40);

            //Make the rest of the content disappear
            headerItem?.classList.remove('flex');
            headerItem?.classList.add('hidden');

            bodyItem?.classList.remove('flex');
            bodyItem?.classList.add('hidden');

            footerItem?.classList.remove('flex');
            footerItem?.classList.add('hidden');

            //Update state and cause page to re-render
            setIsHamburgerMenuOpen(true);

        }
        
    }


    
    return (
        <>
            <Head>
                <title>Finterest - Pricing </title>
                <meta
                    name="description"
                    content="Turning Wisdom Into Wealth"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Gupter:wght@400;500;700&display=swap"/>
            </Head>
            <main>
                <PageWrapper>
                    <div className="flex flex-col justify-between h-screen w-full overflow-y-auto">
                        {/* Hamburger menu */}
                        <div id="hamburger-menu-element" className="bg-stone-100 h-screen flex-col py-10 px-10 duration-300 hidden">
                            <div className='self-end'>
                                <button onClick={ handleHamburgerMenuOnClick }>
                                    <BsXLg className='text-4xl cursor-pointer text-finterest-solid' />
                                </button>
                            </div>

                            <div className='flex flex-col self-center flex-grow justify-center items-center space-y-16'>
                                {/* Home */}
                                <NextLink href={'/'} className="flex justify-center items-center">
                                        <h5 className="font-dmsans text-growth-gold-900 text-xl ml-2 font-bold">Home</h5> 
                                </NextLink> 
                                {/* Pricing */}
                                <NextLink href={'/pricing'} className="flex justify-center items-center">
                                        <h5 className="font-dmsans text-finterest-solid hover:text-growth-gold-900 text-xl ml-2">Pricing</h5> 
                                </NextLink> 
                                {/* Login */}
                                <NextLink href={'/login'}>
                                    <h5 className="font-dmsans text-finterest-solid hover:text-growth-gold-900 text-xl ml-2">Login</h5> 
                                </NextLink>
                                {/* Get Started */}
                                <NextLink href={'/register'}>
                                    <h5 className="font-dmsans text-finterest-solid hover:text-growth-gold-900 text-xl ml-2">Register</h5> 
                                </NextLink>

                            </div>
                        </div>


                        {/* Header */}
                        <div id="header-element" className='bg-white flex flex-row sm:flex-col justify-between sm:justify-center items-center py-4 px-6 sm:p-2 sm:pb-8'>
                            <div className="flex justify-center items-center">
                                {/* Image */}
                                <img src="/assets/finterest-logo-black.png" alt="Finterest Logo" className="w-8 h-12 xl:w-10 xl:h-16 m-4" />
                                {/* Title */}
                                <h2 className="font-gupter text-finterest-solid font-bold text-3xl sm:text-4xl xl:text-5xl ml-2">Finterest</h2>
                            </div>
                            <div className='hidden sm:flex sm:justify-center sm:space-x-12'>
                                {/* Home */}
                                <NextLink href={'/'} className="flex justify-center items-center">
                                        <h5 className="font-dmsans  text-finterest-solid hover:text-growth-gold-900 text-lg ml-2">Home</h5> 
                                </NextLink> 
                                {/* Pricing */}
                                <NextLink href={'/pricing'} className="flex justify-center items-center">
                                        <h5 className="font-dmsans text-growth-gold-900 text-lg ml-2 font-bold">Pricing</h5> 
                                </NextLink> 
                                {/* Login */}
                                <NextLink href='/login'>
                                    <button className="bg-finterest-white hover:bg-finterest-solid text-finterest-solid hover:text-finterest-white border-2 border-gray-300 hover:border-finterest-solid font-dmsans py-3 px-6 rounded-full flex items-center duration-300">
                                        <span>Login</span>
                                    </button>
                                </NextLink>

                                {/* Get Started */}
                                <button className="bg-finterest-solid hover:bg-slate-200 text-finterest-white hover:text-finterest-solid font-bold font-dmsans py-3 px-6 rounded-full flex items-center duration-300">
                                    <span>Get started</span>
                                </button> 

                            </div>
                            <div className="sm:hidden">
                                <button onClick={handleHamburgerMenuOnClick}>
                                    <BsList className='text-4xl cursor-pointer text-finterest-solid' />
                                </button>
                            </div>
                            


                        </div>

                        {/* Body */}
                        <div id="body-element" className='bg-white flex flex-col justify-center items-center space-y-5 px-12 md:px-16 lg:px-20'>
                            <h6 className='font-dmsans uppercase text-xl text-gray-400 bold'>Pricing</h6>
                            <h3 className='font-dmsans text-4xl sm:text-5xl font-bold text-center'>Affordable Pricing Plans</h3>
                            <p className='font-dmsans text-gray-400 text-center'>Discover our range of affordable pricing plans, where there's a perfect option for everyone.</p>

                            {/* Pricing Information */}
                            <div className='flex flex-col md:flex-row justify-content items-center space-y-8 w-full sm:w-auto md:space-y-auto md:space-x-8 lg:space-x-16'>
                                {/* Basic plan */}
                                <div className='border-2 border-growth-gold-500 flex flex-col rounded-lg md:w-2/5 sm:p-4 md:p-8'>
                                    <div className='flex justify-between items-center mx-5 my-3'>
                                        <img src="/assets/basic-plan.png" alt="Logo for Finterest Basic Plan" className="w-8 h-12 xl:w-10 xl:h-16 m-4" />
                                        <div className='border-2 border-growth-gold-500 font-bold rounded-full w-2/5 xl:w-1/5 text-dmsans text-center py-2 px-5'>Free</div>
                                    </div>

                                    <h4 className='font-dmsans text-3xl sm:text-4xl font-bold mx-5 my-3'>Basic Plan</h4>
                                    <p className='font-dmsans text-gray-400 mx-5'>Perfect for beginners who want to get a taste of AI-powered financial articles.</p>
                                    <ul className='font-dmsans text-finterest-solid mx-5 my-3 font-bold space-y-4 mt-5'>
                                        <li className="mb-2 pl-6 relative">
                                            <div className="absolute left-0 w-6 h-6">
                                                <img src="/assets/check-circle-gold.png" alt="Bullet Point" className="w-full h-full" />
                                            </div>
                                            <span className='ml-2'>Feature 1</span>
                                        </li>
                                        <li className="mb-2 pl-6 relative">
                                            <div className="absolute left-0 w-6 h-6">
                                                <img src="/assets/check-circle-gold.png" alt="Bullet Point" className="w-full h-full" />
                                            </div>
                                            <span className='ml-2'>Feature 2</span>
                                        </li>
                                        <li className="mb-2 pl-6 relative">
                                            <div className="absolute left-0 w-6 h-6">
                                                <img src="/assets/check-circle-gold.png" alt="Bullet Point" className="w-full h-full" />
                                            </div>
                                            <span className='ml-2'>Feature 3</span>
                                        </li>
                                        <li className="mb-2 pl-6 relative">
                                            <div className="absolute left-0 w-6 h-6">
                                                <img src="/assets/check-circle-gold.png" alt="Bullet Point" className="w-full h-full" />
                                            </div>
                                            <span className='ml-2'>Feature 4</span>
                                        </li>



                                        
                                    </ul>
                                    <NextLink href={'/'} className='mx-5 my-3'>
                                        <button className="bg-growth-gold-500 hover:bg-growth-gold-900 text-finterest-white hover:text-finterest-white font-dmsans font-bold py-4 px-6 rounded-full flex items-center duration-300 mt-5">
                                            <span>Get started</span>
                                        </button>
                                    </NextLink>
                                </div>

                                {/* Finterest Plus */}
                                <div className='bg-gradient-to-br from-custom-gold-top to-custom-gold-bottom flex flex-col rounded-lg w-full sm:w-auto md:w-3/5 p-4 sm:p-8 md:p-12 xl:p-16'>
                                    <div className='flex justify-between items-center mx-5 my-3'>
                                            <img src="/assets/finterest-plus.png" alt="Logo for Finterest PLUS Plan" className="w-20 h-20 m-4" />
                                            <div className='bg-white rounded-full w-1/2 lg:w-1/3 xl:w-1/5 text-dmsans text-center py-4 px-5 text-black font-bold'>$399/mo</div>
                                    </div>

                                    <h4 className='font-dmsans text-4xl font-bold mx-5 my-3 text-white'>Finterest PLUS</h4>
                                    <p className='font-dmsans text-white mx-5'>Want more AI insights into the world? This plan would be the right for you.</p>
                                    <div className='flex flex-col md:flex-row justify-start items-start md:items-center mx-5 my-3 mt-5 space-y-4 md:space-y-auto md:space-x-16'>
                                        <ul className='font-dmsans text-white font-bold space-y-3 md:w-1/2'>
                                            <li className="mb-2 pl-6 relative ">
                                                <div className="absolute left-0 w-6 h-6">
                                                    <img src="/assets/check-circle-white.png" alt="Bullet Point" className="w-full h-full" />
                                                </div>
                                                <span className='ml-2'>Everything on Basic Plan</span>
                                            </li>
                                            <li className="mb-2 pl-6 relative">
                                                <div className="absolute left-0 w-6 h-6">
                                                    <img src="/assets/check-circle-white.png" alt="Bullet Point" className="w-full h-full" />
                                                </div>
                                                <span className='ml-2'>Feature 2</span>
                                            </li>
                                            <li className="mb-2 pl-6 relative">
                                                <div className="absolute left-0 w-6 h-6">
                                                    <img src="/assets/check-circle-white.png" alt="Bullet Point" className="w-full h-full" />
                                                </div>
                                                <span className='ml-2'>Feature 3</span>
                                            </li>
                                            <li className="mb-2 pl-6 relative">
                                                <div className="absolute left-0 w-6 h-6">
                                                    <img src="/assets/check-circle-white.png" alt="Bullet Point" className="w-full h-full" />
                                                </div>
                                                <span className='ml-2'>Feature 4</span>
                                            </li>
                                        </ul>

                                        <ul className='font-dmsans text-white font-bold space-y-3 md:w-1/2'>
                                            <li className="mb-2 pl-6 relative ">
                                                <div className="absolute left-0 w-6 h-6">
                                                    <img src="/assets/check-circle-white.png" alt="Bullet Point" className="w-full h-full" />
                                                </div>
                                                <span className='ml-2'>Everything on Basic Plan</span>
                                            </li>
                                            <li className="mb-2 pl-6 relative">
                                                <div className="absolute left-0 w-6 h-6">
                                                    <img src="/assets/check-circle-white.png" alt="Bullet Point" className="w-full h-full" />
                                                </div>
                                                <span className='ml-2'>Feature 2</span>
                                            </li>
                                            <li className="mb-2 pl-6 relative">
                                                <div className="absolute left-0 w-6 h-6">
                                                    <img src="/assets/check-circle-white.png" alt="Bullet Point" className="w-full h-full" />
                                                </div>
                                                <span className='ml-2'>Feature 3</span>
                                            </li>
                                            <li className="mb-2 pl-6 relative">
                                                <div className="absolute left-0 w-6 h-6">
                                                    <img src="/assets/check-circle-white.png" alt="Bullet Point" className="w-full h-full" />
                                                </div>
                                                <span className='ml-2'>Feature 4</span>
                                            </li>
                                        </ul>



                                    </div>
                                    <NextLink href={'/'} className='mx-5 my-3'>
                                        <button className="bg-white hover:bg-growth-gold-900 text-finterest-black hover:text-finterest-white text-bold font-dmsans font-bold py-4 px-6 rounded-full flex items-center duration-300 mt-5">
                                            <span>Purchase</span>
                                        </button>
                                    </NextLink>
                                </div>

                            </div>




                        </div>

                       {/* Footer */}
                        <div id="footer-element"className='bg-white flex justify-between'>
                            <div className='flex w-2/3 flex-col items-start'>
                                <div className="flex justify-center items-center ml-8 mt-4">
                                    {/* Image */}
                                    <img src="/assets/finterest-logo-black.png" alt="Finterest Logo" className="w-5 h-8 m-4" />
                                    {/* Title */}
                                    <h2 className="font-gupter text-finterest-solid font-bold text-2xl ml-2">Finterest</h2>
                                </div>
                                <div className='ml-8 mb-8 mt-2'>
                                    <h6 className="text-sm sm:text-base font-dmsans text-stone-500">An AI-enabled financial news app</h6>
                                </div>
                            </div>
                            <div className='self-end flex w-1/3 flex-grow-1 justify-end pr-16 sm:pr-36 overflow-hidden'>
                            <img src="/assets/green-arrow.png" alt="Green Arrow" className="lg:w-1/3 lg:h-1/3 sm:mb-minus-2"/>
                            </div>
                        </div>


                    
                        



                    
                    </div>
                </PageWrapper>
            </main>
        </>
    );
};

export default Pricing;