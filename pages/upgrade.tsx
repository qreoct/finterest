import ProtectedRoute from '@/components/ProtectedRoute';
import Head from 'next/head';
import LeftNavigationBar from '@/components/common/LeftNavigationBar'
import { BiLogOut } from "react-icons/bi";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { StatCard } from '@/components/Profile/StatCard';
import Pricing from './pricing';
import PricingContent from '@/components/Pricing/PricingContent';

/*
Upgrade page
*/

const Upgrade = () => {
  
    return (
        <ProtectedRoute>
            <Head>
                <title>Chat with Finterest AI</title>
                <meta
                    name="description"
                    content="Finterest AI"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex items-center flex-col-reverse md:flex-row md:items-start h-screen overflow-y-hidden">
                {/* Navigation Bar */}
                <LeftNavigationBar tabIndex={4} />

                {/* Right Content */}
                <div className="flex flex-col bg-white w-full h-full md:h-screen overflow-y-auto space-y-8 md:space-y-5">
                    <PricingContent isLoggedIn={true} />
                </div>
            </div>

        </ProtectedRoute>
    );
};

export default Upgrade;