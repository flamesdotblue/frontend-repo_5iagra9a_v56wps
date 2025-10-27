import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import SearchBar from './components/SearchBar';
import ComparisonGrid from './components/ComparisonGrid';
import ChatAssistant from './components/ChatAssistant';

const affiliateIds = {
  Amazon: 'yourAmazonID',
  Flipkart: 'yourFlipkartID',
  Meesho: 'yourMeeshoID',
  Snapdeal: 'yourSnapdealID',
};

const affiliateUrlFor = (store, productId) => {
  switch (store) {
    case 'Amazon':
      return `https://www.amazon.in/dp/${productId}/?tag=${affiliateIds.Amazon}`;
    case 'Flipkart':
      return `https://www.flipkart.com/item/${productId}?affid=${affiliateIds.Flipkart}`;
    case 'Snapdeal':
      return `https://www.snapdeal.com/product/${productId}?utm_source=aff_${affiliateIds.Snapdeal}`;
    case 'Meesho':
      return `https://www.meesho.com/item/${productId}?utm_source=aff_${affiliateIds.Meesho}`;
    default:
      return '#';
  }
};

const mockFetch = async (query) => {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 800));
  const title = `${query} — Top Picks`;
  const baseImg = `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop`;
  const id = (prefix) => `${prefix}-${Math.abs(hashCode(query)) % 100000}`;
  const items = [
    { store: 'Amazon', price: 74999, origPrice: 79999, rating: 4.6, deliveryDays: 2, sentiment: 'positive', title, image: baseImg, productId: id('amz'), limitedTime: true },
    { store: 'Flipkart', price: 73999, origPrice: 78999, rating: 4.5, deliveryDays: 3, sentiment: 'positive', title, image: baseImg, productId: id('flp') },
    { store: 'Snapdeal', price: 75999, origPrice: 81999, rating: 4.2, deliveryDays: 5, sentiment: 'mixed', title, image: baseImg, productId: id('snp') },
    { store: 'Meesho', price: 72999, origPrice: 76999, rating: 4.1, deliveryDays: 6, sentiment: 'mixed', title, image: baseImg, productId: id('msh') },
  ];
  return items.map((i) => ({ ...i, affiliateUrl: affiliateUrlFor(i.store, i.productId) }));
};

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const onSearch = async (q) => {
    setQuery(q);
    setLoading(true);
    const data = await mockFetch(q);
    setLoading(false);
    // Compute Smart Score context once for chat
    const prices = data.map((i) => i.price);
    const deliveries = data.map((i) => i.deliveryDays);
    const ratings = data.map((i) => i.rating);
    const stats = {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minDelivery: Math.min(...deliveries),
      maxDelivery: Math.max(...deliveries),
      maxRating: Math.max(...ratings),
    };
    const enriched = data.map((i) => {
      const ratingScore = i.rating / 5;
      const priceScore = 1 - (i.price - stats.minPrice) / Math.max(1, stats.maxPrice - stats.minPrice);
      const deliveryScore = 1 - (i.deliveryDays - stats.minDelivery) / Math.max(1, stats.maxDelivery - stats.minDelivery);
      const sentimentScore = (i.sentiment === 'positive' ? 1 : i.sentiment === 'mixed' ? 0.6 : 0.35);
      const smart = Math.round(100 * (0.4 * ratingScore + 0.35 * priceScore + 0.15 * deliveryScore + 0.1 * sentimentScore));
      return { ...i, smartScore: smart };
    });
    setResults(enriched);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <HeroSection appName="SmartFindr" tagline="Shop Smart. Spend Less. Earn More.">
          <SearchBar onSearch={onSearch} />
        </HeroSection>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ComparisonGrid items={results} loading={loading} query={query} />
          </div>
          <div className="h-[520px] lg:sticky lg:top-6">
            <ChatAssistant context={{ items: results, query }} />
          </div>
        </div>

        <footer className="mt-12 flex flex-col items-center justify-center gap-1 border-t border-white/10 pt-6 text-center text-xs text-white/60">
          <div>SmartFindr — AI-powered affiliate deal comparison</div>
          <div>Find deals. Earn smarter. Highlighting best price, quality, and value with glowing neon UI.</div>
        </footer>
      </div>
    </div>
  );
}
