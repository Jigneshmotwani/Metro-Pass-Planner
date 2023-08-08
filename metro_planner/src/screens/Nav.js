import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../config/firebase.config';

const Nav = () => {
  const firebaseAuth = getAuth(app);

  const [auth, setAuth] = useState(
    false || window.localStorage.getItem('auth') === 'true'
  );

  const signOutAccount = () => {
    signOut(firebaseAuth);
    setAuth(false);
    window.localStorage.setItem('auth', 'false');
  };
  return (
    <nav className="navbar">
      <ul className="nav-ul">
        <li>
          <Link className="pr-5" onClick={signOutAccount} to="/">
            Logout
          </Link>
          <Link className="pr-5" to="/routeRecommender">
            Route Recommender
          </Link>
          <Link className="pr-5" to="/passRecommender">
            Pass Recommender
          </Link>
          <Link className="pr-5" to="/viewTrips">
            View Trips
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
