import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { BiNews, BiMessage, BiSmile, BiLogOut, BiStar } from "react-icons/bi";

/*
    The common left navigation bar used across pages
*/
type LeftNavigationBarProps = {
    tabIndex: number;
};

const LeftNavigationBar = (tabIndex: LeftNavigationBarProps) => {

    const { logOut } = useAuth();
    const router = useRouter();


    return (
        <div id='left-navigation-element' className="flex-grow w-3/4 md:max-w-sm min-w-fit w-100 md:h-screen flex justify-center md:flex-col md:justify-between bg-neutral-color-300 p-4 md:p-16 md:py-8 top-0 left-0 bottom-0">
            {/* Logo Bar */}
            <div className="flex-none flex flex-col justify-center items-center text-center">
                {/* First Row */}
                <div className="flex items-center">
                    {/* Image */}
                    <img src="/assets/finterest-mini.svg" alt="Finterest Logo" className="mr-16 w-7 h-10 md:m-2" />
                    {/* Title */}
                    <h2 className="font-gupter text-neutral-headings-black font-bold text-4xl ml-2 hidden md:block">Finterest</h2>
                </div>

                {/* Second Row */}
                <div className="mt-2 pt-2 hidden md:block">
                    {/* Subtitle */}
                    <h6 className="text-xs text-neutral-text-gray uppercase tracking-widest">Where wisdom meets wealth</h6>
                </div>
            </div>

            {/* Options */}
            <div className="md:ml-0 flex-grow flex justify-center items-center">
                <div className="md:flex-col flex justify-center items-start space-x-16 md:space-x-8 md:space-y-4">

                    <NextLink href={'/dashboard'} className="flex items-center md:ml-8 hover:text-gold-500">
                        <BiNews className='text-3xl cursor-pointer text-neutral-headings-black md:m-2' />
                        <h5 className={`hidden md:block font-dmsans text-neutral-headings-black text-lg ml-2 ${tabIndex.tabIndex === 0 ? 'font-bold' : ''}`}>News</h5>
                    </NextLink>

                    <NextLink href={'/chatwithai'} className="flex items-center md:ml-8 hover:text-gold-500">
                        <BiMessage className='text-3xl cursor-pointer text-neutral-headings-black md:m-2' />
                        <h5 className={`hidden md:block font-dmsans text-neutral-headings-black text-lg ml-2 ${tabIndex.tabIndex === 1 ? 'font-bold' : ''}`}>AI Chat</h5>
                    </NextLink>

                    <NextLink href={'/'} className="flex items-center md:ml-8 hover:text-gold-500">
                        <BiSmile className='text-3xl cursor-pointer text-neutral-headings-black md:m-2' />
                        <h5 className={`hidden md:block font-dmsans text-neutral-headings-black text-lg ml-2 ${tabIndex.tabIndex === 2 ? 'font-bold' : ''}`}>Profile</h5>
                    </NextLink>

                    <NextLink href={''} className="hidden md:flex items-center md:ml-8 hover:text-gold-500"
                        onClick={
                            () => {
                                logOut();
                                router.push('/');
                            }}>
                        <BiLogOut className='text-3xl cursor-pointer m-2' />
                        <span className="font-dmsans text-lg ml-2">Logout</span>
                    </NextLink>

                    <div className="hidden md:flex justify-center items-center">
                        <NextLink href='/pricing'>
                            <button className="bg-gold-500 hover:bg-gold-900 text-white font-semibold xl:py-2 px-8 rounded-full flex items-center mt-5">
                                <BiStar className='text-3xl cursor-pointer text-white m-2' />
                                <span className="mr-2">Upgrade</span>
                            </button>
                        </NextLink>
                    </div>
                </div>
            </div>

            {/* <div className="flex-none flex justify-center items-center">
                <h6 className="text-sm text-neutral-text-gray uppercase">CS3216 2023</h6>
            </div> */}
        </div>

    );
};

export default LeftNavigationBar;



