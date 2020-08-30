import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCHHJ9atOzB8EaZWK_zDUS2y4Ruq-Vo8eA",
  authDomain: "instagram-clone-b4d48.firebaseapp.com",
  databaseURL: "https://instagram-clone-b4d48.firebaseio.com",
  projectId: "instagram-clone-b4d48",
  storageBucket: "instagram-clone-b4d48.appspot.com",
  messagingSenderId: "414401574331",
  appId: "1:414401574331:web:c58fa837230ce1e1e0009e",
  measurementId: "G-PBF5FYR0YG"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };