import NextLink from 'next/link'

type PricingContentProps = {
    isLoggedIn: boolean;
};

export default function PricingContent({isLoggedIn}: PricingContentProps) {
    return (
        <div id="body-element" className='bg-white flex flex-col justify-center items-center space-y-5 px-12 md:px-16 lg:px-20'>
            <h6 className='font-dmsans uppercase text-xl text-gray-400 bold'>Pricing</h6>
            <h3 className='font-dmsans text-4xl sm:text-5xl font-bold text-center'>Affordable Pricing Plans</h3>
            <p className='font-dmsans text-gray-400 text-center'>Discover our range of affordable pricing plans, where there&apos;s a perfect option for everyone.</p>

            {/* Pricing Information */}
            <div className='flex flex-col md:flex-row justify-content items-center space-y-8 w-full sm:w-auto md:space-y-auto md:space-x-8 lg:space-x-16'>
                {/* Basic plan */}
                <div className='border-2 border-gold-500 flex flex-col rounded-lg md:w-2/5 sm:p-4 md:p-8'>
                    <div className='flex justify-between items-center mx-5 my-3'>
                        <img src="/assets/basic-plan-svg.svg" alt="Logo for Finterest Basic Plan" className="w-8 h-12 xl:w-10 xl:h-16 m-4" />
                        <div className='border-2 border-gold-500 font-bold rounded-full w-2/5 xl:w-1/4 text-dmsans text-center py-2 px-5'>Free</div>
                    </div>

                    <h4 className='font-dmsans text-3xl sm:text-4xl font-bold mx-5 my-3'>Basic Plan</h4>
                    <p className='font-dmsans text-gray-400 mx-5'>Perfect for beginners who want to get a taste of AI-powered financial articles.</p>
                    <ul className='font-dmsans text-finterest-solid mx-5 my-3 font-bold space-y-4 mt-5'>
                        <li className="mb-2 pl-6 relative">
                            <div className="absolute left-0 w-6 h-6">
                                <img src="/assets/check-circle-gold.png" alt="Bullet Point" className="w-full h-full" />
                            </div>
                            <span className='ml-2'>Access to the latest financial news</span>
                        </li>
                        <li className="mb-2 pl-6 relative">
                            <div className="absolute left-0 w-6 h-6">
                                <img src="/assets/check-circle-gold.png" alt="Bullet Point" className="w-full h-full" />
                            </div>
                            <span className='ml-2'>Personalised article recommendations</span>
                        </li>
                        <li className="mb-2 pl-6 relative">
                            <div className="absolute left-0 w-6 h-6">
                                <img src="/assets/check-circle-gold.png" alt="Bullet Point" className="w-full h-full" />
                            </div>
                            <span className='ml-2'>5 outgoing messages per day with Finterest AI</span>
                        </li>
                        <li className="mb-2 pl-6 relative">
                            <div className="absolute left-0 w-6 h-6">
                                <img src="/assets/check-circle-gold.png" alt="Bullet Point" className="w-full h-full" />
                            </div>
                            <span className='ml-2'>Highlight and explain terms (desktop only)</span>
                        </li>
 
                    </ul>
                    {isLoggedIn ?
                        <div className='flex flex-col md:flex-row justify-start items-start md:items-center mx-5 my-3 mt-5 space-y-4 md:space-y-0 md:space-x-16'>
                            <div className="bg-gold-500 text-finterest-white hover:text-finterest-white font-dmsans font-bold py-4 px-6 rounded-full flex items-center duration-300 mt-5">
                                <span>Current Plan</span>
                            </div>
                        </div>
                        :
                        <NextLink href={'/'} className='mx-5 my-3'>
                            <button className="bg-gold-500 hover:bg-gold-900 text-finterest-white hover:text-finterest-white font-dmsans font-bold py-4 px-6 rounded-full flex items-center duration-300 mt-5">
                                <span>Get started</span>
                            </button>
                        </NextLink>
                    }
                </div>

                {/* Finterest Plus */}
                <div className='bg-gradient-to-br from-custom-gold-top to-custom-gold-bottom flex flex-col rounded-lg w-full sm:w-auto md:w-3/5 p-4 sm:p-8 md:p-12 xl:p-16'>
                    <div className='flex justify-between items-center mx-5 my-3'>
                            <img src="/assets/finterest-plus-svg.svg" alt="Logo for Finterest PLUS Plan" className="w-20 h-20 m-4" />
                            <div className='bg-white rounded-full w-1/2 lg:w-2/3 xl:w-1/4 text-dmsans text-center py-4 px-5 text-black font-bold'>$1.99/mo</div>
                    </div>

                    <h4 className='font-dmsans text-4xl font-bold mx-5 my-3 text-white'>Finterest PLUS</h4>
                    <p className='font-dmsans text-white mx-5'>Want more AI insights into the financial world? This plan would be the right one for you.</p>
                    <div className='flex flex-col md:flex-row justify-start items-start md:items-center mx-5 my-3 mt-5 space-y-4 md:space-y-0 md:space-x-16'>
                        <ul className='font-dmsans text-white font-bold space-y-3'>
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
                                <span className='ml-2'>Unlimited outgoing messages with Finterest AI</span>
                            </li>
                        </ul>

                    </div>
                    {isLoggedIn ?
                        <div className='flex flex-col md:flex-row justify-start items-start md:items-center mx-5 my-3 mt-5 space-y-4 md:space-y-0 md:space-x-16'>
                            <div className="bg-white text-finterest-black text-bold font-dmsans font-bold py-4 px-6 rounded-full flex items-center duration-300 mt-5">
                                <span>Coming Soon...</span>
                            </div>
                        </div>
                        :        
                        <NextLink href={'/comingsoon'} className='mx-5 my-3'>
                            <button className="bg-white hover:bg-gold-900 text-finterest-black hover:text-finterest-white text-bold font-dmsans font-bold py-4 px-6 rounded-full flex items-center duration-300 mt-5">
                                <span>Purchase</span>
                            </button>
                        </NextLink>
                    }
                </div>

            </div>

        </div>
    )
}