import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth } from "./firebase.js";
import { db } from "./firebase.js";

export async function saveWatchHistory(title, type) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(
    collection(db, "users", user.uid, "watchHistory"),
    {
      title: title,
      type: type,
      watchedAt: serverTimestamp()
    }
  );
}

export async function saveListenHistory(song, artist) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(
    collection(db, "users", user.uid, "listenHistory"),
    {
      title: song,
      artist: artist,
      listenedAt: serverTimestamp()
    }
  );
}


export async function savePlayHistory(game, score) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(
    collection(db, "users", user.uid, "playHistory"),
    {
      game: game,
      score: score,
      playedAt: serverTimestamp()
    }
  );
}
