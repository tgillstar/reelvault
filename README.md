# 🎬 ReelVault

A Netflix-style movie discovery app built with **Next.js**, **TailwindCSS**, **Firebase**, and **TMDB API**.

---

## 🚀 Features

- ✅ Browse popular movies from TMDB  
- ✅ Filter by **one or more genres**  
- ✅ **Keyword search** powered by TMDB’s keyword endpoint  
- ✅ Responsive **infinite-scrolling** movie grid  
- ✅ **Deduplication** logic to avoid showing the same movie twice  
- ✅ Featured “hero” banner with dynamic movie highlight  
- ✅ Beautiful card layout with posters, hover effects, and details  
- ✅ **Save favorites/watchlist** per user (admin-only) with heart toggle and animation  
- ✅ **Slide-out sidebar** navigation (profile, favorites count, clear filters)  
- ✅ Modal trailer preview (or fallback image if no trailer available)  
- ✅ Firebase **Authentication** with:
  - Guest login (anonymous, automatic 30-minute timeout via Firestore rules & app logic)  
  - Admin-only login (custom claim–based access)  
- ✅ Firestore writes guest user document immediately after login (no client wait)  
- ✅ Route protection via **role-based access control**  
- ✅ Optimized image loading with `next/image`  
- ✅ Graceful error handling (e.g., “Failed to load movies”)  
- ✅ Fully responsive UI (mobile, tablet, desktop) 

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 + TailwindCSS 4  
- **State & Context:** React Context API (AuthContext, FavoriteContext)  
- **Auth & Backend:** Firebase Auth + Firestore Rules (guest session expiry, custom claims)  
- **API:** The Movie Database (TMDB)  
- **Hosting:** Vercel  
- **Other Tools:** PostCSS, Autoprefixer, Firebase Admin SDK (for custom claims)  

---

## 🛠 Setup Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/reelvault.git
cd reelvault
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env.local` file:**

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

📝 **TMDB Key**: Get it from [themoviedb.org](https://www.themoviedb.org/).  
📝 **Firebase**: Set up a project in [Firebase Console](https://console.firebase.google.com/) and enable **Email/Password** and **Anonymous** auth methods.

4. **Run the development server:**

```bash
npm run dev
```

Visit the app at `http://localhost:3000`

---

## 🔐 Authentication Behavior

* 🧑‍💼 **Admin Users**

  1. Create account in Firebase Console
  2. Run `scripts/setCustomClaim.js` to assign `"admin"` role
  3. **Also** manually create a matching Firestore `users/{uid}` document
* 👤 **Guest Users**

  * Anonymous login → writes `{ isGuest: true, createdAt, lastLogin }`
  * Auto-sign-out after 30 min (enforced via Firestore rules & client)
* 🔒 **Protected Routes**

  * `/` — needs authenticated guest or admin
  * `/unauthorized` — shown on access denial

---

## 🚧 Current Progress

* ✅ Basic Next.js + TailwindCSS scaffold
* ✅ TMDB API integration (popular, discover, genres)
* ✅ Infinite scroll + deduplication of movie list
* ✅ Firebase Auth (guest + admin) & Firestore session docs
* ✅ Role-based route protection & custom claims setup
* ✅ Sidebar nav (profile modal, favorites, clear filters)
* ✅ Keyword search integration & “All”/“Favorites” toggle
* ✅ Favorites context + heart-toggle button with local caching
* ✅ Error handling & loading states

---

## ✨ Future Enhancements

* 🚧 Search for movies by title (global search)
* 🚧 Improve accessibility (ARIA roles, keyboard navigation)
* 🚧 Responsive top nav with profile dropdown
* 🚧 Admin dashboard (analytics, manage favorites)
* 🚧 Export user watchlists / shareable URLs

---

## ⚡ Credits

- Movie data from [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Authentication and hosting via [Firebase](https://firebase.google.com/)
- Built with ❤️ by **Tiffany Gill**