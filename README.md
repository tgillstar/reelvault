# 🎬 ReelVault

A Netflix-style movie discovery app built with **Next.js**, **TailwindCSS**, **Firebase**, and **TMDB API**.

---

## 🚀 Features

- ✅ Browse popular movies from TMDB
- ✅ Filter by **one or more genres**
- ✅ Responsive infinite scrolling movie grid
- ✅ Featured "hero" banner with dynamic movie highlight
- ✅ Beautiful card layout with posters, hover effects, and details
- ✅ Modal trailer preview (or fallback image if no trailer available)
- ✅ Firebase **Authentication** with:
  - Guest login (anonymous, with automatic 30-minute timeout via Firestore rules)
  - Admin-only account login (custom claim-based access)
- ✅ Firestore writes guest user document immediately after login (no client wait)
- ✅ Route protection via **role-based access control**
- ✅ Optimized image loading with `next/image`
- ✅ Graceful error handling (e.g., “Failed to load movies”)
- ✅ Fully responsive UI (mobile, tablet, desktop)
- ✅ Deployed to Vercel for production hosting

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 + TailwindCSS 4
- **Auth & Backend:** Firebase Auth + Firestore Rules
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

- 🧑‍💼 **Admin Users**: Create manually in Firebase Console → use `scripts/setCustomClaim.js` to assign `"admin"` role via custom claims.
  - Note: You also need to **manually create a Firestore user document** for each admin to avoid app errors.
- 👤 **Guest Users**:
  - Sign in anonymously.
  - Firestore document is created with `isGuest: true` and `createdAt` timestamp.
  - Automatically signed out after 30 minutes (enforced via Firestore rules and app logic).
- 🔒 Protected Routes:
  - `/` — requires authenticated `admin` or `guest`
  - `/unauthorized` — shown if access is denied

---

## 📸 Screenshots

_(Add screenshots later for visual appeal — homepage, modal, genre filter, login page, etc.)_

---

## 🚧 Current Progress

- ✅ Initial project scaffold with Next.js + TailwindCSS
- ✅ Secure `.env.local` setup with TMDB and Firebase
- ✅ Dynamic infinite scrolling movie list
- ✅ Firebase authentication integration
- ✅ Guest session document creation and expiration enforcement
- ✅ Admin and guest role detection
- ✅ Genre filtering (multi-select and mobile dropdown)
- ✅ Login page with email/password and guest login logic
- ✅ Auth state persistence + route protection
- ✅ Modal preview with trailer or fallback image
- ✅ Deduplication logic + smooth UX handling
- ✅ Guest session expiration (auto sign-out after 30 minutes)

---

## ✨ Future Enhancements

- ✅ Save favorites/watchlist per user (admin-only)
- 🚧 Search for movies by title
- 🚧 Improve accessibility (ARIA roles, keyboard nav)
- 🚧 Responsive navigation header with profile dropdown
- 🚧 Admin dashboard for analytics or managing favorites

---

## ⚡ Credits

- Movie data from [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Authentication and hosting via [Firebase](https://firebase.google.com/)
- Built with ❤️ by **Tiffany Gill**