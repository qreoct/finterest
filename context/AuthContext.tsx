import React, { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.config';
import { signInWithPopup, GoogleAuthProvider, updatePassword, getAuth } from 'firebase/auth';
import { addUserIfNotExist, getUser, updateUserPreferences } from '@/config/firestore';


/* 
The AuthContext is a context that is stores authentication information such that all pages
can access the currently signed in user.

Adapted from https://www.stoman.me/articles/nextjs-firebase-auth
*/

//Custom user data type interface
export interface UserType {
    email: string | null;
    uid: string | null;
    onboarding_stage: string | null;
    article_preferences: string[] | null;
}

//Create authcontext and make it available across pages
const AuthContext = createContext({});
export const useAuth = () => useContext<any>(AuthContext);

//Create the provider that provides the context to child components such that child components
//can access the information in the context
export const AuthContextProvider = (
    { children }: { children: React.ReactNode; }) => {
    // Keeps track of the user currently logged in and whether we are loading information from Firebase
    const [user, setUser] = useState<UserType>({ email: null, uid: null, onboarding_stage: null, article_preferences: null });
    const [loading, setLoading] = useState<Boolean>(true);

    // Whenever auth state from Firebase changes, it will set the new user accordingly
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {

            let dbUser = null;
            if (user) {
                dbUser = getUser(user.uid);
            }

            if (dbUser && user) {
                //There is a currently signed-in user
                // get ref from firestore
                setUser({
                    email: user.email,
                    uid: user.uid,
                    onboarding_stage: 'complete',
                    article_preferences: [],
                });
                console.log("AUTHCONTEXT USEEFFECT user is set to " + JSON.stringify(dbUser) + JSON.stringify(user))
            } else {
                //No user is signed in
                console.log("AUTHCONTEXT USEEFFECT no user signed up")
                setUser({ email: null, uid: null, onboarding_stage: null, article_preferences: null });
            }
            setLoading(true);
        });

        setLoading(false);
        unsubscribe();
    }, []);


    //Register new account via email and password
    const signUpViaEmail = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("signed up! user is " + JSON.stringify(user));
        
        setUser({ email: user.email, uid: user.uid, onboarding_stage: 'new account', article_preferences: null })
        await addUserIfNotExist(user.uid);
    };

    //Logins via email and password
    const loginViaEmail = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        
        console.log("logged in! user is " + JSON.stringify(user));
        await addUserIfNotExist(user.uid);
        const currUser = await getUser(user.uid);

        if (currUser) {
            setUser({
                email: currUser.email,
                uid: currUser.uid,
                onboarding_stage: currUser.onboarding_stage || 'new account',
                article_preferences: currUser.article_preferences || [],
            });
        }
    };

    //Sign in via Google
    const googleSignIn = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const uid = result.user.uid;
        console.log("google logged in! user is " + JSON.stringify(result.user));
        await addUserIfNotExist(uid);
        const currUser = await getUser(uid);

        if (currUser) {
            setUser({
                email: result.user.email,
                uid: result.user.uid,
                onboarding_stage: currUser.onboarding_stage || 'new account',
                article_preferences: currUser.article_preferences || [],
            });
        }

    }

    //Log out from the app
    const logOut = async () => {
        await signOut(auth);
        setUser({
            email: null,
            uid: null,
            onboarding_stage: null,
            article_preferences: null,
        });
        return;
    }

    //Update user preferences
    const updateUserPref = async (user: UserType, prefs: string[]) => {
        setUser({
            email: user.email,
            uid: user.uid,
            onboarding_stage: 'complete',
            article_preferences: prefs,
        })
        await updateUserPreferences(user.uid, prefs);
    }

    //Wrap the children components with the context provider to access the user information
    //and authentication functionalities
    return (
        <AuthContext.Provider value={{ user, loading, signUpViaEmail, loginViaEmail, googleSignIn, logOut, updateUserPref }}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
};



