import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('iphone 15');

  const submit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={submit}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_10%_-20%,rgba(99,102,241,0.25),transparent)]" />
        <div className="relative flex items-center gap-3 p-3">
          <Search className="h-5 w-5 text-white/80" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, e.g. 'noise cancelling headphones'"
            className="h-12 flex-1 bg-transparent text-base text-white placeholder-white/50 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Searching…' : 'Compare'}
          </button>
        </div>
      </form>
    </div>
  );
}
