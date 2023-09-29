import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

//Protects pages from unauthenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { user, loading } = useAuth();

    //Run this effect whenever we move from one route to another, or if there is a change
    //in the authenticated user
    useEffect(() => {
        if (!user.uid && !loading) {
            //User is not authenticated
            //Return to index page
            router.push('/');
        } else if (user.onboarding_stage != 'complete') {
            // User hasn't completed onboarding
            router.push('/onboarding');
        }
    }, [user])

    //If user is authenticated, no need for reroute so we
    // just render the children components that are encapsulated within this protected route
    return (
        <div>{user ? children : null}</div>
    )
}

export default ProtectedRoute;

