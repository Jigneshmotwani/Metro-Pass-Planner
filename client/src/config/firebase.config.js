import { getApp, getApps, initializeApp } from 'firebase/app'
// import {getStorage} from 'firebase/storage'
// import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAezpw_crdiRa7N0mZtMRHS03k_-27amIw",
    authDomain: "metro-pass-planner.firebaseapp.com",
    projectId: "metro-pass-planner",
    storageBucket: "metro-pass-planner.appspot.com",
    messagingSenderId: "55014617364",
    appId: "1:55014617364:web:70b1847d4f0020c9035201",
    measurementId: "G-0FX9TK2GEE"
  };

  const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
  // const storage = getStorage(app);
  // const firestore = getFirestore(app);

  export { app };