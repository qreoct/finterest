import NextLink from 'next/link';
import { useState } from 'react';
import { BsList, BsXLg } from 'react-icons/bs';
import chatboxStyles from '@/styles/chatbox.module.css';
import React from 'react'
import { PageWrapper } from '../PageWrapper';


/*
Footer
*/

const Footer = () => {
    return ( <div id="footer-element"className='bg-white flex justify-between'>
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
    );
};

export default Footer