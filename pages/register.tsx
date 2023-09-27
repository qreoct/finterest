import RegistrationForm from '@/components/RegistrationForm';
import Head from 'next/head';
import { useState } from 'react';
import chatboxStyles from '@/styles/chatbox.module.css';
import { PageWrapper } from '@/components/PageWrapper';
import Header from '@/components/Landing/header';
import Footer from '@/components/Landing/footer';

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
               
            </Head>
            <main>
                <PageWrapper>
                    <div className="flex flex-col justify-between h-screen w-full overflow-y-auto overflow-x-hidden">
                        {/* Header */}
                        <Header tabIndex={3} />    

                        {/* Body */}
                        <div id="body-element" className='-mt-0 sm:-mt-10 flex justify-center'>
                            <div>
                            <RegistrationForm />
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

export default register;