import NextLink from 'next/link';
import { useState } from 'react';
import { BsList, BsXLg } from 'react-icons/bs';
import chatboxStyles from '@/styles/chatbox.module.css';
import React from 'react'
import { PageWrapper } from '../PageWrapper';


/*
Landing page
*/

const Landing = () => {
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
                                <h5 className="font-dmsans text-growth-gold-900 text-lg ml-2 font-bold">Home</h5> 
                        </NextLink> 
                        {/* Pricing */}
                        <NextLink href={'/pricing'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-finterest-solid hover:text-growth-gold-900 text-lg ml-2">Pricing</h5> 
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
                <div id="body-element" className='bg-white flex-grow grid grid-rows-8 sm:grid-rows-5 lg:grid-rows-4 grid-cols-1 sm:grid-cols-6 gap-4 m-8 ml-4 mr-4 sm:ml-16 sm:mr-16 lg:ml-32 lg:mr-32'>
                    {/* Element 1 */}
                    <div className="row-start-1 col-span-1 sm:col-span-6 lg:col-span-4 bg-growth-gold-100 rounded-md sm:flex sm:justify-center sm:items-center px-5 md:px-10 xl:px-16">
                        <div className='sm:w-3/5 sm:flex sm:flex-col space-y-5 py-12'>
                            <h2 className='font-gupter font-bold text-3xl sm:text-4xl 2xl:text-5xl text-finterest-solid'>Turning Wisdom<br/>Into Wealth</h2>
                            <h5 className='text-finterest-solid'>Finterest makes gaining financial knowledge easy, with AI explanation and summarisation.</h5>
                        
                            <button className="bg-growth-gold-900 hover:bg-growth-gold-500 text-finterest-white font-bold font-dmsans py-3 px-4 w-2/3 sm:w-1/2 xl:w-2/5 rounded-full duration-300">
                            <span>Get started</span>
                            </button> 
                        
                        </div>
                        <div className="flex justify-start sm:justify-center sm:w-2/5 sm:h-full">
                            <div className="relative w-1/2 sm:w-4/5 h-full overflow-hidden flex sm:items-end">
                                <img src="/assets/news-iphone.png" alt="Finterest App" className="h-1/2 sm:h-full mb-minus-80 w-full sm:mb-minus-30 lg:mb-minus-15 xl:mb-minus-20" />
                            </div>
                        </div>
                        
                    </div>

                    {/* Element 2
                    <div className="row-start-2 lg:row-start-1 col-span-1 sm:col-span-3 lg:col-span-2 bg-steady-sapphire-100 rounded-md flex flex-col justify-center items-center">
                        <img src="/assets/habit-grow.png" alt="Watch your reading habit grow." className="h-1/3 lg:w-1/2 lg:h-1/3"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5'>Build a reading habit.<br/>Watch it evolve.</h2>
                    </div> */}

                    {/* Element 2 */}
                    <div className="row-start-2 lg:row-start-1 col-span-1 sm:col-span-3 lg:col-span-2 bg-steady-sapphire-100 rounded-md flex flex-col justify-center items-center">
                        <img src="/assets/habit-grow.png" alt="Watch your reading habit grow." className="h-1/2 w-2/5 lg:w-1/2 lg:h-1/3"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Build a reading habit.<br/>Watch it evolve.</h2>
                    </div>

                    {/* Element 3 */}
                    <div className="row-start-3 sm:row-start-2 col-span-1 sm:col-span-3 lg:col-span-2 bg-stone-200 rounded-md flex flex-col justify-center items-center px-4  py-4">
                        <img src="/assets/complex-ideas.png" alt="Search up a term and get Finterest AI to explain it" className="h-3/5 sm:w-2/3 sm:h-2/5 lg:w-4/5 lg:h-2/3 xl:w-3/4 xl:h-1/2"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Decode complex ideas</h2>
                        <h5 className='text-finterest-solid text-center mt-5 text-sm xl:text-base'>See a financial term you don't understand? AI-powered definitions to the rescue!</h5>
                        
                    </div>

                    {/* Element 4 */}
                    <div className="row-start-4 sm:row-start-3 lg:row-start-2 col-span-1 sm:col-span-3 lg:col-span-2 bg-prosperity-pine-100 rounded-md flex flex-col justify-center items-center px-4 py-4">
                        <img src="/assets/scroll-for-gold.png" alt="Scroll through insightful financial news articles" className="w-2/3 h-3/5 sm:h-1/2 lg:w-2/3 lg:h-2/3 xl:w-3/4 xl:h-1/2"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Scroll for gold</h2>
                        <h5 className='text-finterest-solid text-center mt-5 text-sm xl:text-base'>Say goodbye to mindless scrolling on social media. Finterest delivers instant summaries of key insights.</h5>
                        
                    </div>
                    

                    {/* Element 5 */}
                    <div className="row-start-5 sm:row-start-3 lg:row-start-2 col-span-1 sm:col-span-3 lg:col-span-2 bg-rising-rose-100 rounded-md flex flex-col justify-center items-center px-4 py-4">
                        <img src="/assets/chat.png" alt="Chat about articles with Finterest AI" className="w-2/3 h-3/5 sm:h-1/2 lg:w-2/3 lg:h-1/3 xl:w-3/4 xl:h-1/2"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Chat about articles</h2>
                        <h5 className='text-finterest-solid text-center mt-5 text-sm xl:text-base'>Go into deeper details for each article with AI-powered insights at your fingertips.</h5>
                        
                    </div>

                    {/* Element 6 */}
                    <div className="row-start-6 sm:row-start-4 lg:row-start-3 col-span-1 sm:col-span-3 bg-finance-firecracker-100 rounded-md flex flex-col justify-center items-center px-4 py-5">
                        <img src="/assets/personalised-list.png" alt="Finterest recommends articles according to your preferences" className="w-2/3 h-1/2 lg:w-1/2 lg:h-1/2 xl:w-1/2 xl:h-1/2"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Articles the way 
                        <span style={{
                            backgroundImage: `url('/assets/red-underline.png')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            height: '10px',
                            display: 'inline-block',
                            position: 'relative',
                            paddingLeft: '4px', 
                            paddingRight: '4px',
                            lineHeight: '0',
                          
                        }}>
                        you   
                        </span>want.</h2>
                        <h5 className='text-finterest-solid text-center mt-5 text-sm xl:text-base'>Finterest remembers your preferences and goals, and provides articles and explanations that suit you.</h5>
                        
                    </div>

                    {/* Element 7 */}
                    <div className="row-start-7 sm:row-start-4 lg:row-start-3 col-span-1 sm:col-span-3 bg-steady-sapphire-100 rounded-md flex flex-col justify-center items-center px-4 py-5">
                        <img src="/assets/trusted-by.png" alt="Finterest is trusted by many people around the world" className="w-4/5 h-1/2 lg:w-2/3 lg:h-1/2 xl:w-1/2 xl:h-1/2"/>
                            <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Trusted by 
                            <span className="relative"> many.
                                <span
                                className="absolute top-0 left-0 transform -translate-x-2 -translate-y-1 xl:translate-x-1/6 xl:-translate-y-0  w-24 h-12"
                                style={{ backgroundImage: `url('/assets/purple-circle.png')`, backgroundSize: 'cover' }}
                                ></span>
                            </span>
                            </h2>
                            <h5 className='text-finterest-solid text-center mt-5 text-sm xl:text-base'>Finterest is used by many around the world, providing easy-to-understand articles.</h5>
                    
                    </div>

                    {/* Element 8 */}
                    <div className="py-10 row-start-8 sm:row-start-5 lg:row-start-4 col-span-1 sm:col-span-6 bg-growth-gold-100 rounded-md flex flex-col justify-center items-center px-4 sm:px-0">
                       <div>
                            <h2 className="font-gupter text-finterest-solid font-bold text-3xl lg:text-4xl text-center 2xl:text-6xl">Create your account today and get<br/>started
                                <span> </span>
                                <span className='' style={{
                                backgroundImage: `url('/assets/gold-underline.png')`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                height: '30px',
                                display: 'inline-block',
                                position: 'relative',
                                paddingLeft: '0px', 
                                paddingRight: '4px',
                                lineHeight: '0',
                                }}> for free!  
                                </span></h2>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-center items-center mt-8 space-y-5 sm:space-y-0 sm:space-x-5'>
                            <NextLink href={'/'}>
                                <button className="bg-growth-gold-900 hover:bg-growth-gold-500 text-finterest-white font-bold font-dmsans py-4 px-6 rounded-full flex items-center duration-300">
                                    <span>Get started</span>
                                </button>
                            </NextLink>
                            <div className="relative">
                                <NextLink href={'/pricing'}>
                                <button className="bg-finterest-white hover:bg-growth-gold-900 text-finterest-solid hover:text-finterest-white border-2 border-gray-300 hover:border-growth-gold-900 font-dmsans py-4 px-6 rounded-full flex items-center duration-300">
                                    <span>Pricing (psst, it's free!)</span>
                                </button>
                                </NextLink>
                                {/* Image positioned relative to the second button */}
                                <img src="/assets/gold-exclamation.png" alt="Exclamation mark" className="absolute top-0 right-0 transform translate-x-12 md:translate-x-16 translate-y-[-50%] w-12 h-16 mt-4" />
                            </div>
                       </div>
                       {/* <div className='self-start ml-64'>
                        <img src="/assets/gold-arrow.png" alt="Exclamation mark" className="h-3/4 w-4/5" />      
                       </div> */}
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
                            <h6 className="font-dmsans text-stone-500">An AI-enabled financial news application</h6>
                        </div>
                    </div>
                    <div className='self-end flex w-1/3 flex-grow-1 justify-end pr-16 sm:pr-36 overflow-hidden'>
                    <img src="/assets/green-arrow.png" alt="Green Arrow" className="lg:w-1/3 lg:h-1/3 sm:mb-minus-2"/>
                    </div>
                </div>

               
                



              
            </div>
        </PageWrapper>
    );
};

export default Landing;