import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import React, { useEffect } from 'react'
import { PageWrapper } from '../PageWrapper';
import { BsGoogle, BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";


/*
A login form component that consists of the login options available
for the user.
Adapted from https://github.com/realstoman/nextjs-firebase-auth/tree/main
*/

const Landing = () => {
    

    return (
        <PageWrapper>
            <div className="flex flex-col justify-between h-screen w-full overflow-y-auto">
                {/* Header */}
                <div className='bg-white flex flex-col justify-center items-center p-2 pb-8'>
                    <div className="flex justify-center items-center">
                        {/* Image */}
                        <img src="/assets/finterest-logo-black.png" alt="Finterest Logo" className="w-10 h-16 m-4" />
                        {/* Title */}
                        <h2 className="font-gupter text-finterest-solid font-bold text-5xl ml-2">Finterest</h2>
                    </div>
                    <div className='flex justify-center space-x-12'>
                        {/* Home */}
                        <NextLink href={'/'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-finterest-solid text-lg ml-2 font-bold">Home</h5> 
                        </NextLink> 
                        {/* Pricing */}
                        <NextLink href={'/'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-finterest-solid text-lg ml-2">Pricing</h5> 
                        </NextLink> 
                        {/* Login */}
                        <button className="bg-finterest-white hover:bg-finterest-solid text-finterest-solid hover:text-finterest-white border-2 border-gray-300 hover:border-finterest-solid font-dmsans py-3 px-6 rounded-full flex items-center duration-300">
                            <span>Login</span>
                        </button>
                        {/* Login */}
                        <button className="bg-finterest-solid hover:bg-slate-200 text-finterest-white hover:text-finterest-solid font-bold font-dmsans py-3 px-6 rounded-full flex items-center duration-300">
                            <span>Get started</span>
                        </button> 

                    </div>
                </div>
                {/* Body */}
                <div className='bg-stone-100 flex-grow grid grid-rows-4 grid-cols-6 gap-4 m-8 ml-32 mr-32'>
                    {/* Element 1 */}
                    <div className="row-start-1 col-span-4 bg-growth-gold-100 rounded-md flex justify-center items-center px-16">
                        <div className='w-3/5 flex flex-col space-y-5 py-12'>
                            <h2 className='font-gupter font-bold text-4xl text-finterest-solid'>Turning Wisdom<br/>Into Wealth</h2>
                            <h5 className='text-finterest-solid'>Finterest makes gaining financial knowledge easy, with AI explanation and summarisation.</h5>
                        
                            <button className="bg-growth-gold-900 hover:bg-growth-gold-500 text-finterest-white font-bold font-dmsans py-3 px-4 w-2/5 rounded-full duration-300">
                            <span>Get started</span>
                            </button> 
                        
                        </div>
                        <div className="flex justify-center w-2/5 h-full">
                            <div className="relative w-4/5 h-full overflow-hidden flex items-end">
                                <img src="/assets/news-iphone.png" alt="Finterest App" className="w-full" style={{ marginBottom: '-20%' }} />
                            </div>
                        </div>
                        
                    </div>

                    {/* Element 2 */}
                    <div className="row-start-1 col-span-2 bg-steady-sapphire-100 rounded-md h-full flex flex-col justify-center items-center">
                        <img src="/assets/habit-grow.png" alt="Watch your reading habit grow." className="w-1/2 h-1/2"/>
                        <h2 className='font-gupter font-bold text-3xl text-finterest-solid text-center mt-5'>Build a reading habit.<br/>Watch it evolve.</h2>
                    </div>


                    {/* Element 3 */}
                    <div className="row-start-2 col-span-2 bg-stone-200 rounded-md flex flex-col justify-center items-center px-4 py-4">
                        <img src="/assets/complex-ideas.png" alt="Search up a term and get Finterest AI to explain it" className="w-3/4 h-1/2"/>
                        <h2 className='font-gupter font-bold text-3xl text-finterest-solid text-center mt-5'>Decode complex ideas</h2>
                        <h5 className='text-finterest-solid text-center mt-5'>See a financial term you don't understand? AI-powered definitions to the rescue!</h5>
                        
                    </div>

                    {/* Element 4 */}
                    <div className="row-start-2 col-span-2 bg-prosperity-pine-100 rounded-md flex flex-col justify-center items-center px-4 py-4">
                        <img src="/assets/scroll-for-gold.png" alt="Scroll through insightful financial news articles" className="w-3/4 h-1/2"/>
                        <h2 className='font-gupter font-bold text-3xl text-finterest-solid text-center mt-5'>Scroll for gold</h2>
                        <h5 className='text-finterest-solid text-center mt-5'>Say goodbye to mindless scrolling on social media. Finterest delivers instant summaries of key insights.</h5>
                        
                    </div>

                    {/* Element 5 */}
                    <div className="row-start-2 col-span-2 bg-rising-rose-100 rounded-md flex flex-col justify-content items-center px-4 py-4">
                        <img src="/assets/chat.png" alt="Chat about articles with Finterest AI" className="w-3/4 h-1/2"/>
                        <h2 className='font-gupter font-bold text-3xl text-finterest-solid text-center mt-5'>Chat about articles</h2>
                        <h5 className='text-finterest-solid text-center mt-5'>Go into deeper details for each article with AI-powered insights at your fingertips.</h5>
                        
                    </div>

                    {/* Element 6 */}
                    <div className="row-start-3 col-span-3 bg-finance-firecracker-100 rounded-md flex flex-col justify-center items-center px-4 py-5">
                        <img src="/assets/personalised-list.png" alt="Finterest recommends articles according to your preferences" className="w-1/2 h-1/2"/>
                        <h2 className='font-gupter font-bold text-3xl text-finterest-solid text-center mt-5'>Articles the way 
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
                        <h5 className='text-finterest-solid text-center mt-5'>Finterest remembers your preferences and goals, and provides articles and explanations that suit you.</h5>
                        
                    </div>

                    {/* Element 7 */}
                    <div className="row-start-3 col-span-3 bg-steady-sapphire-100 rounded-md flex flex-col justify-center items-center px-4 py-5">
                        <img src="/assets/trusted-by.png" alt="Finterest is trusted by many people around the world" className="w-3/4 h-1/2"/>
                            <h2 className='font-gupter font-bold text-3xl text-finterest-solid text-center mt-5'>Trusted by 
                            <span className="relative"> many.
                                <span
                                className="absolute top-0 left-0 transform translate-x-1/6  w-24 h-12"
                                style={{ backgroundImage: `url('/assets/purple-circle.png')`, backgroundSize: 'cover' }}
                                ></span>
                            </span>
                            </h2>
                            <h5 className='text-finterest-solid text-center mt-5'>Trusted by many.</h5>
                    
                    </div>



                    {/* Element 8 */}
                    <div className="row-start-4 col-span-6 bg-growth-gold-100 rounded-md flex flex-col justify-center items-center">
                       <div>
                            <h2 className="font-gupter text-finterest-solid font-bold text-4xl ml-2 text-center">Create your account today and get<br/>started
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
                        <div className='flex justify-center items-center mt-8 space-x-5'>
                            <button className="bg-growth-gold-900 hover:bg-growth-gold-500 text-finterest-white font-bold font-dmsans py-4 px-6 rounded-full flex items-center duration-300">
                                <span>Get started</span>
                            </button>
                            <div className="relative">
                                <button className="bg-finterest-white hover:bg-growth-gold-900 text-finterest-solid hover:text-finterest-white border-2 border-gray-300 hover:border-growth-gold-900 font-dmsans py-4 px-6 rounded-full flex items-center duration-300">
                                    <span>Pricing (psst, it's free!)</span>
                                </button>
                                {/* Image positioned relative to the second button */}
                                <img src="/assets/gold-exclamation.png" alt="Exclamation mark" className="absolute top-0 right-0 transform translate-x-16 translate-y-[-50%] w-12 h-16 mt-4" />
                            </div>
                       </div>
                       {/* <div className='self-start ml-64'>
                        <img src="/assets/gold-arrow.png" alt="Exclamation mark" className="h-3/4 w-4/5" />      
                       </div> */}
                    </div>

                

                </div>
                {/* Footer */}
                <div className='bg-orange-200 flex justify-between'>
                    <div className='h-48'>Footer Left</div>
                    <div>Footer Right</div>
                </div>

            </div>
        </PageWrapper>
    );
};

export default Landing;