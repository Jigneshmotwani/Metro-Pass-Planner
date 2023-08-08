
import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Navigate } from "react-router-dom";
import { app } from "../config/firebase.config";
import { validateUser } from "../api";

function SignIn() {

    const firebaseAuth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const [auth, setAuth] = useState(false || window.localStorage.getItem("auth") === "true");
    const [user, setUser] = useState(null);

    const loginWithGoogle = async () => {
        await signInWithPopup(firebaseAuth, provider).then((userCred) => {
            if (userCred) {
                setAuth(true);
                window.localStorage.setItem("auth", "true");
            }
        });
    };

    useEffect(() => {
        firebaseAuth.onAuthStateChanged((userCred) => {
            if (userCred) {
                userCred.getIdToken().then((token) => {
                    window.localStorage.setItem("auth", "true");
                    console.log(token)
                    validateUser(token).then((data) => {
                        setUser(data.user);
                    });
                });
            } else {
                setAuth(false);
                setUser(null);
                window.localStorage.setItem("auth", "false");
            }
        });
    }, [firebaseAuth]);

    return auth ? (
        //if the user is authenticated,redirect him to the main page
        <Navigate to="/mainPage" />
    ) : (
        //if the user is unauthenticated,let him stay in the sign-in modal
        <div className="App">
            <div className="centered-content">
                <h1>Welcome to Metro Pass Planner</h1>
                <button onClick={loginWithGoogle}>Login</button>
            </div>
        </div>
    )
}

export default SignIn;