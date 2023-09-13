import React, { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';


/* 
The AuthContext is a context that is stores authentication information such that all pages
can access the currently signed in user.

Adapted from https://www.stoman.me/articles/nextjs-firebase-auth
*/

//Custom user data type interface
interface UserType {
    email: string | null;
    uid: string | null;
}

//Create authcontext and make it available across pages
const AuthContext = createContext({});
export const useAuth = () => useContext<any>(AuthContext);



//Create the provider that provides the context to child components such that child components
//can access the information in the context
export const AuthContextProvider = (
    {children}: { children: React.ReactNode; }) => {
        // Keeps track of the user currently logged in and whether we are loading information from Firebase
        const [user, setUser] = useState<UserType>({ email: null, uid: null });
        const [loading, setLoading] = useState<Boolean>(true);

        // Whenever auth state from Firebase changes, it will set the new user accordingly
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    //There is a currently signed-in user
                    setUser({
                        email: user.email,
                        uid: user.uid
                    });
                } else {
                    //No user is signed in
                    setUser({ email: null, uid: null });
                }
            });

            setLoading(false);

            return () => unsubscribe();
        }, []);

 
    //Register new account via email and password
    const signUpViaEmail = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    //Logins via email and password
    const loginViaEmail = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    //Sign in via Google
    const googleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    };

    //Log out from the app
    const logOut = async () => {
        setUser({email: null, uid: null});
        return await signOut(auth);
    }

    //Wrap the children components with the context provider to access the user information
    //and authentication functionalities
    return (
        <AuthContext.Provider value={{ user, signUpViaEmail: signUpViaEmail, loginViaEmail: loginViaEmail, googleSignIn: googleSignIn, logOut: logOut }}>
            { loading ? null : children }
        </AuthContext.Provider>
    )
};



