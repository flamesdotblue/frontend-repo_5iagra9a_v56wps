import React, { useMemo, useState } from 'react';
import HeroSection from './components/HeroSection.jsx';
import SearchBar from './components/SearchBar.jsx';
import ComparisonGrid from './components/ComparisonGrid.jsx';
import ChatAssistant from './components/ChatAssistant.jsx';

const AFFILIATE_IDS = {
  amazon: 'smartfindr-21',
  flipkart: 'smartfindr',
  snapdeal: 'smartfindr',
  meesho: 'smartfindr',
};

function buildAffiliateUrl(store, productQuery) {
  const q = encodeURIComponent(productQuery);
  switch (store.toLowerCase()) {
    case 'amazon':
      return `https://www.amazon.in/s?k=${q}&tag=${AFFILIATE_IDS.amazon}`;
    case 'flipkart':
      return `https://www.flipkart.com/search?q=${q}&affid=${AFFILIATE_IDS.flipkart}`;
    case 'snapdeal':
      return `https://www.snapdeal.com/search?keyword=${q}&utm_source=aff_prog&utm_campaign=afts&offer_id=${AFFILIATE_IDS.snapdeal}`;
    case 'meesho':
      return `https://www.meesho.com/search?q=${q}&utm_source=aff&affid=${AFFILIATE_IDS.meesho}`;
    default:
      return '#';
  }
}

async function mockFetchDeals(query) {
  // Simulate a network call
  await new Promise((r) => setTimeout(r, 700));
  const baseImages = {
    Amazon:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop',
    Flipkart:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    Snapdeal:
      'https://images.unsplash.com/photo-1526178611998-6a3b63b2702f?q=80&w=1200&auto=format&fit=crop',
    Meesho:
      'https://images.unsplash.com/photo-1546421845-6471bdcf3cf4?q=80&w=1200&auto=format&fit=crop',
  };

  const stores = ['Amazon', 'Flipkart', 'Snapdeal', 'Meesho'];
  return stores.map((store, i) => {
    const price = Math.round(30000 + Math.random() * 30000 - i * 1500);
    const origPrice = price + Math.round(2000 + Math.random() * 6000);
    const rating = 3.6 + Math.random() * 1.4;
    const deliveryDays = 2 + Math.floor(Math.random() * 6);
    const sentimentScore = Math.round(Math.random() * 10) / 10;
    const limitedTime = Math.random() > 0.65;

    return {
      id: `${store}-${Date.now()}-${i}`,
      store,
      price,
      origPrice,
      rating,
      deliveryDays,
      sentimentScore,
      limitedTime,
      image: baseImages[store],
      affiliateUrl: buildAffiliateUrl(store, query),
    };
  });
}

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const summary = useMemo(() => {
    if (!items.length) return null;
    const cheapest = items.reduce((min, it) => (it.price < min.price ? it : min), items[0]);
    const bestRated = items.slice().sort((a, b) => b.rating - a.rating || a.price - b.price)[0];
    return { cheapest, bestRated };
  }, [items]);

  const onSearch = async (query) => {
    try {
      setError('');
      setLoading(true);
      const data = await mockFetchDeals(query);
      setItems(data);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <HeroSection />

      <main className="mx-auto -mt-20 flex w-full max-w-6xl flex-col gap-8 px-6">
        <SearchBar onSearch={onSearch} loading={loading} />

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200">
            {error}
          </div>
        )}

        {summary && (
          <div className="mx-auto w-full max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 backdrop-blur-sm">
            <span className="font-semibold text-white">Smart summary:</span>{' '}
            Cheapest on <span className="text-emerald-300">{summary.cheapest.store}</span> at ₹
            {Math.round(summary.cheapest.price)}. Best rated on{' '}
            <span className="text-sky-300">{summary.bestRated.store}</span> with rating{' '}
            {summary.bestRated.rating.toFixed(1)}.
          </div>
        )}

        <ComparisonGrid items={items} />

        <ChatAssistant items={items} />
      </main>

      <footer className="mx-auto mt-16 w-full max-w-6xl px-6 pb-12 text-center text-white/60">
        © {new Date().getFullYear()} SmartFindr · Compare smarter. Save bigger.
      </footer>
    </div>
  );
}
