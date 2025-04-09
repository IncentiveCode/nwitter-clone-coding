import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4IOqN7Iq7-PcdXIwrdmCpIVBkn6lE4Dc",
  authDomain: "nwitter-clone-coding.firebaseapp.com",
  projectId: "nwitter-clone-coding",
  storageBucket: "nwitter-clone-coding.firebasestorage.app",
  messagingSenderId: "642439648682",
  appId: "1:642439648682:web:ff1b1554c3953a5c5087d3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);