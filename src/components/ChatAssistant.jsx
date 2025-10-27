import React, { useMemo, useState } from 'react';

function getAdviceMessage(query, items) {
  const normalized = query.toLowerCase();
  const cheapest = [...items].sort((a, b) => a.price - b.price)[0];
  const bestRated = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

  if (normalized.includes('cheap') || normalized.includes('under')) {
    return cheapest ? `Cheapest option is ${cheapest.title} at ₹${cheapest.price.toLocaleString()}.` : 'No items found.';
  }
  if (normalized.includes('best') || normalized.includes('quality')) {
    return bestRated ? `Best rated is ${bestRated.title} with ${bestRated.rating}★.` : 'No items found.';
  }
  return 'Try asking for the cheapest option or the best rated one.';
}

export default function ChatAssistant({ items = [] }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me for cheapest or best rated picks.' },
  ]);
  const [input, setInput] = useState('');

  const lastQuery = useMemo(() => messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '', [messages]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    const reply = getAdviceMessage(q, items);
    setMessages((prev) => [...prev, { role: 'user', content: q }, { role: 'assistant', content: reply }]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="mb-3 text-sm font-medium text-slate-200">AI Assistant</div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'assistant' ? 'text-slate-200' : 'text-slate-300'}>
            <span className="mr-2 rounded-md px-2 py-0.5 text-xs uppercase tracking-wide text-slate-400">{m.role}</span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask e.g. cheapest under 2000"
          className="w-full rounded-xl border border-white/10 bg-transparent px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />
        <button onClick={handleSend} className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600">Send</button>
      </div>
      {lastQuery && (
        <div className="mt-2 text-xs text-slate-400">Last asked: {lastQuery}</div>
      )}
    </div>
  );
}
