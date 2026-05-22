
import React, { useState, useRef, useEffect } from 'react';
import { HealthData } from '../types.ts';
import { Send, Sparkles, Loader2, Bot, User, Crown, ExternalLink } from 'lucide-react';
import { createHealthChat } from '../services/geminiService.ts';
import MedicalDisclaimer from './MedicalDisclaimer.tsx';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: { uri: string; title: string }[];
}

interface HealthAssistantProps {
  data: HealthData;
  onUpgrade: () => void;
}

export default function HealthAssistant({ data, onUpgrade }: HealthAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: `Hello ${data.profile.name}! I'm your AI health assistant. How can I help you with your ${data.profile.goalType === 'lose' ? 'weight loss' : 'muscle gain'} journey today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.profile.isPremium) {
      chatRef.current = createHealthChat(data);
    }
  }, [data.profile.isPremium, data]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !data.profile.isPremium) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title
      })).filter((s: any) => s.uri) || [];

      setMessages(prev => [...prev, { role: 'assistant', text: response.text, sources }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I encountered an error processing your request. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!data.profile.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 animate-in fade-in duration-500">
        <div className="p-6 bg-indigo-600 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-100">
          <Crown size={64} className="text-amber-300 mx-auto mb-4" />
          <h2 className="text-3xl font-black uppercase tracking-tight">AI Assistant Locked</h2>
        </div>
        <p className="text-slate-500 max-w-sm font-medium">
          Get deep analysis of your trends, personalized diet advice, and science-backed fitness strategies with FitMetric PRO.
        </p>
        <button 
          onClick={onUpgrade}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3"
        >
          ACTIVATE PRO FOR R19
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-none">Health Assistant</h3>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Grounded by Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <Sparkles size={12} /> Live Support
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[80%] space-y-3`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'}`}>
                  {msg.text}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-colors"
                      >
                        <ExternalLink size={10} />
                        {source.title || 'Source'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center animate-pulse">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm font-medium">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask anything about your health or progress..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl disabled:bg-slate-200 disabled:text-slate-400 transition-all hover:bg-indigo-700 active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-widest">Powered by Gemini-3 Flash & Google Search</p>
        </div>
      </div>
      <MedicalDisclaimer />
    </div>
  );
}
