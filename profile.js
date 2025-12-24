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
