import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { app } from '../config/firebase.config';
import { validateUser } from '../api';
import '../App.css';

function Login() {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [auth, setAuth] = useState(
    false || window.localStorage.getItem('auth') === 'true'
  );
  const [user, setUser] = useState(null);

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem('auth', 'true');
      }
    });
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        userCred.getIdToken().then((token) => {
          window.localStorage.setItem('auth', 'true');
          console.log(token);
          validateUser(token).then((data) => {
            setUser(data.user);
            window.localStorage.setItem('userID', data.user.userId);
          });
        });
      } else {
        setAuth(false);
        setUser(null);
        window.localStorage.setItem('auth', 'false');
        window.localStorage.removeItem('userID'); // Remove the userID if user is not authenticated
      }
    });
  }, [firebaseAuth]);

  return (
    <div className="App">
      <div className="centered-content">
        {auth ? (
          <>
            <Navigate to="/welcome" />
          </>
        ) : (
          <>
            <h1>Welcome to Metro Pass Planner</h1>
            <button onClick={loginWithGoogle}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
