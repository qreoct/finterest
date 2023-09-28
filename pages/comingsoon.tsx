import { PageWrapper } from '@/components/PageWrapper';
import Head from 'next/head';
import Header from '@/components/Landing/header';
import Footer from '@/components/Landing/footer';
import Link from 'next/link';


/*
Coming soon page
*/

const ComingSoon = () => {
  
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
                <link rel="icon" href="/favicon.png" />
              
            </Head>
            <main>
                <PageWrapper>
                    <div className="flex flex-col justify-between h-screen w-full overflow-y-auto">
                        {/* Header */}
                        <Header tabIndex={1} />
                        
                        {/* Body */}
                        <div id="body-element" className='-mt-0 sm:-mt-10 flex justify-center'>
                            <div className="flex justify-center items-center w-screen">
                                <div className="w-4/5 md:w-3/5 lg:w-2/5 xl:w-2/3 p-4 py-8 sm:p-6 sm:py-10 md:p-8 md:py-14">
                                    <div className='flex flex-col justify-center items-center space-y-8'>
                                    <h6 className='font-dmsans sm:text-xl text-gray-400 text-center bold'>Our team is working hard behind the scenes.</h6>
                                        <h4 className='font-dmsans text-2xl sm:text-3xl lg:text-4xl font-bold text-center'>Stay tuned for our payment system!</h4>
                                        <div className="text-md text-finterest-solid flex text-center sm:text-lg justify-center items-center mb-3 w-full">
                                            <p>View <span><Link href='/pricing' className='text-finterest-solid hover:text-gold-500 font-dmsans sm:text-lg font-bold hover:underline'>pricing plans</Link> instead.</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div>
                    </div>




                        </div>

                        {/* Footer */}
                        <Footer />

                    

                    </div>
                </PageWrapper>
            </main>
        </>
    );
};

export default ComingSoon;