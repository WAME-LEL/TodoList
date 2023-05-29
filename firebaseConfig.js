// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSmz4m-cc-nWNvVVjeI9p51jQZAESH-CE",
  authDomain: "todolist-af09f.firebaseapp.com",
  projectId: "todolist-af09f",
  storageBucket: "todolist-af09f.appspot.com",
  messagingSenderId: "505581806427",
  appId: "1:505581806427:web:05157311f7eed2ee0d707e",
  measurementId: "G-NS308F61PV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db}