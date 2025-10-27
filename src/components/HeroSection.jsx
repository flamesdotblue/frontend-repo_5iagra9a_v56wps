import React from 'react';
import Spline from '@splinetool/react-spline';

const storeLogos = [
  { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Flipkart', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Flipkart_logo.png' },
  { name: 'Snapdeal', url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Snapdeal_logo.png' },
  { name: 'Meesho', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Meesho-logo.png' },
];

export default function HeroSection({ appName = 'SmartFindr', tagline = 'Find the smartest deals across stores' }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-xl">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/YmXQyIu0iYB2Vw8F/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/70 to-slate-950/95" />

      <div className="relative z-10 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Live deal intelligence
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {appName}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            {tagline}. Compare prices, ratings, delivery time, and sentiment — then buy with confidence.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 opacity-90">
            {storeLogos.map((s) => (
              <div key={s.name} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
                <img src={s.url} alt={s.name} className="h-6 w-auto" />
                <span className="text-sm text-slate-200">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
