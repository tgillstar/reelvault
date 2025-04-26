# ReelVault 🎬

A movie discovery and favorites app built with Next.js and TailwindCSS.

## Setup

This project was bootstrapped with [Create Next App](https://nextjs.org/docs/api-reference/create-next-app).

To get started locally:

```bash
git clone https://github.com/your-username/reelvault.git
cd reelvault
npm install
```

### Environment Variables

This project uses The Movie Database (TMDB) API to fetch movie data.

1. Create a free TMDB account at [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Go to your account settings → API → Request an API key
3. Create a `.env.local` file at the root of your project and add the following:

```bash
TMDB_API_KEY=your_tmdb_api_key_here
```

✅ Make sure your `.env.local` is **never committed** to GitHub (already handled by `.gitignore`).

### Running the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Current Progress

- ✅ Initial project scaffold with Next.js 15 + TailwindCSS 4
- ✅ Secure environment variable setup for TMDB API
- ✅ Fetch and display popular movies dynamically from TMDB API
- ✅ Server-side rendering with optimized Next.js `Image` component
- ✅ TailwindCSS-based responsive grid layout

---