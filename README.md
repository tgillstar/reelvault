# 🎬 ReelVault

A Netflix-style movie discovery app built with Next.js, TailwindCSS, and TMDB API.

---

## 🚀 Features

- ✅ Browse popular movies from TMDB
- ✅ Responsive infinite scrolling feed
- ✅ Beautiful card layout with poster images and ratings
- ✅ Smooth movie detail **modal pop-up** when clicking a movie
- ✅ Graceful API error handling ("Failed to load movies" message)
- ✅ Automatic deduplication of movies (no duplicates even across pages)
- ✅ Fully mobile-first, responsive design
- ✅ Optimized image loading using `next/image`
- ✅ Deployed to Vercel for production hosting

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 + TailwindCSS 4
- **API:** The Movie Database (TMDB) API
- **Hosting:** Vercel
- **Other Tools:** PostCSS, Autoprefixer

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
```

(You can get a free TMDB API key by creating an account at [themoviedb.org](https://www.themoviedb.org/).)

4. **Run the development server:**

```bash
npm run dev
```

The app should now be running at `http://localhost:3000` 🎬

---

## 📸 Screenshots

_(add screenshots here if you want later — optional but portfolio friendly!)_

---

## 🚧 Current Progress

- ✅ Initial project scaffold with Next.js 15 + TailwindCSS 4
- ✅ Secure environment variable setup for TMDB API (`.env.local`)
- ✅ Fetch and dynamically display popular movies from TMDB API
- ✅ Responsive grid layout using TailwindCSS (mobile-first design)
- ✅ Optimized image loading using Next.js `Image` component
- ✅ Infinite scrolling with Intersection Observer
- ✅ API error handling with graceful error messages
- ✅ Deduplication of movies across pages to ensure unique rendering
- ✅ Movie detail modal pop-up on card click (poster + overview + details)
- ✅ Smooth modal open/close UX (background overlay, flex layout)

---

## ✨ Future Enhancements (Optional Ideas)

- Movie genre filtering
- Search functionality
- Hover previews (like Netflix mini-trailers)
- Favorites and Watchlist feature with Firebase
- Pagination improvements (load more button for UX options)

---

## ⚡ Credits

- Movie data powered by [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)
- Developed by **Your Name**

---