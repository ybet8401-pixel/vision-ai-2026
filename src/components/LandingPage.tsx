import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Play, 
  ShieldAlert, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Volume2, 
  Code, 
  Globe, 
  Zap,
  Flame,
  Globe2,
  Lock
} from 'lucide-react';

interface LandingPageProps {
  onLoginTrigger: () => void;
  onExploreTrigger: () => void;
  language: 'en' | 'ar';
}

export default function LandingPage({
  onLoginTrigger,
  onExploreTrigger,
  language
}: LandingPageProps) {
  const isRtl = language === 'ar';

  const stats = [
    { value: '3.4M+', label: isRtl ? 'جيل فائق الدقة' : 'Active Multi-Generations' },
    { value: '99.9%', label: isRtl ? 'وقت تشغيل الكموم' : 'Quantum Node Uptime' },
    { value: '< 24ms', label: isRtl ? 'زمن الاستجابة' : 'Command Pipeline Latency' },
  ];

  const tools = [
    { 
      title: isRtl ? 'المستكشف الإدراكي' : 'Cognitive AI Explorer',
      desc: isRtl ? 'محادثات بالغة الذكاء فورية تدعم الترجمة والتحقق المنطقي متصلة بـ Gemini.' : 'Unceasing logic reasoning model for smart, high-fidelity chats.',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-400'
    },
    { 
      title: isRtl ? 'صانع الصور البعدية' : 'Dimensional Image Forge',
      desc: isRtl ? 'توليد لوحات وصور فنية واقعية فائقة الدقة بـ 4K مع نسبة تباين احترافية.' : 'Sparsely auto-expand graphics from captions into photorealistic 4K designs.',
      icon: ImageIcon,
      color: 'from-cyan-400 to-indigo-500'
    },
    { 
      title: isRtl ? 'المنتج السينمائي' : 'Cinematic Video Suite',
      desc: isRtl ? 'توليد مقاطع فيديو متحركة وثنائية الأبعاد بدقة واقعية.' : 'Convert text coordinates directly into dynamic sci-fi cinematic clips.',
      icon: Video,
      color: 'from-indigo-500 to-purple-500'
    },
    { 
      title: isRtl ? 'محاكي الأصوات البيومتري' : 'Biometric Voice Synthesizer',
      desc: isRtl ? 'استنساخ نبرات الصوت البشري بجودة استوديو احترافية فائقة الدقة.' : 'Text-to-speech engine powered by high-fidelity local voice matrices.',
      icon: Volume2,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      title: isRtl ? 'مهندس البرمجيات المستقل' : 'Autonomous Code Architect',
      desc: isRtl ? 'توليد برمجيات كاملة بلغة TypeScript و JavaScript وحل المشكلات.' : 'Self-repairing code synthesizer for developers, engineers, and creators.',
      icon: Code,
      color: 'from-pink-500 to-amber-500'
    },
    { 
      title: isRtl ? 'صانع الويب والصفحات' : 'Autonomous Web Sandbox',
      desc: isRtl ? 'بناء مواقع ويب تفاعلية بالكامل مع تجربة معاينة حية في ثوانٍ.' : 'Directly compile user layout requests into fully responsive web screens.',
      icon: Globe,
      color: 'from-amber-500 to-teal-500'
    },
  ];

  return (
    <div className={`min-h-screen bg-neutral-950 text-white relative overflow-hidden flex flex-col ${isRtl ? 'font-sans' : ''}`}>
      {/* Visual background neon decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[150px] -z-10 animate-pulse" />
      
      {/* Decorative cyber grid in background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 -z-20" />

      {/* Navigation Menu */}
      <nav className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-neutral-900/40 relative z-20">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white uppercase font-sans">
            Vision <span className="text-cyan-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onExploreTrigger}
            className="text-xs sm:text-sm font-semibold hover:text-cyan-400 transition"
          >
            {isRtl ? 'الدخول كضيف' : 'System Sandbox'}
          </button>
          
          <button 
            onClick={onLoginTrigger}
            className="px-4.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 transition duration-300 shadow-md shadow-indigo-500/10"
          >
            {isRtl ? 'تسجيل الدخول / البدء' : 'Initiate Pipeline'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col justify-center py-16 lg:py-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-800/40 font-mono text-[10px] sm:text-xs text-indigo-400 uppercase tracking-widest mx-auto animate-pulse">
            <Flame className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isRtl ? 'حقبة الذكاء الاصطناعي الكمومي' : 'Quantum Intelligence Epoch'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            {isRtl ? 'المنصة الذكية التي تتجاوز كل الحدود' : 'Unchain Advanced Multi-Model AI Platforms'}
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {isRtl 
              ? 'بوابة موحدة لتوليد المحادثات، الصور، الفيديو، الأصوات، الأكواد البرمجية والمواقع البرمجية الحية مجاناً وإلى الأبد.' 
              : 'Synthesizing clean code interfaces, generating photorealistic 4K designs, and live-hosting custom sandbox web grids on demand with open-source neural pathways.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onExploreTrigger}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-sm font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition duration-300 transform active:scale-95 cursor-pointer"
            >
              <span>{isRtl ? 'استكشف لوحة التحكم مجاناً' : 'Access Quantum Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onLoginTrigger}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm font-bold flex items-center justify-center gap-2 transition duration-200"
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>{isRtl ? 'تسجيل بريد إلكتروني جديد' : 'Register Operator'}</span>
            </button>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 pt-10 sm:pt-14 max-w-xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-3 bg-neutral-950/60 border border-neutral-900/60 rounded-xl">
                <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent font-mono">{stat.value}</div>
                <div className="text-[10px] text-neutral-500 mt-1 uppercase font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Hub Grid Area */}
        <section className="pt-20 lg:pt-28">
          <div className="text-center space-y-2 mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white">{isRtl ? 'الأدوات والأنظمة الأساسية المدمجة' : 'Neural Command Suite'}</h3>
            <p className="text-xs sm:text-sm text-neutral-500">{isRtl ? 'أنظمة متعددة الأغراض لخدمتك متصلة وتعمل بصورة حقيقية بالكامل' : 'High-fidelity autonomous subsystems built with modular controls.'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition rounded-full" />
                  
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center shadow-md mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <h4 className="text-md font-bold text-white group-hover:text-cyan-400 transition">{tool.title}</h4>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{tool.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-900/40 text-center text-xs text-neutral-500 mt-auto relative z-10 w-full">
        <p className="font-mono tracking-wider">
          {isRtl ? 'شغف، مستقبل، وتمكين كامل بموجب محركات الذكاء الاصطناعي مجاناً.' : 'SECURE L3 PROTOCOL. ALL COGNITIVE PIPELINES ACTIVE.'}
        </p>
        <p className="mt-1">© 2026 Vision AI Inc. Generated via Google AI Studio.</p>
      </footer>
    </div>
  );
}
