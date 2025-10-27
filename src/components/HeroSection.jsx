import React from 'react';
import Spline from '@splinetool/react-spline';
import { Sparkles } from 'lucide-react';

const StoreLogo = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="h-8 w-8 rounded-full bg-white/10 p-1 ring-1 ring-white/20 backdrop-blur"
  />
);

const HeroSection = ({ appName = 'SmartFindr', tagline = 'Shop Smart. Spend Less. Earn More.', children }) => {
  return (
    <section className="relative h-[70vh] min-h-[540px] w-full overflow-hidden rounded-2xl bg-slate-900/60">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Gradient overlays for glow, non-blocking */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,99,255,0.25),transparent_50%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center text-white">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs backdrop-blur-md">
          <Sparkles size={14} />
          <span className="opacity-90">AI-powered affiliate deal intelligence</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
          {appName}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm opacity-90 md:text-base">
          {tagline} Compare prices, ratings, delivery, and reviews across top stores with an AI Smart Value Score.
        </p>

        <div className="mt-8 w-full max-w-2xl">{children}</div>

        <div className="mt-6 flex items-center gap-3 opacity-90">
          <StoreLogo src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
          <StoreLogo src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flipkart_logo.png" alt="Flipkart" />
          <StoreLogo src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Snapdeal_Logo.png" alt="Snapdeal" />
          <StoreLogo src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Meesho_Logo.png" alt="Meesho" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
