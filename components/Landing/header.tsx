import NextLink from 'next/link';
import { useState } from 'react';
import { BsList, BsXLg } from 'react-icons/bs';
import chatboxStyles from '@/styles/chatbox.module.css';
import React from 'react'


/*
Header for landing pages
*/

/*
0: Home
1: Pricing
2: Login
3: Get started/register
*/
type HeaderProps = {
    tabIndex: number;
};

const Header= (tabIndex: HeaderProps) => {
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


    return (<section>
                {/* Hamburger menu */}
                <div id="hamburger-menu-element" className="bg-stone-100 h-screen flex-col py-10 px-10 duration-300 hidden">
                    <div className='self-end'>
                        <button onClick={ handleHamburgerMenuOnClick }>
                            <BsXLg className='text-4xl cursor-pointer text-finterest-solid' />
                        </button>
                    </div>

                    <div className='flex flex-col self-center flex-grow justify-center items-center space-y-16'>
                        {/* Home */}
                        { tabIndex.tabIndex == 0
                            ? (<NextLink href={'/'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-gold-900 text-xl ml-2 font-bold">Home</h5> 
                               </NextLink>)
                            : (<NextLink href={'/'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-finterest-solid hover:text-gold-900 text-xl ml-2">Home</h5> 
                            </NextLink>)
                        }

                        {/* Pricing */}
                        { tabIndex.tabIndex == 1
                            ? <NextLink href={'/pricing'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-gold-900 text-xl ml-2 font-bold">Pricing</h5> 
                              </NextLink>
                            : <NextLink href={'/pricing'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-finterest-solid hover:text-gold-900  text-xl ml-2">Pricing</h5> 
                              </NextLink> 
                        }

                        {/* Login */}
                        { tabIndex.tabIndex == 2
                            ? <NextLink href={'/login'}>
                                <h5 className="font-dmsans text-gold-900 text-xl ml-2 font-bold">Login</h5> 
                              </NextLink>
                            : <NextLink href={'/login'}>
                                <h5 className="font-dmsans text-finterest-solid hover:text-gold-900  text-xl ml-2">Login</h5> 
                              </NextLink>
                        }

                        {/* Register */}
                        { tabIndex.tabIndex == 3
                            ? <NextLink href={'/register'}>
                                <h5 className="font-dmsans text-gold-900 font-bold text-xl ml-2">Register</h5> 
                              </NextLink>
                            : <NextLink href={'/register'}>
                                <h5 className="font-dmsans text-finterest-solid hover:text-gold-900 text-xl ml-2">Register</h5> 
                              </NextLink>
                        }

                    </div>
                </div>


                 {/* Normal menu */}
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
                        { tabIndex.tabIndex == 0
                            ? <NextLink href={'/'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-gold-900 text-lg ml-2 font-bold">Home</h5> 
                              </NextLink> 
                            : <NextLink href={'/'} className="flex justify-center items-center">
                                <h5 className="font-dmsans  text-finterest-solid hover:text-gold-900 text-lg ml-2">Home</h5> 
                              </NextLink> 
                        }

                        {/* Pricing */}
                        { tabIndex.tabIndex == 1
                            ? <NextLink href={'/pricing'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-gold-900 text-lg ml-2 font-bold">Pricing</h5> 
                              </NextLink>  
                            : <NextLink href={'/pricing'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-finterest-solid hover:text-gold-900 text-lg ml-2">Pricing</h5> 
                              </NextLink> 
                        }

                        {/* Login */}
                        { tabIndex.tabIndex == 2 
                            ? <NextLink href={'/login'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-gold-900 text-lg ml-2 font-bold">Login</h5> 
                              </NextLink> 
                            : <NextLink href='/login'>
                                <button className="bg-finterest-white hover:bg-finterest-solid text-finterest-solid hover:text-finterest-white border-2 border-gray-300 hover:border-finterest-solid font-dmsans py-3 px-6 rounded-full flex items-center duration-300">
                                    <span>Login</span>
                                </button>
                                </NextLink>
                        }

                        {/* Get Started */}
                        { tabIndex.tabIndex == 3
                            ? <NextLink href={'/register'} className="flex justify-center items-center">
                                <h5 className="font-dmsans text-gold-900 text-lg ml-2 font-bold">Get started</h5> 
                              </NextLink> 
                            : <NextLink href='/register'>
                                <button className="bg-finterest-solid hover:bg-slate-200 text-finterest-white hover:text-finterest-solid font-bold font-dmsans py-3 px-6 rounded-full flex items-center duration-300">
                                    <span>Get started</span>
                                </button>
                            </NextLink> 
                        }

                    </div>
                    <div className="sm:hidden">
                        <button onClick={handleHamburgerMenuOnClick}>
                            <BsList className='text-4xl cursor-pointer text-finterest-solid' />
                        </button>
                    </div>
                    


                </div>

            </section>
    );
};

export default Header;