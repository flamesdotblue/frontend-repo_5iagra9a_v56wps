import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = 'Search any product (e.g., iPhone 15, Nike Shoes, Earbuds)...' }) => {
  const [query, setQuery] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query.trim());
  };

  return (
    <form onSubmit={submit} className="group relative">
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0A84FF] via-[#6C63FF] to-[#8A2BE2] opacity-60 blur-md transition duration-300 group-hover:opacity-90" />
      <div className="relative flex items-center rounded-2xl bg-slate-900/80 p-2 pl-4 ring-1 ring-white/10 backdrop-blur-xl">
        <Search className="mr-2 h-5 w-5 text-white/70" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm text-white placeholder-white/50 outline-none md:text-base"
        />
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-[#0A84FF] to-[#6C63FF] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
