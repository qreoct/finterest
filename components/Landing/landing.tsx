import NextLink from 'next/link';
import React from 'react'
import { PageWrapper } from '../PageWrapper';
import Header from './header';
import Footer from './footer';

/*
Landing page
*/

const Landing = () => {

    return (
        <PageWrapper>
            <div className="flex flex-col justify-between h-screen w-full overflow-y-auto">
                {/* Header */}
                <Header tabIndex={0} />

                {/* Body */}
                <div id="body-element" className='bg-white flex-grow grid grid-rows-8 sm:grid-rows-5 lg:grid-rows-4 grid-cols-1 sm:grid-cols-6 gap-4 m-8 ml-4 mr-4 sm:ml-16 sm:mr-16 lg:ml-32 lg:mr-32'>
                    {/* Element 1 */}
                    <div className="row-start-1 col-span-1 sm:col-span-6 lg:col-span-4 bg-gold-100 rounded-md sm:flex sm:justify-center sm:items-center px-5 md:px-10 xl:px-16">
                        <div className='sm:w-3/5 sm:flex sm:flex-col space-y-5 py-12'>
                            <h2 className='font-gupter font-bold text-3xl sm:text-4xl 2xl:text-5xl text-finterest-solid'>Turning Wisdom<br/>Into Wealth</h2>
                            <h5 className='text-finterest-solid'>Finterest makes gaining financial knowledge easy, with AI explanation and summarisation.</h5>
                        
                            <NextLink href='/register'>
                                <button className="bg-gold-900 hover:bg-gold-500 text-finterest-white font-bold font-dmsans py-3 px-4 w-3/5 mt-5 sm:mt-0 sm:w-1/2 xl:w-2/5 rounded-full duration-300">
                                    <span>Get started</span>
                                </button>
                            </NextLink> 
                        
                        </div>
                        <div className="flex justify-start sm:justify-center sm:w-2/5 sm:h-full">
                            <div className="relative w-1/2 sm:w-4/5 h-full overflow-hidden flex sm:items-end">
                                <img src="/assets/news-iphone-svg.svg" alt="Finterest App" className="h-3/5 sm:h-full mb-minus-80 w-full sm:mb-minus-30 lg:mb-minus-15 xl:mb-minus-20" />
                            </div>
                        </div>
                        
                    </div>

                    {/* Element 2 */}
                    <div className="row-start-2 lg:row-start-1 col-span-1 sm:col-span-3 lg:col-span-2 bg-sapphire-100 rounded-md flex flex-col justify-center items-center">
                        <img src="/assets/habit-grow-svg.svg" alt="Watch your reading habit grow." className="h-1/2 w-2/5 lg:w-1/2 lg:h-1/3"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Build a reading habit.<br/>Watch it evolve.</h2>
                    </div>

                    {/* Element 3 */}
                    <div className="row-start-3 sm:row-start-2 col-span-1 sm:col-span-3 lg:col-span-2 bg-stone-200 rounded-md flex flex-col justify-center items-center px-4  py-4">
                        <img src="/assets/complex-ideas-svg.svg" alt="Search up a term and get Finterest AI to explain it" className="h-3/5 sm:w-2/3 sm:h-2/5 lg:w-4/5 lg:h-2/3 xl:w-3/4 xl:h-1/2"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Decode complex ideas</h2>
                        <h5 className='text-finterest-solid text-center mt-5 text-sm xl:text-base'>See a financial term you don&apos;t understand? AI-powered definitions to the rescue!</h5>
                        
                    </div>

                    {/* Element 4 */}
                    <div className="row-start-4 sm:row-start-3 lg:row-start-2 col-span-1 sm:col-span-3 lg:col-span-2 bg-pine-100 rounded-md flex flex-col justify-center items-center px-4 py-4">
                        <img src="/assets/scroll-for-gold-svg.svg" alt="Scroll through insightful financial news articles" className="w-2/3 h-3/5 sm:h-1/2 lg:w-2/3 lg:h-2/3 xl:w-3/4 xl:h-1/2"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Scroll for gold</h2>
                        <h5 className='text-finterest-solid text-center mt-5 text-sm xl:text-base'>Say goodbye to mindless scrolling on social media. Finterest delivers instant summaries of key insights.</h5>
                        
                    </div>
                    

                    {/* Element 5 */}
                    <div className="row-start-5 sm:row-start-3 lg:row-start-2 col-span-1 sm:col-span-3 lg:col-span-2 bg-rose-100 rounded-md flex flex-col justify-center items-center px-4 py-4">
                        <img src="/assets/chat-svg.svg" alt="Chat about articles with Finterest AI" className="w-2/3 h-3/5 sm:h-1/2 lg:w-2/3 lg:h-1/3 xl:w-3/4 xl:h-1/2"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Chat about articles</h2>
                        <h5 className='text-finterest-solid text-center mt-5 text-sm xl:text-base'>Go into deeper details for each article with AI-powered insights at your fingertips.</h5>
                        
                    </div>

                    {/* Element 6 */}
                    <div className="row-start-6 sm:row-start-4 lg:row-start-3 col-span-1 sm:col-span-3 bg-firecracker-100 rounded-md flex flex-col justify-center items-center px-4 py-5">
                        <img src="/assets/personalised-list-svg.svg" alt="Finterest recommends articles according to your preferences" className="w-2/3 h-1/2 lg:w-1/2 lg:h-1/2 xl:w-1/2 xl:h-1/2"/>
                        <h2 className='font-gupter font-bold text-2xl xl:text-3xl text-finterest-solid text-center mt-5 2xl:mt-10'>Articles the way 
                        <span style={{
                            backgroundImage: `url('/assets/red-underline.png')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            height: '16px',
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
                    <div className="row-start-7 sm:row-start-4 lg:row-start-3 col-span-1 sm:col-span-3 bg-sapphire-100 rounded-md flex flex-col justify-center items-center px-4 py-5">
                        <img src="/assets/trusted-by.png" alt="Finterest is trusted by many people around the world" className="w-4/5 h-1/2 lg:w-2/3 lg:h-1/2 xl:w-3/5 xl:h-1/2"/>
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
                    <div className="py-10 row-start-8 sm:row-start-5 lg:row-start-4 col-span-1 sm:col-span-6 bg-gold-100 rounded-md flex flex-col justify-center items-center px-4 sm:px-0">
                       <div className='flex justify-center'>
                            <h2 className="font-gupter text-finterest-solid font-bold text-3xl lg:text-4xl max-w-[90%] lg:max-w-[70%] text-center 2xl:text-6xl">Create your account today and get started
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
                            <NextLink href={'/register'}>
                                <button className="bg-gold-900 hover:bg-gold-500 text-finterest-white font-bold font-dmsans py-4 px-6 rounded-full flex items-center duration-300">
                                    <span>Get started</span>
                                </button>
                            </NextLink>
                            <div className="relative">
                                <NextLink href={'/pricing'}>
                                <button className="bg-finterest-white hover:bg-gold-500 text-finterest-solid hover:text-finterest-white border-2 border-gray-300 hover:border-gold-500 font-dmsans py-4 px-6 rounded-full flex items-center duration-300">
                                    <span>Pricing <em>(psst, it&apos;s free!)</em></span>
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
                <Footer />

            </div>
        </PageWrapper>
    );
};

export default Landing;