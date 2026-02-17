<script>
const API_KEY = "166830f0c57dfdbf8f9a4ebeb942d300";
const HERO = document.getElementById("hero");
let heroMovies = [], currentIndex = 0;
  const NEW_THEATER_MOVIES_API =
  `https://api.themoviedb.org/3/movie/now_playing?` +
  `api_key=${API_KEY}&` +
  `region=IN&` +          // India theaters
  `language=en-US&page=1`;
  const UPCOMING_MOVIES_API =
  `https://api.themoviedb.org/3/movie/upcoming?` +
  `api_key=${API_KEY}&` +
  `region=IN&` +        // India theaters
  `language=en-US&page=1`;


   const POPULAR_ONGOING_ANIME_IDS = [
  37854, // One Piece
  85937, // Demon Slayer
  94605, // Jujutsu Kaisen
  46298, // Attack on Titan (if still airing specials)
  1429,  // Naruto Shippuden (specials / ongoing listings)
];
/* ===== TRENDING HERO MOVIES ===== */
async function loadHeroMovies() {
  const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
  const data = await res.json();
  heroMovies = data.results.sort(() => Math.random() - 0.5).slice(0, 10);
  createPaginationDots();
  updateHero();
}

function updateHero() {
  const movie = heroMovies[currentIndex];
  HERO.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  document.getElementById("heroTitle").innerText = movie.title;
  document.getElementById("heroLang").innerText = "Audio: English | Hindi | Tamil | Telugu | Malayalam | Kannada";
  document.getElementById("heroRank").innerText = `🔥 Trending Rank: #${currentIndex + 1}`;
  document.getElementById("heroDesc").innerText = movie.overview.slice(0, 180) + "...";
  updateDots();
  HERO.onclick = () => openMovieModal(movie.id);
}

function createPaginationDots() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  heroMovies.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = i;
      updateHero();
    });
    pagination.appendChild(dot);
  });
}

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) =>
    dot.classList.toggle("active", i === currentIndex)
  );
}

document.getElementById("prevBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + heroMovies.length) % heroMovies.length;
  updateHero();
});
document.getElementById("nextBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % heroMovies.length;
  updateHero();
});

setInterval(() => {
  if (heroMovies.length) {
    currentIndex = (currentIndex + 1) % heroMovies.length;
    updateHero();
  }
}, 6000);

loadHeroMovies();

/* ===== SEARCH FEATURE ===== */
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", async function() {
  const query = this.value.trim();
  if (query.length < 2) {
    searchResults.style.display = "none";
    return;
  }

  const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`);
  const data = await res.json();

  searchResults.innerHTML = data.results.slice(0, 6).map(movie => `
    <div onclick="openMovieModal(${movie.id});searchResults.style.display='none'">
      <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/40x60'}">
      <span>${movie.title}</span>
    </div>
  `).join("");

  searchResults.style.display = "block";
});

document.addEventListener("click", e => {
  if (!searchResults.contains(e.target) && e.target !== searchInput) {
    searchResults.style.display = "none";
  }
});

/* ===== GENRE SLIDERS ===== */
let genreMap = {};
async function loadGenres() {
  const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
  const data = await res.json();
  data.genres.forEach(g => genreMap[g.id] = g.name);
}
loadGenres();

const categories = [
  { title: "Trending", url: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}` },
  { title: "Action", url: `https://api.themoviedb.org/3/discover/movie?with_genres=28&api_key=${API_KEY}` },
  { title: "Comedy", url: `https://api.themoviedb.org/3/discover/movie?with_genres=35&api_key=${API_KEY}` },
  { title: "Horror", url: `https://api.themoviedb.org/3/discover/movie?with_genres=27&api_key=${API_KEY}` },
  { title: "Romance", url: `https://api.themoviedb.org/3/discover/movie?with_genres=10749&api_key=${API_KEY}` },
  { title: "Science Fiction", url: `https://api.themoviedb.org/3/discover/movie?with_genres=878&api_key=${API_KEY}` }
];
/* ===== UpComming Movies ===== */
  async function createUpcomingMoviesSlider() {
  const res = await fetch(UPCOMING_MOVIES_API);
  const data = await res.json();

  if (!data.results || data.results.length === 0) return;

  const today = new Date();

  // 🔥 Keep only future releases
  const upcomingMovies = data.results
    .filter(movie => {
      if (!movie.release_date || !movie.poster_path) return false;
      const releaseDate = new Date(movie.release_date);
      return releaseDate > today;
    })
    .slice(0, 15);

  const container = document.getElementById("slidersContainer");

  const section = document.createElement("div");
  section.className = "slider-section";

  section.innerHTML = `
    <h2 class="slider-title">🎬 Coming Soon</h2>

    <div class="movie-slider" id="UpcomingSlider"></div>

    <div class="slider-arrow slider-left" id="UpcomingLeft">&#10094;</div>
    <div class="slider-arrow slider-right" id="UpcomingRight">&#10095;</div>
  `;

  container.appendChild(section);

  const slider = document.getElementById("UpcomingSlider");

  upcomingMovies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <div class="movie-overlay">
        <h3>${movie.title}</h3>
        <p>📅 ${movie.release_date}</p>
        <p>⏳ Coming Soon</p>
      </div>
    `;

    card.onclick = () => openMovieModal(movie.id);
    slider.appendChild(card);
  });

  document.getElementById("UpcomingLeft").onclick = () =>
    slider.scrollBy({ left: -270, behavior: "smooth" });

  document.getElementById("UpcomingRight").onclick = () =>
    slider.scrollBy({ left: 270, behavior: "smooth" });
}
createUpcomingMoviesSlider();

/* ===== Threater Movie Slider ===== */
  async function createTheaterMoviesSlider() {
  const res = await fetch(NEW_THEATER_MOVIES_API);
  const data = await res.json();

  if (!data.results || data.results.length === 0) return;

  // 🔥 Only VERY recent releases (last 60 days)
  const today = new Date();
  const movies = data.results.filter(movie => {
    if (!movie.release_date) return false;
    const releaseDate = new Date(movie.release_date);
    const diffDays =
      (today - releaseDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 60;
  }).slice(0, 15);

  const container = document.getElementById("slidersContainer");

  const section = document.createElement("div");
  section.className = "slider-section";

  section.innerHTML = `
    <h2 class="slider-title">🎥 New Theater Releases</h2>

    <div class="movie-slider" id="TheaterSlider"></div>

    <div class="slider-arrow slider-left" id="TheaterLeft">&#10094;</div>
    <div class="slider-arrow slider-right" id="TheaterRight">&#10095;</div>
  `;

  container.appendChild(section);

  const slider = document.getElementById("TheaterSlider");

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <div class="movie-overlay">
        <h3>${movie.title}</h3>
        <p>📅 ${movie.release_date}</p>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
      </div>
    `;

    card.onclick = () => openMovieModal(movie.id);
    slider.appendChild(card);
  });

  document.getElementById("TheaterLeft").onclick = () =>
    slider.scrollBy({ left: -270, behavior: "smooth" });

  document.getElementById("TheaterRight").onclick = () =>
    slider.scrollBy({ left: 270, behavior: "smooth" });
}
createTheaterMoviesSlider();

/* ===== ANIME SLIDER (TMDB Animation Genre) ===== */
async function createAnimeSlider() {
  const container = document.getElementById("slidersContainer");

  // 1️⃣ Fetch ongoing shows
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`
  );
  const data = await res.json();

  // 2️⃣ Filter only anime (Animation = 16)
  let animeList = data.results.filter(show =>
    show.genre_ids.includes(16)
  );

  // 3️⃣ Sort by TOP quality
  animeList = animeList
    .filter(a => a.vote_count > 100)
    .sort((a, b) =>
      (b.vote_average * b.vote_count + b.popularity) -
      (a.vote_average * a.vote_count + a.popularity)
    );

  // 4️⃣ Force-add popular ongoing anime (like One Piece)
  const forcedAnime = await Promise.all(
    POPULAR_ONGOING_ANIME_IDS.map(id =>
      fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`)
        .then(r => r.json())
    )
  );

  // 5️⃣ Merge lists (avoid duplicates)
  const animeMap = new Map();

  [...forcedAnime, ...animeList].forEach(anime => {
    if (
      anime &&
      anime.poster_path &&
      anime.genres?.some(g => g.id === 16) &&
      anime.status === "Returning Series"
    ) {
      animeMap.set(anime.id, anime);
    }
  });

  // 6️⃣ Final TOP list
  const finalAnimeList = Array.from(animeMap.values()).slice(0, 15);

  if (finalAnimeList.length === 0) return;

  // 7️⃣ Build UI
  const section = document.createElement("div");
  section.className = "slider-section";

  section.innerHTML = `
    <h2 class="slider-title">🔥 Popular Ongoing Anime</h2>

    <div class="movie-slider" id="AnimeSlider"></div>

    <div class="slider-arrow slider-left" id="AnimeLeft">&#10094;</div>
    <div class="slider-arrow slider-right" id="AnimeRight">&#10095;</div>
  `;

  container.appendChild(section);

  const slider = document.getElementById("AnimeSlider");

  finalAnimeList.forEach(anime => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${anime.poster_path}">
      <div class="movie-overlay">
        <h3>${anime.name}</h3>
        <p>⭐ ${anime.vote_average?.toFixed(1) || "N/A"}</p>
        <p>📺 Ongoing</p>
      </div>
    `;

    card.onclick = () => openAnimeModal(anime.id);
    slider.appendChild(card);
  });

  // 8️⃣ Slider arrows
  document.getElementById("AnimeLeft").onclick = () =>
    slider.scrollBy({ left: -270, behavior: "smooth" });

  document.getElementById("AnimeRight").onclick = () =>
    slider.scrollBy({ left: 270, behavior: "smooth" });
}

createAnimeSlider();



async function createSliders() {
  const container = document.getElementById("slidersContainer");
  for (let cat of categories) {
    const res = await fetch(cat.url);
    const data = await res.json();
    const movies = data.results.slice(0, 15);

    const section = document.createElement("div");
    section.className = "slider-section";
    section.innerHTML = `
      <h2 class="slider-title">${cat.title}</h2>
      <div class="movie-slider" id="${cat.title.replace(/\s/g, '')}Slider"></div>
      <div class="slider-arrow slider-left" id="${cat.title.replace(/\s/g, '')}Left">&#10094;</div>
      <div class="slider-arrow slider-right" id="${cat.title.replace(/\s/g, '')}Right">&#10095;</div>`;
    container.appendChild(section);

    const slider = document.getElementById(`${cat.title.replace(/\s/g, '')}Slider`);
    for (let movie of movies) {
      const card = document.createElement("div");
      card.className = "movie-card";
      const genreNames = movie.genre_ids.map(id => genreMap[id]).join(", ");
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <div class="movie-overlay">
          <h3>${movie.title}</h3>
          <p>Year: ${movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'} | ⭐ ${movie.vote_average}/10</p>
          <p>Genres: ${genreNames || 'N/A'}</p>
        </div>`;
      slider.appendChild(card);
      card.onclick = () => openMovieModal(movie.id);
    }

    document.getElementById(`${cat.title.replace(/\s/g, '')}Left`).addEventListener("click", () => {
      slider.scrollBy({ left: -270, behavior: "smooth" });
    });
    document.getElementById(`${cat.title.replace(/\s/g, '')}Right`).addEventListener("click", () => {
      slider.scrollBy({ left: 270, behavior: "smooth" });
    });
  }
}
async function createTVSliders() {
  const container = document.getElementById("slidersContainer");

  for (let cat of tvCategories) {
    const res = await fetch(cat.url);
    const data = await res.json();
    const shows = data.results.slice(0, 15);

    const section = document.createElement("div");
    section.className = "slider-section";
    section.innerHTML = `
      <h2 class="slider-title">${cat.title}</h2>
      <div class="movie-slider" id="${cat.title.replace(/\s/g, '')}TVSlider"></div>
      <div class="slider-arrow slider-left" id="${cat.title.replace(/\s/g, '')}TVLeft">&#10094;</div>
      <div class="slider-arrow slider-right" id="${cat.title.replace(/\s/g, '')}TVRight">&#10095;</div>`;
    container.appendChild(section);

    const slider = document.getElementById(`${cat.title.replace(/\s/g, '')}TVSlider`);

    for (let show of shows) {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}">
        <div class="movie-overlay">
          <h3>${show.name}</h3>
          <p>Rating: ⭐ ${show.vote_average}/10</p>
        </div>`;
      slider.appendChild(card);

      // ✅ plays episodes
      card.onclick = () => openTVShowModal(show.id);
    }

    document.getElementById(`${cat.title.replace(/\s/g, '')}TVLeft`).addEventListener("click", () => {
      slider.scrollBy({ left: -270, behavior: "smooth" });
    });
    document.getElementById(`${cat.title.replace(/\s/g, '')}TVRight`).addEventListener("click", () => {
      slider.scrollBy({ left: 270, behavior: "smooth" });
    });
  }
}
createTVSliders();

createSliders();
/* ===== Continue Watching (localStorage) ===== */
/* ===== Continue Watching (localStorage + slider arrows + clear button) ===== */

function saveToContinueWatching(movie) {
  let history = JSON.parse(localStorage.getItem("continueWatching")) || [];

  history = history.filter(item => item.id !== movie.id);
  history.unshift(movie);
  history = history.slice(0, 15);

  localStorage.setItem("continueWatching", JSON.stringify(history));
}

function clearContinueWatching() {
  localStorage.removeItem("continueWatching");
  loadContinueWatching();
}

function loadContinueWatching() {
  const section = document.getElementById("continueWatchingSection");
  const slider = document.getElementById("continueWatchingSlider");

  const history = JSON.parse(localStorage.getItem("continueWatching")) || [];

  if (history.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  slider.innerHTML = "";

  history.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <div class="movie-overlay"><h3>${movie.title}</h3></div>
    `;
    card.onclick = () => openMovieModal(movie.id);
    slider.appendChild(card);
  });

  // ✅ Arrow scroll control
  document.getElementById("CWLeft").onclick = () =>
    slider.scrollBy({ left: -270, behavior: "smooth" });

  document.getElementById("CWRight").onclick = () =>
    slider.scrollBy({ left: 270, behavior: "smooth" });
}

loadContinueWatching();

/* ===== MOVIE MODAL ===== */
/* ===== MOVIE MODAL WITH AUTO SERVER DETECTION ===== */
async function openMovieModal(movieId) {
  const modal = document.getElementById("movieModal");
  const modalContent = document.getElementById("modalContent");
  modal.classList.add("active");
  modalContent.innerHTML = "<h2 style='text-align:center;'>Loading...</h2>";

  // ✅ fetch movie data
  const [movieRes, creditsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`)
  ]);

  const movie = await movieRes.json();

  // ✅ SAVE TO WATCH HISTORY
  saveToContinueWatching(movie);
  loadContinueWatching();

  const credits = await creditsRes.json();

  const servers = [
  { name: "Server 1", url: `https://vidsrc.net/embed/movie?imdb=${movie.imdb_id}` },
  { name: "Server 2", url: `https://vidsrc.me/embed/movie?imdb=${movie.imdb_id}` },
  { name: "Server 3", url: `https://smashystream.com/embed/${movie.imdb_id}` },
  { name: "Server 4", url: `https://www.2embed.cc/embed/${movie.imdb_id}` },
  { name: "Server 5", url: `https://moviesapi.club/movie/${movie.imdb_id}` }
];


  const actors = credits.cast.slice(0, 12).map(a => `
    <div class="actor-card">
      <img src="${a.profile_path ? `https://image.tmdb.org/t/p/w185${a.profile_path}` : 'https://via.placeholder.com/100x150'}">
      <p>${a.name}</p>
    </div>
  `).join("");

  modalContent.innerHTML = `
    <div class="clearfix">
      <img class="poster" src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
      <h1>${movie.title}</h1>
      <p><strong>Release:</strong> ${movie.release_date} | ⭐ ${movie.vote_average}</p>
      <p><strong>Genres:</strong> ${movie.genres.map(g => g.name).join(", ")}</p>
      <p>${movie.overview}</p>

      <h2>Cast</h2>
      <div class="actors-list">${actors}</div>

      <center>
        <h2>Watch Movie</h2>
        <label><strong>Select Server:</strong></label>
        <select id="serverSelect" class="server-select">
          ${servers.map(s => `<option value="${s.url}">${s.name}</option>`).join("")}
        </select>

        <iframe id="movieFrame"
          width="100%" height="420" allowfullscreen
          style="border-radius:6px;border:2px solid white;margin-top:10px;">
        </iframe>
      </center>
    </div>
  `;

  const serverSelect = document.getElementById("serverSelect");
  const movieFrame = document.getElementById("movieFrame");

   movieFrame.src = serverSelect.value; // ✅ load instantly

  serverSelect.addEventListener("change", () => {
    movieFrame.src = serverSelect.value;
  });
}
/* ===== ANIME MODAL (SEPARATE FUNCTION) ===== */
async function openAnimeModal(animeId) {
  const modal = document.getElementById("movieModal");
  const modalContent = document.getElementById("modalContent");

  modal.classList.add("active");
  modalContent.innerHTML = "<h2 style='text-align:center;'>Loading...</h2>";

  const anime = await fetch(`https://api.themoviedb.org/3/tv/${animeId}?api_key=${API_KEY}`)
    .then(r => r.json());

  let episodesHTML = "";
  const totalEpisodes = anime.number_of_episodes;
  const season = 1; // default season for simplicity

  for (let ep = 1; ep <= totalEpisodes; ep++) {
    episodesHTML += `
      <button class="btn" onclick="playEpisode('${animeId}', '${season}', '${ep}')">
        Episode ${ep}
      </button>
    `;
  }

  modalContent.innerHTML = `
    <div class="clearfix">
      <img class="poster" src="https://image.tmdb.org/t/p/w300${anime.poster_path}">
      <h1>${anime.name}</h1>
      <p><strong>Seasons:</strong> ${anime.number_of_seasons}</p>
      <p><strong>Total Episodes:</strong> ${anime.number_of_episodes}</p>
      <p>${anime.overview}</p>

      <h2>Episodes</h2>
      <div style="display:flex; flex-wrap:wrap; gap:10px;">${episodesHTML}</div>

      <iframe id="movieFrame" width="100%" height="420" allowfullscreen style="margin-top:20px;"></iframe>
    </div>
  `;
}

function playEpisode(id, season, episode) {
  const frame = document.getElementById("movieFrame");
  frame.src = `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`;
}


function closeModal() {
  const modal = document.getElementById("movieModal");
  modal.classList.remove("active");

  const frame = document.getElementById("movieFrame");
  if (frame) frame.src = "";
}
</script>
  <script type="module">
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const profileImg = document.getElementById("profileImg");
const profileMenu = document.getElementById("profileMenu");

onAuthStateChanged(auth, user => {
  if(!user){
    window.location.href = "login.html";
  }
});

profileImg.addEventListener("click", () => {
  profileMenu.style.display =
    profileMenu.style.display === "block" ? "none" : "block";
});

window.logout = function(){
  signOut(auth).then(() => location.href="login.html");
};

// close menu if clicked outside
document.addEventListener("click", e => {
  if(!e.target.closest(".profile-container")){
    profileMenu.style.display = "none";
  }
});

</script>
 <script type="module">
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-app.js";
      import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "AIzaSyCG7awgsnkNtyOoqN7aRsRyAP4hNxZsvdo",
        authDomain: "chillbox-747f8.firebaseapp.com",
        projectId: "chillbox-747f8",
        storageBucket: "chillbox-747f8.firebasestorage.app",
        messagingSenderId: "808846502692",
        appId: "1:808846502692:web:fd3a70a823506207f261b1"
      };

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      // --- Step 4: Fetch movies ---
      async function showMovies() {
        const moviesCol = collection(db, "movies");
        const movieSnapshot = await getDocs(moviesCol);
        const movies = movieSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const container = document.getElementById("movies");
        container.innerHTML = "";
        movies.forEach(movie => {
          const div = document.createElement("div");
          div.innerHTML = `<h3>${movie.title}</h3><button onclick="playMovie('${movie.id}')">Play</button>`;
          container.appendChild(div);
        });
      }

      // --- Step 5: Record user activity ---
      async function playMovie(movieId) {
        try {
          await addDoc(collection(db, "user_activity"), {
            userId: "user123", // Replace with dynamic logged-in user ID
            contentType: "movie",
            contentId: movieId,
            datePlayed: new Date().toISOString()
          });
          alert("Movie played and activity recorded!");
        } catch (e) {
          console.error("Error recording activity: ", e);
        }
      }

      showMovies();
    </script>
  <script type="module">
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
<script type="module">
import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { getFirestore, addDoc, collection, serverTimestamp } from 
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCG7awgsnkNtyOoqN7aRsRyAP4hNxZsvdo",
  authDomain: "chillbox-747f8.firebaseapp.com",
  projectId: "chillbox-747f8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
</script>
<script>

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    lastLogin: new Date()
  }, { merge: true });
});
</script>
<script type="module">
import { auth, db } from "./firebase.js";
import { addDoc, collection } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.logActivity = async function(category, title) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(
    collection(db, "users", user.uid, "activity"),
    {
      category,
      title,
      time: new Date()
    }
  );
};
</script>
<script type="module">
import { saveHistory } from "./history.js";

window.watchMovie = function () {
  const movieTitle = document.getElementById("heroTitle").innerText;
  saveHistory("movie", movieTitle, "index.html");
  alert("Movie added to watch history");
};
</script>
<script type="module">
import { auth } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // not logged in → force login
    window.location.replace("login.html");
  }
});
</script>
<script type="module" src="auth-guard.js"></script>
<script type="module">
import { auth } from "./firebase.js";
import { signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.logout = function () {
  signOut(auth).then(() => {
    window.location.replace("login.html");
  });
};
</script>
  <script type="module">
import { addDoc, collection, serverTimestamp } from 
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

document.getElementById("play").onclick = async () => {
  await addDoc(collection(db, "activity_logs"), {
    userId: "guest_user",
    type: "movie",
    itemId: "movie_101",
    action: "play",
    timestamp: serverTimestamp()
  });

  alert("Saved to Firestore ✅");
};
</script>
  <script>
const menuToggle = document.getElementById("menuToggle");
const navbar = document.querySelector("nav.navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("show");
});
</script>
