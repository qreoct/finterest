import NextLink from 'next/link';
import RegistrationForm from '@/components/RegistrationForm';
import Head from 'next/head';
import { useState } from 'react';
import chatboxStyles from '@/styles/chatbox.module.css';
import { PageWrapper } from '@/components/PageWrapper';
import { BsList, BsXLg } from 'react-icons/bs';

const register = () => {
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
                <title>Finterest - Register</title>
                <meta
                    name="Register with Finterest"
                    content="Register an account with Finterest"
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
                    <div className="flex flex-col justify-between h-screen w-full overflow-y-auto overflow-x-hidden">
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
                                        <h5 className="font-dmsans text-finterest-solid hover:text-gold-900 text-xl ml-2">Home</h5> 
                                </NextLink> 
                                {/* Pricing */}
                                <NextLink href={'/pricing'} className="flex justify-center items-center">
                                        <h5 className="font-dmsans text-finterest-solid hover:text-gold-900  text-xl ml-2">Pricing</h5> 
                                </NextLink> 
                                {/* Login */}
                                <NextLink href={'/login'}>
                                    <h5 className="font-dmsans text-finterest-solid hover:text-gold-900  text-xl ml-2">Login</h5> 
                                </NextLink>
                                {/* Get Started */}
                                <NextLink href={'/register'}>
                                    <h5 className="font-dmsans text-gold-900 font-bold text-xl ml-2">Register</h5> 
                                </NextLink>
                            </div>
                        </div>


                        {/* Header */}
                        <div id="header-element" className='bg-white flex flex-row sm:flex-col justify-between sm:justify-center items-center py-4 px-6 sm:p-2 sm:pb-8'>
                            <div className="flex justify-center items-center">
                                {/* Image */}
                                <NextLink href='/'>
                                    <img src="/assets/finterest-logo-black.png" alt="Finterest Logo" className="w-8 h-12 xl:w-10 xl:h-16 m-4" />
                                </NextLink>
                                {/* Title */}
                                <NextLink href='/'>
                                    <h2 className="font-gupter text-finterest-solid font-bold text-3xl sm:text-4xl xl:text-5xl ml-2">Finterest</h2>
                                </NextLink>
                            </div>
                            <div className='hidden sm:flex sm:justify-center sm:space-x-12'>
                                {/* Home */}
                                <NextLink href={'/'} className="flex justify-center items-center">
                                        <h5 className="font-dmsans  text-finterest-solid hover:text-gold-900 text-lg ml-2">Home</h5> 
                                </NextLink> 
                                {/* Pricing */}
                                <NextLink href={'/pricing'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-finterest-solid hover:text-gold-900 text-lg ml-2">Pricing</h5> 
                                </NextLink> 
                                {/* Login */}
                                <NextLink href='/login'>
                                    <button className="bg-finterest-white hover:bg-finterest-solid text-finterest-solid hover:text-finterest-white border-2 border-gray-300 hover:border-finterest-solid font-dmsans py-3 px-6 rounded-full flex items-center duration-300">
                                        <span>Login</span>
                                    </button>
                                </NextLink>
                                {/* Get Started */}
                                <NextLink href={'/register'} className="flex justify-center items-center">
                                        <h5 className="font-dmsans text-gold-900 text-lg ml-2 font-bold">Get started</h5> 
                                </NextLink> 
                            </div>
                            <div className="sm:hidden">
                                <button onClick={handleHamburgerMenuOnClick}>
                                    <BsList className='text-4xl cursor-pointer text-finterest-solid' />
                                </button>
                            </div>
                            


                        </div>

                        {/* Body */}
                        <div id="body-element" className='-mt-0 sm:-mt-10 flex justify-center'>
                            <div>
                            <RegistrationForm />
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

export default register;