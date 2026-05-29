import { 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Volume2, 
  Code, 
  Globe, 
  User, 
  Settings, 
  CreditCard, 
  ShieldAlert, 
  History, 
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  userId: string | null;
  onLogout: () => void;
  language: 'en' | 'ar';
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  isSidebarOpen,
  setIsSidebarOpen,
  userId,
  onLogout,
  language
}: SidebarProps) {
  const isRtl = language === 'ar';

  const menuItems = [
    { id: 'dashboard', label: isRtl ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard, group: 'main' },
    { id: 'chat', label: isRtl ? 'المحادثة الذكية' : 'AI Chat', icon: MessageSquare, group: 'tools' },
    { id: 'images', label: isRtl ? 'توليد الصور' : 'AI Image', icon: ImageIcon, group: 'tools' },
    { id: 'video', label: isRtl ? 'توليد الفيديو' : 'AI Video', icon: Video, group: 'tools' },
    { id: 'voice', label: isRtl ? 'توليد الصوت' : 'AI Voice', icon: Volume2, group: 'tools' },
    { id: 'code', label: isRtl ? 'توليد الكود' : 'AI Code', icon: Code, group: 'tools' },
    { id: 'website', label: isRtl ? 'منشئ التطبيقات والألعاب الذكي' : 'AI App & Game Builder', icon: Globe, group: 'tools' },
    { id: 'history', label: isRtl ? 'السجل' : 'History', icon: History, group: 'data' },
    { id: 'profile', label: isRtl ? 'الملف الشخصي' : 'Profile', icon: User, group: 'user' },
    { id: 'pricing', label: isRtl ? 'الأسعار' : 'Pricing', icon: CreditCard, group: 'user' },
    { id: 'settings', label: isRtl ? 'الإعدادات' : 'Settings', icon: Settings, group: 'settings' },
    { id: 'admin', label: isRtl ? 'لوحة المسؤول' : 'Admin Panel', icon: ShieldAlert, group: 'admin' },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-neutral-950/80 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 z-50 flex flex-col w-64 bg-neutral-950/40 border-r border-neutral-900/60 backdrop-blur-xl transition-all duration-300 ease-out
        ${isRtl ? 'right-0' : 'left-0'}
        ${isSidebarOpen ? 'translate-x-0' : isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-neutral-900/40">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-indigo-500 blur-sm opacity-50 -z-10 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white uppercase font-sans">
                OmniNexa <span className="text-cyan-400">AI</span>
              </span>
              <div className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest leading-none">v4.0 Quantum</div>
            </div>
          </div>

          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 bg-neutral-900/40 hover:bg-neutral-800/80 rounded-lg text-neutral-400 hover:text-white transition duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800">
          {/* Group 1: CORE */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              {isRtl ? 'لوحة التحكم' : 'Core Hub'}
            </div>
            <div className="space-y-1">
              {menuItems.filter(item => item.group === 'main').map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 text-sm font-medium relative group
                      ${active 
                        ? 'bg-neutral-900/80 text-white shadow-inner border border-neutral-800/50' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'}
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-md" />
                    )}
                    <Icon className={`w-4 h-4 transition duration-200 ${active ? 'text-cyan-400' : 'text-neutral-400 group-hover:text-cyan-400'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: AI QUANTUM TOOLS */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              {isRtl ? 'الأدوات الذكية' : 'Neural Pipelines'}
            </div>
            <div className="space-y-1">
              {menuItems.filter(item => item.group === 'tools').map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 text-sm font-medium relative group
                      ${active 
                        ? 'bg-neutral-900/80 text-white border border-neutral-800/50 shadow-inner' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'}
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-md" />
                    )}
                    <Icon className={`w-4 h-4 transition duration-200 ${active ? 'text-cyan-400' : 'text-neutral-400 group-hover:text-cyan-300'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded uppercase">
                      Run
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 3: PERSISTENCE */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              {isRtl ? 'الذاكرة والمحاكاة' : 'Cognitive Bank'}
            </div>
            <div className="space-y-1">
              {menuItems.filter(item => ['data', 'user'].includes(item.group)).map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 text-sm font-medium relative group
                      ${active 
                        ? 'bg-neutral-900/80 text-white border border-neutral-800/50 shadow-inner' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'}
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-md" />
                    )}
                    <Icon className={`w-4 h-4 transition duration-200 ${active ? 'text-purple-400' : 'text-neutral-400 group-hover:text-purple-400'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 4: CONTROL */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              {isRtl ? 'التحكم العام' : 'Operations'}
            </div>
            <div className="space-y-1">
              {menuItems.filter(item => ['settings', 'admin'].includes(item.group)).map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 text-sm font-medium relative group
                      ${active 
                        ? 'bg-neutral-900/80 text-white border border-neutral-800/50 shadow-inner' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'}
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-r-md" />
                    )}
                    <Icon className={`w-4 h-4 transition duration-200 ${active ? 'text-cyan-400' : 'text-neutral-400 group-hover:text-cyan-400'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Sidebar Footer */}
        <div className="p-4 border-t border-neutral-900/40 bg-neutral-950/20">
          <div className="p-3 bg-gradient-to-r from-cyan-950/20 to-indigo-950/20 rounded-xl border border-indigo-900/30 mb-3 flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-400 animate-spin-slow flex-shrink-0" />
            <div className="overflow-hidden">
              <div className="text-[11px] font-semibold text-white tracking-wide truncate">Quantum Engine</div>
              <div className="text-[9px] text-neutral-400 truncate">12.4 PFLOPS Active</div>
            </div>
          </div>

          {userId && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition duration-200 text-sm font-medium"
            >
              <LogOut className="w-4 h-4 text-neutral-400 group-hover:text-rose-400" />
              <span>{isRtl ? 'تسجيل الخروج' : 'Disconnect Pipeline'}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
