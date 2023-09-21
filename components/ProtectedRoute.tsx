import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Navbar from "./Navbar";


//Protects pages from unauthenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { user } = useAuth();


    //Run this effect whenever we move from one route to another, or if there is a change
    //in the authenticated user
    useEffect(() => {
        if (!user.uid) {
            //User is not authenticated
            //Return to index page
            router.push('/');
        }
    }, [router, user])

    //If user is authenticated, no need for reroute so we just render the children
    //components that are encapsulated within this protected route
    return (
        <Navbar>
            <div>{user ? children : null}</div>
        </Navbar>
    )
}

export default ProtectedRoute;

