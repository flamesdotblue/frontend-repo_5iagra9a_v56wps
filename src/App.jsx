import React, { useMemo, useState } from 'react';
import HeroSection from './components/HeroSection';
import SearchBar from './components/SearchBar';
import ComparisonGrid from './components/ComparisonGrid';
import ChatAssistant from './components/ChatAssistant';

const AFFILIATE_IDS = {
  amazon: 'aff-amz-123',
  flipkart: 'aff-flk-456',
  snapdeal: 'aff-snp-789',
  meesho: 'aff-msh-321',
};

function affiliateUrlFor(store, productId) {
  const id = AFFILIATE_IDS[store] || 'aff-generic';
  const baseMap = {
    amazon: `https://www.amazon.in/dp/${productId}?tag=${id}`,
    flipkart: `https://www.flipkart.com/item/${productId}?affid=${id}`,
    snapdeal: `https://www.snapdeal.com/product/${productId}?utm_source=${id}`,
    meesho: `https://meesho.com/item/${productId}?utm_campaign=${id}`,
  };
  return baseMap[store] || `https://example.com/product/${productId}?ref=${id}`;
}

async function mockFetchDeals(query) {
  await new Promise((r) => setTimeout(r, 800));
  const base = [
    {
      id: 'amz-001',
      store: 'amazon',
      title: `${query} – Amazon`,
      price: 1799,
      origPrice: 2499,
      rating: 4.3,
      deliveryDays: 2,
      image: 'https://images.unsplash.com/photo-1695740633675-d060b607f5c4?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjE1MDAxMzd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      limitedTime: true,
      sentimentScore: 0.68,
    },
    {
      id: 'flk-002',
      store: 'flipkart',
      title: `${query} – Flipkart`,
      price: 1699,
      origPrice: 2199,
      rating: 4.1,
      deliveryDays: 3,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop',
      limitedTime: false,
      sentimentScore: 0.62,
    },
    {
      id: 'snp-003',
      store: 'snapdeal',
      title: `${query} – Snapdeal`,
      price: 1899,
      origPrice: 2399,
      rating: 4.0,
      deliveryDays: 5,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop',
      limitedTime: false,
      sentimentScore: 0.58,
    },
    {
      id: 'msh-004',
      store: 'meesho',
      title: `${query} – Meesho`,
      price: 1649,
      origPrice: 2099,
      rating: 4.2,
      deliveryDays: 4,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop',
      limitedTime: true,
      sentimentScore: 0.6,
    },
  ].map((i) => ({ ...i, affiliateUrl: affiliateUrlFor(i.store, i.id) }));

  return base;
}

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    const deals = await mockFetchDeals(query);
    setItems(deals);
    setLoading(false);
  };

  const smartSummary = useMemo(() => {
    if (!items.length) return '';
    const cheapest = [...items].sort((a, b) => a.price - b.price)[0];
    const bestRated = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    return `Cheapest is ₹${cheapest.price.toLocaleString()} on ${cheapest.store}. Best rated is ${bestRated.rating}★ on ${bestRated.store}.`;
  }, [items]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <HeroSection appName="SmartFindr" tagline="Compare real-time deals with AI insight" />

        <div className="mx-auto mt-8 max-w-3xl">
          <SearchBar onSearch={handleSearch} />
          {loading && (
            <div className="mt-4 text-center text-slate-400">Gathering deals…</div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ComparisonGrid items={items} />
          </div>
          <div className="lg:col-span-1">
            <ChatAssistant items={items} />
            {smartSummary && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                {smartSummary}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400 sm:flex-row">
          <div>© {new Date().getFullYear()} SmartFindr · Smarter shopping starts here.</div>
          <div className="opacity-75">Affiliate links may earn us a commission.</div>
        </footer>
      </div>
    </div>
  );
}
