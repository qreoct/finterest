import { PageWrapper } from '@/components/PageWrapper';
import { Checkbox } from '@/components/common/Checkbox';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BiBuildingHouse, BiChart, BiLogoBitcoin, BiMoney, BiNetworkChart } from 'react-icons/bi';

/*
Onboarding page
*/

interface PreferenceProps {
    value: string;
    checked: boolean
}

const Onboarding = () => {
    const router = useRouter();
    const { user, updateUserPref } = useAuth();

    const [preferences, setPreferences] = useState<PreferenceProps[]>([
        {
            value: 'investor',
            checked: false,
        },
        {
            value: 'retirement',
            checked: false,
        },
        {
            value: 'crypto',
            checked: false,
        },
        {
            value: 'econ',
            checked: false,
        },
        {
            value: 'entrepreneur',
            checked: false,
        }
    ]);

    const [anyPreferencesSelected, setAnyPreferencesSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdatePreferences = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        await updateUserPref(user, preferences.filter((p) => p.checked).map((p) => p.value));
        setIsLoading(false);
        router.push('/dashboard');
    }

    const handleCheckbox = (checkbox: PreferenceProps) => {
        const indexToChange = preferences.findIndex((p) => p.value == checkbox.value);
        let prefCopy = preferences;
        prefCopy[indexToChange].checked = checkbox.checked;
        setPreferences(prefCopy);
        setAnyPreferencesSelected(prefCopy.filter((p) => p.checked === true).length > 0);
    }

    return (
        <>
            <Head>
                <title>Finterest - Onboarding</title>
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
                    <div className="flex flex-col justify-around items-center h-screen w-full overflow-y-auto px-4 py-4 space-y-8">
                        {/* Body */}
                        <h4 className='font-dmsans text-2xl sm:text-3xl lg:text-4xl font-bold text-center'>Welcome to Finterest! Let&apos;s get you started.</h4>
                        <div className="flex justify-center items-center mb-3 w-full">
                            <div>
                                <p className='text-md text-finterest-solid text-center sm:text-lg mb-4'>What are your financial goals?</p>
                                <ul className="grid w-full gap-2 lg:gap-6 grid-cols-2 overflow-y-auto h-full">
                                    <Checkbox title="Budding Investor" description='Growing your wealth through investments.'
                                        value='investor' name='pref' icon={<BiMoney />} callback={handleCheckbox} />

                                    <Checkbox title="Retirement Planner" description='Secure your retirement by setting goals and investing for your golden years.'
                                        value='retirement' name='pref' icon={<BiBuildingHouse />} callback={handleCheckbox} />

                                    <Checkbox title="Crypto Degen" description='Stay on the cutting edge of cryptocurrencies and digital finance.'
                                        value='crypto' name='pref' icon={<BiLogoBitcoin />} callback={handleCheckbox} />

                                    <Checkbox title="Economist" description='Understanding demand, supply, and other real-world economic applications.'
                                        value='econ' name='pref' icon={<BiChart />} callback={handleCheckbox} />

                                    <Checkbox title="Entrepreneur" description='Get the financial know-how to launch and sustain your own ventures.'
                                        value='entrepreneur' name='pref' icon={<BiNetworkChart />} callback={handleCheckbox} />
                                </ul>
                            </div>
                        </div>
                        <button disabled={!anyPreferencesSelected || isLoading} onClick={handleUpdatePreferences}
                            className="w-full lg:w-[25%] text-white bg-gold-500 hover:bg-gold-900 rounded-lg text-lg font-bold font-dmsans px-5 py-3 text-center mb-8 mt-2
                            disabled:bg-gray-100 disabled:gray-100 disabled:cursor-not-allowed">
                            {isLoading
                                ? <LoadingSpinner />
                                : <span>Proceed</span>
                            }
                        </button>
                    </div>
                </PageWrapper>
            </main>
        </>
    );
};

export default Onboarding;