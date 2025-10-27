import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';

const canned = (q, context) => {
  const lower = q.toLowerCase();
  if (!context?.items?.length) {
    return "Search a product first so I can analyze real offers across stores.";
  }
  if (lower.includes('cheapest') || lower.includes('lowest')) {
    const cheapest = [...context.items].sort((a, b) => a.price - b.price)[0];
    return `The lowest price is ₹${cheapest.price.toLocaleString('en-IN')} on ${cheapest.store}. Smart Value Score: ${cheapest.smartScore}.`;
  }
  if (lower.includes('best') && lower.includes('quality')) {
    const best = [...context.items].sort((a, b) => b.rating - a.rating)[0];
    return `${best.store} has the best rated option (${best.rating.toFixed(1)}★). Smart Value Score: ${best.smartScore}.`;
  }
  if (lower.includes('wait') || lower.includes('discount')) {
    return 'Based on typical sale patterns, prices often drop 10–15% during major festivals. If you can wait 1–2 weeks, you might save more.';
  }
  return 'I analyze price, ratings, delivery, and reviews to craft a Smart Value Score. Ask: "Where is it cheapest?" or "Should I wait for sales?"';
};

const ChatAssistant = ({ context }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I’m your AI shopping buddy. Ask me about prices, quality, or when to buy.' },
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
            placeholder="Ask about cheapest price, best quality, or when to buy..."
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
