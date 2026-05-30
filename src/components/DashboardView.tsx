import { 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Activity, 
  Layers, 
  Clock, 
  Database,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { UserProfile, Generation } from '../types';
import AdBanner from './AdBanner';
import DashboardAd from './ads/DashboardAd';

interface DashboardViewProps {
  profile: UserProfile;
  generations: Generation[];
  setCurrentTab: (tab: string) => void;
  language: 'en' | 'ar';
}

export default function DashboardView({
  profile,
  generations,
  setCurrentTab,
  language
}: DashboardViewProps) {
  const isRtl = language === 'ar';

  const stats = profile.usageStats || { appsGenerated: 0, imagesGenerated: 0, videosGenerated: 0, chatsSent: 0, adsWatched: 0 };
  const getPremiumStatusText = () => {
    if (!profile.isPremium) return isRtl ? 'حساب مجاني مزود بإعلانات' : 'Free Ad-Supported Account';
    if (profile.premiumUntil) {
      const days = Math.ceil((new Date(profile.premiumUntil).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return isRtl ? `حساب احترافي (متبقي ${days} أيام)` : `Quantum Pro (${days} days left)`;
    }
    return isRtl ? 'حساب احترافي دائم' : 'Lifetime Pro Account';
  };

  const metrics = [
    {
      title: isRtl ? 'استخدام التطبيقات والمواقع' : 'Apps & Sites Built',
      value: stats.appsGenerated.toString(),
      desc: getPremiumStatusText(),
      icon: Cpu,
      color: 'text-cyan-400 bg-cyan-950/20 border-cyan-800/40'
    },
    {
      title: isRtl ? 'إجمالي الصور والفيديو' : 'Visual Medias',
      value: (stats.imagesGenerated + stats.videosGenerated).toString(),
      desc: isRtl ? 'عدد التصاميم المنتجة' : 'Total creations compiled',
      icon: Activity,
      color: 'text-indigo-400 bg-indigo-950/20 border-indigo-800/40'
    },
    {
      title: isRtl ? 'إجمالي الإعلانات المشاهدة' : 'Ads Engaged',
      value: stats.adsWatched.toString(),
      desc: isRtl ? 'دعم وتشغيل منصتنا' : 'Total rewards collected',
      icon: Layers,
      color: 'text-purple-400 bg-purple-950/20 border-purple-800/40 font-mono'
    }
  ];

  const recentItems = generations.length > 0 
    ? generations.slice(-3).reverse()
    : [
        { id: '1', type: 'chat', title: 'System Diagnostics Prompt', date: '2026-05-24', prompt: 'Perform immediate health check on Qwen deepseek node pipelines' },
        { id: '2', type: 'image', title: 'Futuristic City Artwork', date: '2026-05-24', prompt: 'Cyberpunk floating megacity with neon purple and blue gas lights' },
      ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-indigo-950/25 to-purple-950/20 border border-indigo-900/30 overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl group-hover:bg-indigo-500/15 transition rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              {isRtl ? 'مرحباً، أيها المشغل' : 'Welcome to the Cockpit,'} {profile.name}
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              {isRtl 
                ? 'أنظمتك متصلة بالكامل ومستقرة. يمكنك الوصول الفوري لجميع الخلايا والنماذج الذكية مجاناً.' 
                : 'All neural networks, dynamic site templates, and localized biometric synthesizers are synchronized. Your current status is active.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-neutral-900/60 rounded-xl border border-neutral-800 text-xs text-center font-mono">
              <span className="block text-neutral-500 uppercase tracking-widest text-[9px] mb-1">{isRtl ? 'رصيد التوليد المتاح' : 'Remaining Fuel'}</span>
              <span className="text-white font-bold">{profile.credits} tokens</span>
            </div>
            <button 
              onClick={() => setCurrentTab('pricing')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isRtl ? 'ترقية المصفوفة' : 'Upgrade Pipeline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AdSense Display Zone */}
      <AdBanner 
        adSlot="dashboard_top"
        isPremium={profile.tier === 'Quantum Pro' || profile.tier === 'Enterprise Cosmic'}
        className="my-6 shadow-sm shadow-indigo-900/10"
      />

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-900 flex items-center justify-between group hover:border-neutral-800 transition duration-200"
            >
              <div className="space-y-1">
                <p className="text-xs text-neutral-500 font-mono uppercase tracking-wide">{m.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{m.value}</p>
                <p className="text-[11px] text-neutral-400">{m.desc}</p>
              </div>

              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${m.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <DashboardAd isPremium={profile.isPremium} />

      {/* Two Columns Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Core Node Telemetry Control (3 cols) */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              {isRtl ? 'المعالج المركزي والبث الحي' : 'Neural Pipeline Stream'}
            </h3>
            <span className="text-[10px] font-mono text-neutral-500">Node: OmniNexa-Quantum-4</span>
          </div>

          {/* Quick Shortcuts Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: isRtl ? 'محادثة الذكاء' : 'AI Cognitive Explorer', id: 'chat' },
              { label: isRtl ? 'توليد الصور' : 'Dimensional Image Forge', id: 'images' },
              { label: isRtl ? 'رسم الأكواد' : 'Autonomous Code Block', id: 'code' },
              { label: isRtl ? 'منشئ التطبيقات والألعاب الذكي' : 'AI App & Game Builder', id: 'website' },
              { label: isRtl ? 'فيديو سينمائي' : 'Cinematic Video Suite', id: 'video' },
              { label: isRtl ? 'تعديل المعلمات' : 'Platform Settings', id: 'settings' },
            ].map((shortcut, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTab(shortcut.id)}
                className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/40 hover:border-indigo-500/30 text-xs font-semibold text-neutral-300 hover:text-white transition duration-200 text-center"
              >
                {shortcut.label}
              </button>
            ))}
          </div>

          {/* Core Telemetry status */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-900/80 font-mono text-[11px] space-y-2.5">
            <div className="text-cyan-400">// ACTIVE MODEL OVERWATCH DIRECTIVE</div>
            <div className="flex justify-between text-neutral-400">
              <span>DeepSeek-V3 Matrix:</span>
              <span className="text-emerald-400">CONNECT STABLE (FREE HOVER)</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Stable-Diffusion-XL Pipeline:</span>
              <span className="text-emerald-400">ACTIVE ON POLLINATIONS</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Ollama Cluster Sync:</span>
              <span className="text-neutral-500">STANDBY ON HOSTPORT 11434</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Gemini Pro Context Engine:</span>
              <span className="text-emerald-400">LIVE COGNITIVE SYNCED</span>
            </div>
          </div>
        </div>

        {/* History / Recent Manifestations (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {isRtl ? 'أحدث المخرجات المسجلة' : 'Recent Manifestations'}
              </h3>
              <button 
                onClick={() => setCurrentTab('history')}
                className="text-xs text-neutral-500 hover:text-cyan-400 transition font-mono"
              >
                {isRtl ? 'فتح السجل' : 'View Core Log'}
              </button>
            </div>

            <div className="space-y-3">
              {recentItems.map((item: any, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-neutral-900/40 border border-neutral-850 rounded-xl space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-indigo-400 uppercase tracking-wider">{item.type}</span>
                    <span className="text-neutral-500">{item.date}</span>
                  </div>
                  <p className="text-xs text-white font-semibold truncate leading-none">{item.title}</p>
                  <p className="text-[11px] text-neutral-400 truncate mt-1">{item.prompt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900/40 mt-4 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>{isRtl ? 'محاكي الذاكرة: مؤمن' : 'Memory Synapse: SECURED'}</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

      </div>
    </div>
  );
}
