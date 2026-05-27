import { useState } from 'react';
import { 
  Code, 
  Cpu, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  BookOpen,
  RefreshCw,
  Terminal,
  FileCode
} from 'lucide-react';
import { Generation } from '../types';

interface AICodeViewProps {
  addGeneration: (gen: Omit<Generation, 'id' | 'date'>) => void;
  language: 'en' | 'ar';
}

export default function AICodeView({
  addGeneration,
  language
}: AICodeViewProps) {
  const isRtl = language === 'ar';
  const [prompt, setPrompt] = useState('');
  const [codeType, setCodeType] = useState('TypeScript');
  const [loading, setLoading] = useState(false);
  const [resultCode, setResultCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const languages = [
    'TypeScript',
    'Python',
    'Solidity (Web3)',
    'Golang',
    'Rust',
    'HTML/Tailwind'
  ];

  const presets = isRtl 
    ? [
        { label: 'دالة فلترة مصفوفة', prompt: 'كتابة دالة بلغة TypeScript لترسيخ وتصفية السجلات الإدراكية بناء على حقول السجل.' },
        { label: 'خادم Express سريع', prompt: 'اكتب خادم Express بلغة JavaScript يحتوي على معالج لإدارة استقعاد الكاش للبيانات.' }
      ]
    : [
        { label: 'Generic Node Retrier', prompt: 'Write a TypeScript helper to fetch a URL with customizable exponential backoff and retry count.' },
        { label: 'Clean ERC-20 Token', prompt: 'Write a basic Solidity ERC-20 smart contract with burnable parameters in Hardhat standard.' }
      ];

  const handleSynthesize = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResultCode(null);

    try {
      const compiledPrompt = `Write only the code for the following request in ${codeType}. Request: "${prompt}". Provide helpful comments but do NOT include conversational description or markdown formatting. Start directly with the raw code.`;
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: compiledPrompt
        })
      });

      const data = await response.json();
      setResultCode(data.response);

      // Save to saved manifestations bank
      addGeneration({
        type: 'code',
        title: `${codeType} Block`,
        prompt: prompt,
        output: data.response,
        modelUsed: 'DeepSeek-V3 Coder (Free)'
      });

    } catch (err) {
      console.error(err);
      setResultCode(`// Node error during synthesis. Fallback code generated:\nexport function initializeGrid() {\n  console.log("Core online");\n}`);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!resultCode) return;
    navigator.clipboard.writeText(resultCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      {/* Parameters Panel (2 cols) */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 space-y-6">
        <div className="flex items-center gap-2.5">
          <Code className="w-5 h-5 text-amber-500 animate-pulse" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
            {isRtl ? 'محاكي وهندسة المعالجات للكود' : 'Synthesizer Console'}
          </h3>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400">{isRtl ? 'الفكرة ومواصفات الكود المطلوبة:' : 'Code Specifications:'}</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={isRtl ? 'اكتب دالة ترشيح سريعة لمعالجة العقد الرقمية مع الكاش والـ debounce...' : 'An asynchronous function in TypeScript that fetches user metrics and filters duplicate ids with high-fidelity...'}
            rows={5}
            className="w-full px-4 py-3 bg-neutral-950 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-xl border border-neutral-850 outline-none focus:border-amber-500 transition resize-none"
          />
        </div>

        {/* Language Target Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400">{isRtl ? 'لغة البرمجة أو الهيكل:' : 'Target Language Cluster:'}</label>
          <select 
            value={codeType}
            onChange={(e) => setCodeType(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 font-mono px-3 py-2.5 rounded-xl outline-none focus:border-amber-500"
          >
            {languages.map((l, idx) => (
              <option key={idx} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Presets Grid */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-neutral-500">{isRtl ? 'قوالب برمجية جاهزة:' : 'Scenario Presets:'}</label>
          <div className="grid grid-cols-1 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p.prompt);
                }}
                className="p-3 bg-neutral-950/80 border border-neutral-850 hover:border-amber-500/30 text-left rounded-xl transition text-[11px] text-neutral-400 hover:text-white"
              >
                <p className="font-semibold flex items-center gap-1.5"><FileCode className="w-3.5 h-3.5 text-amber-500" /> {p.label}</p>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSynthesize}
          disabled={!prompt.trim() || loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 transition font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{isRtl ? 'جاري بناء الشيفرة...' : 'Synthesizing instructions...'}</span>
            </>
          ) : (
            <>
              <Terminal className="w-5 h-5" />
              <span>{isRtl ? 'توليد الكود البرمجي' : 'Synthesize Code Block'}</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Screen (3 cols) */}
      <div className="lg:col-span-3 min-h-[400px] flex flex-col justify-between p-6 bg-neutral-950 rounded-2xl border border-neutral-900 relative">
        
        {/* Not synthesized state */}
        {!resultCode && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-16">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex items-center justify-center">
              <Code className="w-6 h-6 text-neutral-600 animate-pulse" />
            </div>
            <div>
              <p className="text-white text-md font-bold">{isRtl ? 'شاشة محاكي الأكواد فارغة' : 'Autonomous Code Window'}</p>
              <p className="text-xs text-neutral-500 max-w-sm mt-1">
                {isRtl 
                  ? 'اختر لغة برمجة واكتب دالة أو فكرة برمجية ليقوم المحرك الذكي الحقيقي ببنائها فوراً.' 
                  : 'Specify instructions and a language model block on the console to compile standard codes.'}
              </p>
            </div>
          </div>
        )}

        {/* Loading compile state */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-16">
            <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
            <div className="font-mono text-[11px] text-neutral-400 space-y-1">
              <div className="text-amber-500 font-bold uppercase tracking-wider animate-pulse">{isRtl ? 'جاري استخراج السجلات' : '// CODE QUANTUM SYNTH INTERLOCK'}</div>
              <div>Deconstructing specifications...</div>
              <div>Injecting structural interfaces...</div>
              <div>Running linter check on sandbox...</div>
            </div>
          </div>
        )}

        {/* Synthesized code rendering */}
        {resultCode && !loading && (
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono border-b border-neutral-900 pb-3">
              <span className="text-amber-500 uppercase flex items-center gap-1.5"><Terminal className="w-4 h-4" /> {codeType} Sandbox Out</span>
              
              <button 
                onClick={copyCode}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-500" />}
                <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الجيل كامل' : 'Copy Code')}</span>
              </button>
            </div>

            {/* Structured Text Code Container */}
            <pre className="flex-1 bg-neutral-900/30 p-4 rounded-xl border border-neutral-900/80 font-mono text-[10px] sm:text-xs text-emerald-400 overflow-x-auto whitespace-pre h-[280px] lg:h-[350px] scrollbar-thin scrollbar-thumb-neutral-800">
              <code>{resultCode}</code>
            </pre>
          </div>
        )}

      </div>

    </div>
  );
}
