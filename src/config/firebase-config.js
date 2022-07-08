// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9O9DuoUoarMBc4QOgtfECe8kwEhELMuA",
  authDomain: "redux-essentials-course.firebaseapp.com",
  databaseURL: "https://redux-essentials-course-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "redux-essentials-course",
  storageBucket: "redux-essentials-course.appspot.com",
  messagingSenderId: "958436191610",
  appId: "1:958436191610:web:e5d288586b204dd55d3ac3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);