// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqKFuPxaJVUNGurPaDGsYNfvGNDegjAF4",
    authDomain: "final-saas.firebaseapp.com",
    projectId: "final-saas",
    storageBucket: "final-saas.appspot.com",
    messagingSenderId: "657341859335",
    appId: "1:657341859335:web:ea2cc2f9a95c93dccacca2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app;