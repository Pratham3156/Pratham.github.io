<script type="module">
import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function saveHistory(type, title, page) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(
    collection(db, "users", user.uid, "history"),
    {
      type: type,       // movie / game / music
      title: title,
      page: page,
      timestamp: serverTimestamp()
    }
  );
}
</script>
