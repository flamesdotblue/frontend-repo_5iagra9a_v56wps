import React, { useMemo } from 'react';
import { Star, Store, Truck, Tag, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const brandColors = {
  Amazon: 'from-orange-500 to-amber-500',
  Flipkart: 'from-sky-500 to-blue-500',
  Snapdeal: 'from-rose-500 to-pink-500',
  Meesho: 'from-fuchsia-500 to-pink-500',
  Myntra: 'from-purple-500 to-violet-500',
};

function smartValueScore(item, stats) {
  // Normalize components: rating(0-1), price inverse, delivery inverse
  const ratingScore = item.rating / 5; // 0..1
  const priceScore = 1 - (item.price - stats.minPrice) / Math.max(1, stats.maxPrice - stats.minPrice);
  const deliveryScore = 1 - (item.deliveryDays - stats.minDelivery) / Math.max(1, stats.maxDelivery - stats.minDelivery);
  const sentimentScore = (item.sentiment === 'positive' ? 1 : item.sentiment === 'mixed' ? 0.6 : 0.35);
  const score = 100 * (0.4 * ratingScore + 0.35 * priceScore + 0.15 * deliveryScore + 0.1 * sentimentScore);
  return Math.round(Math.min(100, Math.max(0, score)));
}

const ComparisonGrid = ({ items = [], loading = false, query = '' }) => {
  const stats = useMemo(() => {
    if (!items.length) return null;
    const prices = items.map((i) => i.price);
    const deliveries = items.map((i) => i.deliveryDays);
    const ratings = items.map((i) => i.rating);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minDelivery: Math.min(...deliveries),
      maxDelivery: Math.max(...deliveries),
      maxRating: Math.max(...ratings),
    };
  }, [items]);

  const enriched = useMemo(() => {
    if (!items.length || !stats) return [];
    return items.map((i) => ({ ...i, smartScore: smartValueScore(i, stats) }));
  }, [items, stats]);

  const bestPrice = useMemo(() => (stats ? stats.minPrice : null), [stats]);
  const bestRating = useMemo(() => (stats ? stats.maxRating : null), [stats]);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white/90">Comparison Results</h3>
          <p className="text-sm text-white/60">{query ? `Showing best offers for “${query}”` : 'Search a product to compare across stores'}</p>
        </div>
        {!!enriched.length && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            <Sparkles size={14} /> AI Smart Value Score
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 animate-pulse rounded-2xl bg-white/5 ring-1 ring-white/10"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {enriched.map((item) => {
              const isBestPrice = item.price === bestPrice;
              const isBestRating = item.rating === bestRating;
              return (
                <div
                  key={item.store}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10 backdrop-blur-xl"
                >
                  <div className={`absolute -inset-0.5 -z-[1] rounded-2xl bg-gradient-to-r ${brandColors[item.store] || 'from-cyan-500 to-blue-500'} opacity-30 blur-xl transition duration-500 group-hover:opacity-60`} />

                  <div className="mb-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-white/90">
                      <Store className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.store}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">{item.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-28 w-28 flex-none rounded-xl object-cover ring-1 ring-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-2 text-sm font-medium text-white/90">{item.title}</h4>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-sm text-white/90 ring-1 ring-white/10">
                          <Tag className="h-4 w-4 text-emerald-400" />
                          <span className="font-semibold">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs text-white/80 ring-1 ring-white/10">
                          <Truck className="h-4 w-4 text-sky-400" />
                          <span>{item.deliveryDays}d</span>
                        </div>
                        <div className="ml-auto inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#0A84FF] to-[#6C63FF] px-2 py-1 text-xs font-semibold text-white">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{item.smartScore}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {isBestPrice && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                            Best Price
                          </span>
                        )}
                        {isBestRating && (
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300 ring-1 ring-blue-500/30">
                            Best Quality
                          </span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                          item.sentiment === 'positive'
                            ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
                            : item.sentiment === 'mixed'
                            ? 'bg-yellow-500/15 text-yellow-300 ring-yellow-500/30'
                            : 'bg-rose-500/15 text-rose-300 ring-rose-500/30'
                        }`}>
                          {item.sentiment === 'positive' ? 'Highly Rated' : item.sentiment === 'mixed' ? 'Mixed Reviews' : 'Caution'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/60">
                    <span>Free returns available</span>
                    <button className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-white/80 ring-1 ring-white/10 transition hover:bg-white/10">
                      <Heart className="h-3.5 w-3.5" />
                      Wishlist
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !enriched.length && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
          Start by searching a product. We’ll compare across popular stores and highlight the best deals for you.
        </div>
      )}
    </div>
  );
};

export default ComparisonGrid;
