// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAUPzMfncC-IORVn2F9QELsGPJCQ5CICoM",
//   authDomain: "minerva-test-6c806.firebaseapp.com",
//   projectId: "minerva-test-6c806",
//   storageBucket: "minerva-test-6c806.appspot.com",
//   messagingSenderId: "638665636823",
//   appId: "1:638665636823:web:c98183831d3bc518c6e992",
//   measurementId: "G-YGY65X5BEW",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export default app;

// export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { OAuthProvider, getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCaw7benPxJeQlXhMf9t7hjX7j30qDUYSU",
  authDomain: "minerva-0000.firebaseapp.com",
  projectId: "minerva-0000",
  storageBucket: "minerva-0000.appspot.com",
  messagingSenderId: "674859929864",
  appId: "1:674859929864:web:ffcec4dd04021d991b1cbd",
  measurementId: "G-RBLFGRRJ11",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

const linkedinProvider = new OAuthProvider("oidc.linkedin");
linkedinProvider.setCustomParameters({
  client_secret: "kAo7iKUzPcwcHNEj",
});

export default app;

export { doc, getDoc, setDoc, serverTimestamp, linkedinProvider };
