import { 
  User, 
  Sparkles, 
  Award, 
  Zap, 
  Flame, 
  Calendar, 
  ShieldCheck, 
  BadgeCheck 
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  language: 'en' | 'ar';
}

export default function ProfileView({
  profile,
  language
}: ProfileViewProps) {
  const isRtl = language === 'ar';

  const badges = [
    { title: isRtl ? 'مشغل معتمد' : 'Verified Operator', desc: isRtl ? 'حساب نظام مفعّل بالكامل' : 'Full pipeline license certified', icon: ShieldCheck, color: 'text-cyan-400 bg-cyan-950/20 border-cyan-800/40' },
    { title: isRtl ? 'مستكشف الكموم' : 'Quantum Voyager', desc: isRtl ? 'أكثر من 100 محاولة توليد برمجية' : 'Executed over 100 model inquiries', icon: Zap, color: 'text-indigo-400 bg-indigo-950/20 border-indigo-800/40' },
    { title: isRtl ? 'شغف متواصل' : 'Continuous Synapse', desc: isRtl ? 'سلسلة نشاط متتالية لـ 5 أيام' : 'Maintained 5+ days streak limits', icon: Flame, color: 'text-purple-400 bg-purple-950/20 border-purple-800/40 animate-pulse' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Prime Header Block */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-900/80 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full" />
        
        {/* Real Avatar Frame */}
        <div className="relative">
          <img 
            src={profile.avatar} 
            alt="Operator" 
            className="w-24 h-24 rounded-2xl border-2 border-cyan-400/80 object-cover shadow-lg shadow-cyan-500/10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1.5 rounded-lg border border-neutral-950 shadow">
            <BadgeCheck className="w-4.5 h-4.5 text-white" />
          </div>
        </div>

        {/* Name details list */}
        <div className="text-center md:text-left space-y-2 flex-1">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h2>
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">{profile.tier}</span>
          </div>
          
          <p className="text-xs sm:text-sm text-neutral-400">{profile.email}</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-neutral-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Joined: {profile.joinedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Streak: {profile.streakDays} Days
            </span>
          </div>
        </div>
      </div>

      {/* Numeric Highlights stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isRtl ? 'الرصيد الذكي' : 'Fuel Credits Mapped', value: `${profile.credits}/${profile.maxCredits}` },
          { label: isRtl ? 'تبقي من الرصيد' : 'Fuel Percentage', value: `${Math.floor((profile.credits / profile.maxCredits) * 100)}%` },
          { label: isRtl ? 'عدد الأيام المتصلة' : 'Active Streak Timeline', value: `${profile.streakDays} days` },
          { label: isRtl ? 'المستوى الأمني للاتصال' : 'Security Level Connection', value: 'Quantum L2' }
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-900 text-center space-y-1">
            <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{stat.label}</span>
            <span className="block text-md sm:text-lg font-bold text-white tracking-tight">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Operator achievements badges */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          {isRtl ? 'الأوسمة والاعتمادات الإدراكية' : 'Platform Accreditations'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-neutral-900/20 border border-neutral-900 flex items-center gap-4 group hover:border-neutral-850 transition duration-150"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0 ${b.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                  <p className="text-[10.5px] text-neutral-500 mt-0.5">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
