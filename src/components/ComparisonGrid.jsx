import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Truck, BadgePercent } from 'lucide-react';

function formatCurrency(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function ComparisonGrid({ items }) {
  const bestPriceId = useMemo(() => {
    if (!items?.length) return null;
    return items.reduce((min, it) => (it.price < min.price ? it : min), items[0]).id;
  }, [items]);

  const bestQualityId = useMemo(() => {
    if (!items?.length) return null;
    return items
      .slice()
      .sort((a, b) => b.rating - a.rating || a.price - b.price)[0].id;
  }, [items]);

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {items.map((item) => {
          const discount = Math.max(0, Math.round((1 - item.price / item.origPrice) * 100));
          const smartValue = Math.round(
            (0.5 * (1 / (item.price + 1))) * 100000 +
              20 * item.rating +
              10 * (item.sentimentScore ?? 0) +
              (10 - Math.min(10, item.deliveryDays))
          );
          const isBestPrice = item.id === bestPriceId;
          const isBestQuality = item.id === bestQualityId;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-xl backdrop-blur-sm"
            >
              <div className="absolute right-4 top-4 flex gap-2">
                {isBestPrice && (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                    Best price
                  </span>
                )}
                {isBestQuality && (
                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/30">
                    Best quality
                  </span>
                )}
                {item.limitedTime && (
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30">
                    Limited time
                  </span>
                )}
              </div>

              <div className="mb-3 aspect-video w-full overflow-hidden rounded-xl bg-white/5">
                {item.image ? (
                  <img src={item.image} alt={item.store} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/60">No image</div>
                )}
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{item.store}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-300" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-sky-300" />
                      <span>{item.deliveryDays} days</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatCurrency(item.price)}</div>
                  <div className="text-sm text-white/60 line-through">{formatCurrency(item.origPrice)}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <BadgePercent className="h-4 w-4" />
                  <span>{discount}% off</span>
                </div>
                <div className="rounded-lg bg-indigo-500/20 px-2 py-1 text-xs text-indigo-200 ring-1 ring-indigo-400/30">
                  Smart Value Score: <span className="font-semibold">{smartValue}</span>
                </div>
              </div>

              <a
                href={item.affiliateUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:from-indigo-400 hover:to-fuchsia-400"
              >
                Buy Now
              </a>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
