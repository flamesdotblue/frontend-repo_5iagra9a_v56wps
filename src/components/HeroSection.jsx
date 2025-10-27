import React from 'react';
import Spline from '@splinetool/react-spline';

const stores = [
  { name: 'Amazon', color: 'bg-yellow-400 text-black' },
  { name: 'Flipkart', color: 'bg-blue-600 text-white' },
  { name: 'Snapdeal', color: 'bg-red-500 text-white' },
  { name: 'Meesho', color: 'bg-pink-500 text-white' },
];

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden rounded-b-3xl">
      <div className="absolute inset-0">
        {/* 3D Scene */}
        <Spline
          scene="https://prod.spline.design/z0e8vE1q0n4s8J6o/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(99,102,241,0.35),transparent)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          SmartFindr
        </h1>
        <p className="mt-4 max-w-2xl text-balance text-white/80">
          Compare real-time deals across your favorite stores. Get the best price,
          fastest delivery, and smartest value in seconds.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {stores.map((s) => (
            <span
              key={s.name}
              className={`inline-flex items-center rounded-full ${s.color} px-3 py-1 text-sm font-medium shadow/50 shadow-black/20 ring-1 ring-white/10`}
            >
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
