import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const nameEl = document.getElementById("userName");
const emailEl = document.getElementById("userEmail");
const imgEl = document.getElementById("profileImg");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  nameEl.textContent = user.displayName || "User";
  emailEl.textContent = user.email;
  imgEl.src = user.photoURL || "default-avatar.png";
});

window.logout = function(){
  signOut(auth).then(() => {
    window.location.replace("login.html");
  });
};

import { auth } from "./firebase.js";
import { db } from "./firebase.js";
import { collection, getDocs, orderBy, query } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  loadHistory("watchHistory", "watchList", "title");
  loadHistory("listenHistory", "listenList", "title");
  loadHistory("playHistory", "playList", "game");
});

async function loadHistory(colName, elementId, field) {
  const q = query(
    collection(db, "users", auth.currentUser.uid, colName),
    orderBy(field === "game" ? "playedAt" : "watchedAt", "desc")
  );

  const snapshot = await getDocs(q);
  const list = document.getElementById(elementId);

  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data()[field];
    list.appendChild(li);
  });
}
