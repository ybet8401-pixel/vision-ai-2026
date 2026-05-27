import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  Key, 
  HelpCircle, 
  Sliders, 
  ToggleLeft, 
  Check, 
  Globe, 
  UserPlus 
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  language: 'en' | 'ar';
}

export default function SettingsView({
  settings,
  setSettings,
  language
}: SettingsViewProps) {
  const isRtl = language === 'ar';
  const [showTokenMsg, setShowTokenMsg] = useState(false);

  const toggleApiMode = () => {
    setSettings(prev => ({
      ...prev,
      apiMode: prev.apiMode === 'live' ? 'simulation' : 'live'
    }));
  };

  const toggleRetry = () => {
    setSettings(prev => ({ ...prev, autoRetry: !prev.autoRetry }));
  };

  const toggleGlow = () => {
    setSettings(prev => ({ ...prev, quantumGlow: !prev.quantumGlow }));
  };

  return (
    <div className="max-w-3xl space-y-8">
      
      {/* Parameters Panel block */}
      <div className="p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-neutral-900 pb-4">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
            {isRtl ? 'إعدادات النظام والشبكة' : 'Global Core Variables'}
          </h3>
        </div>

        {/* API Pipeline mode switcher */}
        <div className="flex items-start sm:items-center justify-between gap-6 flex-col sm:flex-row p-4 rounded-xl bg-neutral-950/80 border border-neutral-900/60">
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
              <Cpu className="w-4 h-4 text-cyan-400" />
              {isRtl ? 'بوابة المعالجة الذرية (API Mode)' : 'API Connection Pipeline'}
            </h4>
            <p className="text-xs text-neutral-500 max-w-md">
              {isRtl 
                ? 'تحويل دفق المهام بين النماذج الحية عبر مفتاح Gemini المعتمد، وبين محاكي المهام الفائق.' 
                : 'Switch between direct Gemini API connections using process secrets, and in-browser safe simulated fallback grids.'}
            </p>
          </div>

          <button 
            onClick={toggleApiMode}
            className={`
              px-4 py-2 font-mono text-xs font-bold rounded-xl border transition duration-200 cursor-pointer
              ${settings.apiMode === 'live' 
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400' 
                : 'bg-amber-950/20 border-amber-800/40 text-amber-400'}
            `}
          >
            {settings.apiMode === 'live' 
              ? (isRtl ? 'نماذج حية نشطة' : 'LIVE GEMINI KEY') 
              : (isRtl ? 'محاكاة محلية آمنة' : 'SAFE SIMULATE')}
          </button>
        </div>

        {/* Secret credentials instruction info box */}
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 flex gap-3 text-xs">
          <Key className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-bold text-white">{isRtl ? 'حماية بيانات كود البنية الكلية' : 'Secure Runtime API Key Configuration'}</p>
            <p className="text-neutral-400 leading-relaxed font-sans">
              {isRtl 
                ? 'يتم تفعيل مفاتيح الجيل الحقيقي بصورة مأمونة عبر لوحة الإعدادات والمخازن المشفرة. لا يعرض خادم البنية أي مفاتيح للمتصفح مطلقاً.' 
                : "Real Gemini calls are securely proxied. Operator credentials are auto-injected by the system. Never write API keys manually in the codebase."}
            </p>
          </div>
        </div>

        {/* Toggleable Settings Checklist */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-widest">{isRtl ? 'تفاصيل المظهر ومعلمات المعالج' : 'Engine Execution Variables'}</h4>
          
          <div className="space-y-3.5">
            {/* Auto retry */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/30 border border-neutral-900">
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-white">{isRtl ? 'إعادة المحاولة الذاتية الفورية' : 'Intelligent Auto-Retry Pipeline'}</span>
                <span className="block text-[11px] text-neutral-500">{isRtl ? 'إعادة الربط بالعقد الأخرى تلقائياً عند غياب البث' : 'Seamlessly connect alternative model links upon temporary drops'}</span>
              </div>
              <button 
                onClick={toggleRetry}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 cursor-pointer ${settings.autoRetry ? 'bg-indigo-600' : 'bg-neutral-800'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.autoRetry ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Quantum Glow effects */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/30 border border-neutral-900">
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-white">{isRtl ? 'التوهج ومصفوفات المظهر (Quantum Glow)' : 'Dynamic Quantum Glow Aesthetics'}</span>
                <span className="block text-[11px] text-neutral-500">{isRtl ? 'تفعيل تدرج ونبرة الألوان وتوهج نيون المفاصل' : 'Show fluid background gradients and cosmic laser styling border lights'}</span>
              </div>
              <button 
                onClick={toggleGlow}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 cursor-pointer ${settings.quantumGlow ? 'bg-indigo-600' : 'bg-neutral-800'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.quantumGlow ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
