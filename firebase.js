// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCG7awgsnkNtyOoqN7aRsRyAP4hNxZsvdo",
  authDomain: "chillbox-747f8.firebaseapp.com",
  projectId: "chillbox-747f8",
  storageBucket: "chillbox-747f8.firebasestorage.app",
  messagingSenderId: "808846502692",
  appId: "1:808846502692:web:fd3a70a823506207f261b1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
