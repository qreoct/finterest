import React, { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

//Custom user data type interface
interface UserType {
    email: string | null;
    uid: string | null;
}

//Create auth context such that all pages can share the user information
const authContext = createContext({});
//Make it available across the app by exporting it
export const useAuth = () => useContext<any>(authContext);

//Create the auth context provider
export const AuthContextProvider = ({children}: {
    children: React.ReactNode; }) => {
        // Keeps track of the user currently logged in and whether we are loading information from Firebase
        const [user, setUser] = useState<UserType>({ email: null, uid: null });
        const [loading, setLoading] = useState<Boolean>(true);

        // Whenever auth state from Firebase changes, it will set the new user accordingly
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser({
                        email: user.email,
                        uid: user.uid
                    });
                } else {
                    setUser({ email: null, uid: null });
                }
            });

            setLoading(false);

            return () => unsubscribe();
        }, []);

    //Sign up function
    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    //Login function
    const logIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };




    //Google sign in function
    const googleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
    });

    };











    //Logout function
    const logOut = async () => {
        setUser({email: null, uid: null});
        return await signOut(auth);
    }

    //Wrap the children components with the context provider to access the user information
    //and authentication functionalities
    return (
        <authContext.Provider value={{ user, signUp, logIn, googleSignIn, logOut }}>
            { loading ? null : children }

        </authContext.Provider>
    )

};



