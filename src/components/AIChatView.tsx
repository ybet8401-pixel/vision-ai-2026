import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  RefreshCw, 
  Bot, 
  User as UserIcon,
  Cpu,
  BookOpen,
  ArrowRightLeft,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Message, Generation } from '../types';
import AdBanner from './AdBanner';

interface AIChatViewProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addGeneration: (gen: Omit<Generation, 'id' | 'date'>) => void;
  language: 'en' | 'ar';
  checkUsageLimit?: () => Promise<boolean>;
}

export default function AIChatView({
  messages,
  setMessages,
  addGeneration,
  language,
  checkUsageLimit
}: AIChatViewProps) {
  const isRtl = language === 'ar';
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('Gemini-3.5-Flash (Active)');
  const [temperature, setTemperature] = useState(0.7);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modelsList = isRtl
    ? [
        { name: 'Gemini-3.5-Flash (Active)', desc: 'محرك جوجل النيوروني الحاسم والبحث الفوري', delay: 400 },
        { name: 'DeepSeek-V3 (Free)', desc: 'خبير التحليل والاستنتاج المنطقي المطور', delay: 800 },
        { name: 'Qwen-2.5-Coder (Free)', desc: 'منسق الأكواد وتصميم الهياكل البرمجية', delay: 700 },
        { name: 'Llama-3.1-70B (Free)', desc: 'النموذج اللغوي الفصيح للمحادثات الطويلة', delay: 900 }
      ]
    : [
        { name: 'Gemini-3.5-Flash (Active)', desc: 'Next-gen Google Neural Engine & Live Search Grounding', delay: 400 },
        { name: 'DeepSeek-V3 (Free)', desc: 'Reasoning & Strategic Code Synthesizer', delay: 800 },
        { name: 'Qwen-2.5-Coder (Free)', desc: 'Autonomous High-Volume Architect', delay: 700 },
        { name: 'Llama-3.1-70B (Free)', desc: 'Advanced Linguistic Chat Specialist', delay: 900 }
      ];

  const presets = isRtl 
    ? [
        { label: 'أكواد في مصفوفة', prompt: 'اكتب كود دالة بلغة TypeScript لدمج واجهتين تواصل.' },
        { label: 'تحسين بنية البيانات', prompt: 'كيف يمكن استرجاع السجلات الإدراكية بكفاءة عالية؟' },
        { label: 'فلسفة ذكاء الآلة', prompt: 'اشرح مفهوم دمج النماذج الذكية المتعددة.' }
      ]
    : [
        { label: 'Synthesise TS Node', prompt: 'Write an asynchronous TypeScript fetch wrapper with custom retry.' },
        { label: 'Optimize SQL Schema', prompt: 'Design a high-fidelity SQL table schema with composite secondary keys.' },
        { label: 'Explain Quantum LLMs', prompt: 'Briefly explain the convergence of quantum logic and large language weights.' }
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    if (checkUsageLimit) {
      const isAllowed = await checkUsageLimit();
      if (!isAllowed) return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          model: selectedModel,
          webSearch: webSearchEnabled
        })
      });

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString(),
        model: data.model || selectedModel,
        sources: data.sources || undefined
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Add to platform saved history automatically
      addGeneration({
        type: 'chat',
        title: textToSend.slice(0, 30) + '...',
        prompt: textToSend,
        output: data.response,
        modelUsed: data.model || selectedModel
      });

    } catch (err) {
      console.error(err);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isRtl 
          ? 'خطأ: تعذر الربط بقمر البث المباشر. تفعيل محاكاة العقل المركزي.'
          : '[Node Pipeline Connection Lost]. Re-routing to standby simulated mind.',
        timestamp: new Date().toLocaleTimeString(),
        model: selectedModel
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] relative">
      
      {/* Top Controls: Model Switcher & Stats */}
      <div className="p-4 bg-neutral-900/25 border border-neutral-900 rounded-xl flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-950/20 border border-indigo-850 rounded-lg text-indigo-400">
            <Cpu className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-mono block">QUANTUM PIPELINE TARGET</span>
            <span className="text-sm font-bold text-white font-mono">{selectedModel}</span>
          </div>
        </div>

        {/* Model dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-mono text-neutral-400 hidden sm:inline">{isRtl ? 'اختر النموذج:' : 'Engine Cluster:'}</label>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 font-mono px-3 py-1.5 rounded-xl outline-none focus:border-cyan-400/60"
          >
            {modelsList.map((m, idx) => (
              <option key={idx} value={m.name}>{m.name} - {m.desc}</option>
            ))}
          </select>

          {/* Web Search Toggle */}
          <button
            type="button"
            onClick={() => setWebSearchEnabled(!webSearchEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition duration-200 cursor-pointer ${
              webSearchEnabled 
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-bold shadow-md shadow-cyan-500/5' 
                : 'bg-neutral-950 border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
            }`}
            title={isRtl ? 'تفعيل البحث الحي والمباشر في جوجل' : 'Enable live Google search grounding'}
          >
            <Globe className={`w-3.5 h-3.5 ${webSearchEnabled ? 'animate-spin-slow text-cyan-400' : 'text-neutral-500'}`} />
            <span>{isRtl ? 'البحث الحي:' : 'Live Search:'} {webSearchEnabled ? (isRtl ? 'مفعّل' : 'مغلق') : (isRtl ? 'مغلق' : 'OFF')}</span>
          </button>

          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              title={isRtl ? 'مسح المحادثة' : 'Re-initialize Pipeline log'}
              className="p-1.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-rose-400 border border-neutral-850 rounded-xl transition duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Primary chat content box */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-900/10 border border-neutral-900/60 rounded-2xl scrollbar-thin scrollbar-thumb-neutral-800 space-y-4 max-h-[calc(100vh-22rem)]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-10 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-md sm:text-lg font-bold text-white">{isRtl ? 'المستكشف الإدراكي لـ OmniNexa AI' : 'Initiate Cognitive Paradigm'}</h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                {isRtl 
                  ? 'اطرح أسئلتك البرمجية، اطلب تفتيت الخوارزميات، أو اكتب مقالات تفصيلية بأقوى نموذج مفتوح ذكي حالياً.' 
                  : 'Start a conversation with DeepSeek, Qwen or Llama. Every execution is free, secure, and saved automatically inside your platform Temporal Bank.'}
              </p>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-4">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.prompt)}
                  className="p-3 bg-neutral-900/30 border border-neutral-850 hover:border-indigo-500/30 rounded-xl text-xs text-neutral-300 hover:text-white transition text-left space-y-2 group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-[10px] text-neutral-500 line-clamp-2 leading-tight group-hover:text-neutral-400">{p.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id}
              className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role !== 'user' && (
                <div className="w-9 h-9 rounded-lg bg-indigo-950/30 border border-indigo-800/40 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              )}

              <div className={`
                max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl relative group overflow-hidden border
                ${m.role === 'user' 
                  ? 'bg-neutral-900/80 border-neutral-850 text-white' 
                  : 'bg-neutral-950 border-neutral-900/80 text-neutral-200'}
              `}>
                {/* Visual marker */}
                {m.role !== 'user' && m.model && (
                  <div className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest mb-1 pb-1 border-b border-neutral-900">
                    Engine Output: {m.model}
                  </div>
                )}

                <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-sans">{m.content}</p>

                {/* Grounding Search Sources */}
                {m.role !== 'user' && m.sources && m.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-neutral-900 text-left">
                    <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono font-bold mb-2">
                      <Globe className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" />
                      <span>{isRtl ? 'المصادر والنتائج المباشرة للبحث في جوجل:' : 'Live Google Search References:'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {m.sources.map((src, sIdx) => (
                        <a 
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 hover:border-cyan-500/30 rounded-full text-[10px] text-neutral-300 hover:text-white transition duration-200 shadow-sm"
                        >
                          <span className="truncate max-w-[150px] font-sans font-medium">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta actions */}
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600 mt-2">
                  <span>{m.timestamp}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition duration-150">
                    <button 
                      onClick={() => copyToClipboard(m.id, m.content)}
                      className="p-1 hover:bg-neutral-900 rounded text-neutral-400 hover:text-cyan-400 transition"
                      title={isRtl ? 'نسخ الجيل' : 'Copy output'}
                    >
                      {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-indigo-400" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-lg bg-indigo-950/20 border border-indigo-900/40 flex items-center justify-center flex-shrink-0 animate-spin-slow">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-900 text-xs sm:text-sm text-neutral-400 font-mono flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>
                {isRtl 
                  ? `جاري الاتصال بالعقد الذرية عبر الموديل المعزز...` 
                  : `Connecting to ${selectedModel} node. Syncing weights...`}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* AdSense In-Content / Bottom Context */}
      <AdBanner adSlot="chat_anchor" className="my-3 max-h-[90px]" />

      {/* Grounding Search Live Indicator */}
      {webSearchEnabled && (
        <div className="mt-2 mb-2 text-[10px] text-cyan-400 font-mono animate-pulse flex items-center gap-1.5 bg-cyan-950/25 border border-cyan-900/40 px-3 py-1.5 rounded-xl">
          <Globe className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" />
          <span>{isRtl ? 'وضع البحث الحي نشط: سيقوم الذكاء الاصطناعي بإجراء بحث حقيقي عبر محرك جوجل للإجابة بدقة بالغة.' : 'Live Web Search Active: The AI will execute real-time queries via Google to respond with utmost factual accuracy.'}</span>
        </div>
      )}

      {/* Bottom Message Input bar */}
      <div className="pt-4 flex items-center gap-3">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isRtl ? 'اكتب تساؤلاتك هنا لمعالجتها إدراكياً...' : 'Deconstruct concepts or query TS templates here...'}
          className="flex-1 px-4 py-3 bg-neutral-950 text-xs sm:text-sm text-white placeholder-neutral-500 rounded-xl border border-neutral-850 outline-none focus:border-cyan-400 transition"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-neutral-900 disabled:to-neutral-950 disabled:text-neutral-600 transition duration-300 font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10"
        >
          <span className="hidden sm:inline">{isRtl ? 'إرسال' : 'Process'}</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
