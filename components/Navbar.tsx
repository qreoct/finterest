import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const Navbar = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { logOut } = useAuth();

    const navButtonStyle = 'cursor-pointer mx-2 text-white';

    return (
        <div>
            <div className="flex space-x-10 justify-center items-center bg-blue-500 py-4">
                <div className={navButtonStyle} onClick={() => router.push('/')}>Finterest</div>
                <div className={navButtonStyle} onClick={() => router.push('/chats/all-chats')}>My Chats</div>
                <div className={navButtonStyle} onClick={() => router.push('/profile')}>Profile</div>
                <div className={navButtonStyle} onClick={() => {
                    logOut();
                    router.push('/');
                }}>Logout</div>
            </div>
            {children}
        </div>

    )

}
export default Navbar


