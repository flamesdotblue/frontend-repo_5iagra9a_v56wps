import React, { useMemo, useRef, useState } from 'react';

export default function ChatAssistant({ items }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me for the cheapest or the best rated option.' },
  ]);
  const inputRef = useRef(null);

  const cheapest = useMemo(() => {
    if (!items?.length) return null;
    return items.reduce((min, it) => (it.price < min.price ? it : min), items[0]);
  }, [items]);

  const bestRated = useMemo(() => {
    if (!items?.length) return null;
    return items
      .slice()
      .sort((a, b) => b.rating - a.rating || a.price - b.price)[0];
  }, [items]);

  const send = (e) => {
    e.preventDefault();
    const text = inputRef.current?.value?.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', content: text }]);

    const lower = text.toLowerCase();
    let reply = "I can help summarize deals. Try asking for 'cheapest' or 'best rated'.";
    if (lower.includes('cheapest') || lower.includes('lowest')) {
      if (cheapest) {
        reply = `Cheapest is ${cheapest.store} at ₹${Math.round(cheapest.price)} with delivery in ${cheapest.deliveryDays} days.`;
      } else reply = 'No items yet. Search something above!';
    } else if (lower.includes('best') || lower.includes('rating')) {
      if (bestRated) {
        reply = `Best rated is ${bestRated.store} rated ${bestRated.rating.toFixed(1)} at ₹${Math.round(bestRated.price)}.`;
      } else reply = 'No items yet. Search something above!';
    }

    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    }, 300);

    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-xl backdrop-blur-sm">
        <div className="max-h-56 space-y-3 overflow-y-auto pr-2">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'assistant' ? 'text-white/90' : 'text-white'}>
              <span className="mr-2 rounded-md bg-white/10 px-2 py-0.5 text-xs uppercase tracking-wide text-white/60">
                {m.role}
              </span>
              {m.content}
            </div>
          ))}
        </div>
        <form onSubmit={send} className="mt-3 flex gap-2">
          <input
            ref={inputRef}
            placeholder="Ask about the deals…"
            className="h-11 flex-1 rounded-xl border border-white/10 bg-transparent px-3 text-white placeholder-white/50 outline-none"
          />
          <button
            type="submit"
            className="h-11 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
