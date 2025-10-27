import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';

const canned = (q, context) => {
  const lower = q.toLowerCase();
  if (!context?.items?.length) {
    return "Search a product first so I can analyze live deals across stores and share affiliate-friendly links.";
  }
  if (lower.includes('cheapest') || lower.includes('lowest') || lower.includes('under')) {
    const filtered = context.items
      .filter((i) => {
        const num = parseInt(lower.replace(/\D/g, ''), 10);
        return lower.includes('under') ? i.price <= (isNaN(num) ? Infinity : num) : true;
      })
      .sort((a, b) => a.price - b.price);
    const cheapest = filtered[0] || context.items.sort((a, b) => a.price - b.price)[0];
    return `Cheapest option: ₹${cheapest.price.toLocaleString('en-IN')} on ${cheapest.store}. Smart Score ${cheapest.smartScore}. Link: ${cheapest.affiliateUrl}`;
  }
  if (lower.includes('best') && (lower.includes('quality') || lower.includes('rated'))) {
    const best = [...context.items].sort((a, b) => b.rating - a.rating)[0];
    return `Best quality: ${best.rating.toFixed(1)}★ on ${best.store}. Smart Score ${best.smartScore}. Link: ${best.affiliateUrl}`;
  }
  if (lower.includes('wait') || lower.includes('discount')) {
    return 'Prices often drop 10–15% during major sales. If you can wait 1–2 weeks, you could save more. I’ll highlight limited-time deals when available.';
  }
  return 'Ask me things like: "Cheapest smartwatch under ₹2000", "Best rated earbuds", or "Should I wait for a sale?"';
};

const ChatAssistant = ({ context }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I’m your AI deals assistant. Ask about cheapest prices, best quality, or time-to-buy.' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      const reply = canned(text, context);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    }, 450);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-slate-900/60 ring-1 ring-white/10">
      <div className="flex items-center gap-2 border-b border-white/10 p-3 text-white/80">
        <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1 text-xs ring-1 ring-white/10">
          <Sparkles size={14} /> AI Assistant
        </div>
        <span className="ml-auto text-xs opacity-70">Experimental</span>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-[#0A84FF] to-[#6C63FF] text-white'
                  : 'bg-white/5 text-white/90 ring-1 ring-white/10'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-white/10 p-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 ring-1 ring-white/10">
          <MessageCircle className="h-4 w-4 text-white/60" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for cheapest, best rated, or deals under a price..."
            className="w-full bg-transparent py-2 text-sm text-white placeholder-white/50 outline-none"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0A84FF] to-[#6C63FF] px-3 py-2 text-sm text-white shadow-lg shadow-blue-500/20"
        >
          <Send className="h-4 w-4" />
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatAssistant;
