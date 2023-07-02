import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJHWBlTorVeLB4Eth-DHrYkOp26nlbcFg",
  authDomain: "gapingo-6533c.firebaseapp.com",
  projectId: "gapingo-6533c",
  storageBucket: "gapingo-6533c.appspot.com",
  messagingSenderId: "1048124148532",
  appId: "1:1048124148532:web:a9966fec703cc766353361"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);