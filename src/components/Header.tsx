import React from 'react';
import { 
  Bell, 
  Menu, 
  X, 
  Cpu, 
  Globe2, 
  Zap, 
  User, 
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, Notification, AppSettings } from '../types';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  profile: UserProfile;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  currentTab: string;
  onOpenNotifications: () => void;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  profile,
  notifications,
  setNotifications,
  settings,
  setSettings,
  currentTab,
  onOpenNotifications
}: HeaderProps) {
  const isRtl = settings.language === 'ar';
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return isRtl ? 'لوحة القيادة والمؤشرات' : 'Neural Command Center';
      case 'chat': return isRtl ? 'المحادثة الكونية الذكية' : 'AI Cognitive Explorer';
      case 'images': return isRtl ? 'توليد الصور الضوئية' : 'AI Dimensional Image Forge';
      case 'video': return isRtl ? 'توليد الفيديو السينمائي' : 'AI Cinematic Video Forge';
      case 'voice': return isRtl ? 'توليد الصوت البشري' : 'AI Biometric Voice Synthesizer';
      case 'code': return isRtl ? 'توليد الأكواد البرمجية' : 'AI Autonomous Code Architect';
      case 'website': return isRtl ? 'باني المواقع الافتراضية' : 'AI Autonomous Web Engine';
      case 'history': return isRtl ? 'محفوظات السجلات الكونية' : 'Platform Temporal Bank';
      case 'profile': return isRtl ? 'الملف التعريفي' : 'Operator Registry';
      case 'pricing': return isRtl ? 'خطط الترقية الكونية' : 'Pipeline Subscription Matrices';
      case 'settings': return isRtl ? 'لوحة الإعدادات' : 'System Variables & Parameters';
      case 'admin': return isRtl ? 'لوحة المشرف العام' : 'Quantum Central Overseer';
      default: return 'OmniNexa AI';
    }
  };

  const toggleLanguage = () => {
    setSettings(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'ar' : 'en'
    }));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-neutral-950/20 border-b border-neutral-900/60 backdrop-blur-xl">
      {/* Menu / Breadcrumb */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl border border-neutral-800/40 transition duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {getTabLabel(currentTab)}
            </span>
          </h1>
          <div className="text-[10px] sm:text-xs text-neutral-500 font-mono tracking-wide hidden sm:block">
            {isRtl ? 'النظام متصل بالقمر الاصطناعي' : 'Core Node Connection: Secure L2 Tunnel'}
          </div>
        </div>
      </div>

      {/* Control Actions / Metrics */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Token Credits Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/40 border border-neutral-800/40 font-mono text-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-neutral-400">{isRtl ? 'الرصيد الذكي' : 'Quantum Fuel:'}</span>
          <span className="font-bold text-white tracking-widest">{profile.credits}/{profile.maxCredits}</span>
        </div>

        {/* Live Key Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[10px] sm:text-xs transition duration-200 ${
          settings.apiMode === 'live' 
            ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400' 
            : 'bg-amber-950/20 border-amber-800/40 text-amber-400'
        }`}>
          <Cpu className={`w-3.5 h-3.5 ${settings.apiMode === 'live' ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">
            {settings.apiMode === 'live' 
              ? (isRtl ? 'الرابط المباشر' : 'API: Live (Active)') 
              : (isRtl ? 'طور المحاكاة' : 'API: Safe Simulation')}
          </span>
        </div>

        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          title={isRtl ? 'Switch to English' : 'تحويل للعربية'}
          className="p-2.5 text-neutral-400 hover:text-white bg-neutral-900/40 hover:bg-neutral-800/60 rounded-xl border border-neutral-800/40 transition duration-200 flex items-center gap-1.5 text-xs font-mono font-semibold"
        >
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span className="uppercase">{settings.language}</span>
        </button>

        {/* Notifications Button */}
        <button 
          onClick={onOpenNotifications}
          className="relative p-2.5 text-neutral-400 hover:text-white bg-neutral-900/40 hover:bg-neutral-800/60 rounded-xl border border-neutral-800/40 transition duration-200"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-lg shadow-indigo-500/40 animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Brief avatar status indicator */}
        <div className="flex items-center gap-2">
          <img 
            src={profile.avatar} 
            alt="Operator" 
            className="w-9 h-9 rounded-xl border border-indigo-500/30 object-cover shadow-md shadow-indigo-500/10"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
