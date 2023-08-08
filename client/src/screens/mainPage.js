import React, { useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { Navigate } from "react-router-dom";
import Nav from "./Nav";
import '../App.css';

function MainPage() {

    const [auth, setAuth] = useState(
        false || window.localStorage.getItem("auth") === "true"
    );

    return auth ? (
        //if the user is authenticated,render the main page
        <div className="App">
            <div className="centered-content">
            <Nav />
            <h1>Welcome</h1>
            <h2>UserID: {window.localStorage.getItem('userID')}</h2>
            </div>
        </div>) : (
        //if the user is unauthenticated or log out,redirect him to the landing page
        <Navigate to="/" />
    )
}

export default MainPage;