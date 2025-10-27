import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      await onSearch?.(query.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-2xl">
      <div className="group relative flex items-center rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur transition focus-within:border-emerald-400/60">
        <Search className="ml-1 h-5 w-5 text-slate-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, e.g. wireless earbuds"
          className="ml-2 w-full bg-transparent py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="ml-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Compare'}
        </button>
      </div>
      <div className="pointer-events-none absolute -inset-x-10 -top-2 bottom-0 -z-0 blur-2xl transition duration-500 group-focus-within:opacity-100" aria-hidden>
        <div className="mx-auto h-full max-w-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-fuchsia-500/20" />
      </div>
    </form>
  );
}
