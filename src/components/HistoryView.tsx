import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  Globe, 
  MessageSquare, 
  Image as ImageIcon, 
  Code, 
  Video, 
  Volume2 
} from 'lucide-react';
import { Generation } from '../types';

interface HistoryViewProps {
  generations: Generation[];
  setGenerations: React.Dispatch<React.SetStateAction<Generation[]>>;
  language: 'en' | 'ar';
}

export default function HistoryView({
  generations,
  setGenerations,
  language
}: HistoryViewProps) {
  const isRtl = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'image': return <ImageIcon className="w-4 h-4 text-cyan-400" />;
      case 'video': return <Video className="w-4 h-4 text-indigo-400" />;
      case 'voice': return <Volume2 className="w-4 h-4 text-purple-400" />;
      case 'code': return <Code className="w-4 h-4 text-amber-400" />;
      case 'website': return <Globe className="w-4 h-4 text-teal-400" />;
      default: return <History className="w-4 h-4 text-neutral-400" />;
    }
  };

  const filtered = generations.filter(gen => 
    gen.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gen.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gen.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyResult = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteItem = (id: string) => {
    setGenerations(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Search Bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-neutral-950 rounded-xl border border-neutral-850">
        <Search className="w-4.5 h-4.5 text-neutral-500 flex-shrink-0" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isRtl ? 'البحث في محفوظات السجلات الكونية...' : 'Search temporal manifestations database...'}
          className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
        />
      </div>

      {/* Main List Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-neutral-600">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{isRtl ? 'لم يعثر على شيء' : 'Synapse records clean'}</p>
            <p className="text-xs text-neutral-500 mt-1">{isRtl ? 'لم نجد أي عمليات تطابق بحثك حالياً.' : 'Execute AI tools to automatically write manifestations here.'}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div 
              key={item.id}
              className="p-4 sm:p-5 rounded-xl bg-neutral-900/20 border border-neutral-900 hover:border-neutral-850 transition duration-150 space-y-3 relative group"
            >
              
              {/* Type tag / Title details */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-900 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-neutral-950 border border-neutral-850 rounded-lg">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white capitalize">{item.title}</h4>
                    <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wide">{item.modelUsed || 'OmniNexa AI Model L3'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono text-neutral-500">{item.date}</span>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-800 text-neutral-400 hover:text-rose-400 rounded-lg transition"
                    title={isRtl ? 'حذف من السجل' : 'Delete item'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Prompt and Output details */}
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-950 text-neutral-400 italic">
                  <span className="font-semibold block text-[10px] font-mono text-neutral-600 uppercase tracking-widest mb-1">{isRtl ? 'المدخل الإبداعي:' : 'INPUT PROMPT:'}</span>
                  <p className="font-sans leading-relaxed">{item.prompt}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/20 border border-neutral-900/60 text-neutral-300 relative group/box">
                  <span className="font-semibold block text-[10px] font-mono text-indigo-500 uppercase tracking-widest mb-1">{isRtl ? 'المخرجات المعالجة:' : 'OUTPUT PARADIGM:'}</span>
                  
                  {item.type === 'image' || item.type === 'website' ? (
                    <div className="space-y-2 pt-1 font-mono text-[10px] text-neutral-500">
                      <div>File type: PNG/HTML Frame Output</div>
                      <div>Source Link Mapping: {item.output.slice(0, 50)}...</div>
                    </div>
                  ) : (
                    <p className="font-sans whitespace-pre-wrap leading-relaxed max-y-36 overflow-y-auto line-clamp-3 font-medium">{item.output}</p>
                  )}

                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover/box:opacity-100 transition duration-150">
                    <button 
                      onClick={() => copyResult(item.id, item.output)}
                      className="p-1 bg-neutral-900 hover:bg-neutral-850 rounded text-neutral-400 hover:text-cyan-400 border border-neutral-800"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
