// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUPzMfncC-IORVn2F9QELsGPJCQ5CICoM",
  authDomain: "minerva-test-6c806.firebaseapp.com",
  projectId: "minerva-test-6c806",
  storageBucket: "minerva-test-6c806.appspot.com",
  messagingSenderId: "638665636823",
  appId: "1:638665636823:web:c98183831d3bc518c6e992",
  measurementId: "G-YGY65X5BEW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;

export const db = getFirestore(app);
