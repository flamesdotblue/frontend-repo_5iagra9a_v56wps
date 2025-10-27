import React from 'react';
import { Star, Truck, BadgePercent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function smartValueScore(item) {
  const priceFactor = item.origPrice ? Math.min(1, (item.origPrice - item.price) / item.origPrice * 1.5) : 0.5;
  const ratingFactor = (item.rating || 0) / 5; 
  const deliveryFactor = item.deliveryDays ? Math.max(0, 1 - item.deliveryDays / 7) : 0.5;
  const sentimentFactor = (item.sentimentScore ?? 0.5);
  const score = (priceFactor * 0.35 + ratingFactor * 0.35 + deliveryFactor * 0.15 + sentimentFactor * 0.15) * 100;
  return Math.round(score);
}

export default function ComparisonGrid({ items = [] }) {
  if (!items.length) {
    return (
      <div className="text-center text-slate-400">Search to compare deals from multiple stores.</div>
    );
  }

  const bestPrice = [...items].sort((a, b) => a.price - b.price)[0]?.id;
  const bestQuality = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]?.id;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {items.map((item) => {
          const score = smartValueScore(item);
          const isBestPrice = item.id === bestPrice;
          const isBestQuality = item.id === bestQuality;
          const discount = item.origPrice ? Math.round(((item.origPrice - item.price) / item.origPrice) * 100) : null;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur shadow hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400" /> {item.rating ?? '—'}</span>
                    <span className="text-slate-500">•</span>
                    <span className="flex items-center gap-1"><Truck className="h-4 w-4 text-emerald-400" /> {item.deliveryDays ? `${item.deliveryDays}d` : '—'}</span>
                  </div>
                </div>
                <img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">₹{item.price.toLocaleString()}</div>
                  {item.origPrice && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="line-through">₹{item.origPrice.toLocaleString()}</span>
                      {discount !== null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300"><BadgePercent className="h-3 w-3" /> {discount}%</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Smart Value Score</div>
                  <div className="text-xl font-semibold text-emerald-400">{score}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {isBestPrice && (
                  <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Best price</span>
                )}
                {isBestQuality && (
                  <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">Best quality</span>
                )}
                {item.limitedTime && (
                  <span className="inline-flex items-center rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-2 py-1 text-xs text-fuchsia-300">Limited time</span>
                )}
              </div>

              <a
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-600"
                href={item.affiliateUrl}
                target="_blank"
                rel="noreferrer"
              >
                Buy Now
              </a>

              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
