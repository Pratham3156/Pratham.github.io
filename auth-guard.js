<script type="module">
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const profileImg = document.getElementById("profileImg");
const profileMenu = document.getElementById("profileMenu");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // ❌ NOT LOGGED IN → FORCE LOGIN PAGE
    window.location.replace("login.html");
  } else {
    // ✅ Logged in → show profile
    profileImg.src = user.photoURL || "default-avatar.png";
  }
});

window.logout = function () {
  signOut(auth).then(() => {
    // 🔥 Clear browser history & cache effect
    window.location.replace("login.html");
  });
};

// Profile menu toggle
profileImg?.addEventListener("click", () => {
  profileMenu.style.display =
    profileMenu.style.display === "block" ? "none" : "block";
});
</script>
