'use client';

import { useState } from 'react';

export default function KeywordSearch({ onKeywordSelect, onClearSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/keyword?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('[KeywordSearch]: Failed to fetch keywords:', err);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    onClearSearch();         // tell HomeContent to reset the grid
    onKeywordSelect(null);   // clear HomeContent’s selectedKeyword
  };

  return (
    <div className="mb-6">
      <h3 className="text-left text-sm font-medium text-white mb-2">Keyword Search</h3>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="w-full p-2 rounded bg-white text-black mb-2"
        placeholder="e.g. space, hacker, romance"
      />

      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 px-3 py-2 rounded text-white text-sm hover:bg-blue-700 transition"
      >
        Search
      </button>
      <button
        onClick={handleClear}
        className="w-full bg-red-600 px-3 py-2 rounded text-white text-sm hover:bg-red-700 transition"
      >
        Clear
      </button>

      <ul className="mt-3 space-y-1 text-sm">
        {results.map((keyword) => (
          <li key={keyword.id}>
            <button
              onClick={() => onKeywordSelect(keyword)}
              className="text-blue-300 hover:underline text-left"
            >
              {keyword.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
