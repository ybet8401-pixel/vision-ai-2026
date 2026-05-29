import { useState } from 'react';
import { Check, Sparkles, Shield, Cpu, Zap, BadgeAlert } from 'lucide-react';

interface PricingViewProps {
  language: 'en' | 'ar';
  userId?: string | null;
}

export default function PricingView({
  language,
  userId
}: PricingViewProps) {
  const isRtl = language === 'ar';
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: string) => {
    if (plan === 'free') {
      alert(isRtl ? 'المستوى مجاني ومكفول بالكامل حالياً.' : 'Integration successful. Access is authenticated.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Payment initialization failed');
      }
    } catch (e) {
      alert('Network error connecting to payment gateway.');
    }
    setLoading(false);
  };

  const plans = [
    {
      title: isRtl ? 'المستوى الأساسي' : 'Standard Voyager',
      price: '$0',
      period: isRtl ? 'مجاني للأبد' : 'Free Forever',
      desc: isRtl ? 'الوصول الأساسي مع إعلانات وعلامة مائية' : 'Basic access supported by ads (with watermarks)',
      features: isRtl 
        ? ['الاستخدام المحدود للتطبيقات (إعلانات بعد 4 استخدام)', 'محدودية في الصور والفيديو (إعلانات كل 2 استخدام)', 'سرعة رندرة عادية (Standard Speed)', 'وجود علامة مائية على المشاريع']
        : ['Limited usage (Ads after 4 apps generated)', 'Ad unlocks needed every 2 image/video generations', 'Standard render speed and public queue', 'Media may contain watermarks'],
      buttonText: isRtl ? 'المستوى النشط حالياً' : 'Active Plan',
      active: true,
      color: 'border-neutral-900 bg-neutral-950/40 text-neutral-400'
    },
    {
      title: isRtl ? 'محترفي الكوانتم' : 'Quantum Pro',
      price: '$70',
      period: isRtl ? '/ أسبوع (7 أيام)' : '/ 7 Days',
      desc: isRtl ? 'حساب متكامل للاجتهاد والتطوير بلا حدود' : 'Maximum reasoning thresholds with elite speed & no ads',
      features: isRtl 
        ? ['بدون إعلانات نهائياً', 'استخدام غير محدود للتطبيقات والصور والفيديو', 'أولوية معالجة علي الخادم الكمي وبدون انتظار', 'بدون علامة مائية (No Watermark)', 'أدوات ذكاء اصطناعي إضافية وحفظ للمشاريع']
        : ['Completely Ad-Free Experience', 'Unlimited App, Video & Image Generations', 'Queue Priority & Maximum Rendering Speed', 'No Watermarks on Output Media', 'Exclusive AI Tools & Cloud Project Saving'],
      buttonText: isRtl ? 'الترقية الآن (PayPal)' : 'Upgrade to Pro (PayPal)',
      active: false,
      color: 'border-indigo-505 bg-indigo-950/15 text-indigo-400 border border-indigo-900/50 relative shadow-lg shadow-indigo-500/5'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          {isRtl ? 'مصفوفات ترقية خط البث' : 'Vocal Matrix & Pipeline Licenses'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans">
          {isRtl 
            ? 'احصل على سرعات خارقة وقدرة رندرة متكاملة، واستخدم جميع النماذج الكونية الحرة للأبد وبطريقة مأمونة.' 
            : 'Unchain maximum computing thresholds and high-priority custom model weights on-demand.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((p, idx) => (
          <div 
            key={idx}
            className={`p-6 rounded-2xl border flex flex-col justify-between h-auto ${p.color}`}
          >
            {p.title.includes('Pro') || p.title.includes('محترفي') ? (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full border border-indigo-400/30 text-[9px] font-mono font-bold text-white uppercase tracking-widest animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" />
                <span>RECOMMENDED MATRIX</span>
              </div>
            ) : null}

            <div className="space-y-5">
              <div className="space-y-2">
                <span className="block text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">{p.title}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">{p.price}</span>
                  <span className="text-xs text-neutral-500 font-mono">{p.period}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{p.desc}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-3 pt-3 border-t border-neutral-900/60 text-xs">
                {p.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex gap-2.5 items-start text-neutral-300">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight font-sans">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => handleCheckout(p.title.includes('Pro') || p.title.includes('محترفي') ? 'pro' : 'free')}
              disabled={loading}
              className={`
                w-full py-3.5 mt-8 rounded-xl font-bold text-xs tracking-wider uppercase transition duration-300 cursor-pointer
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${p.active 
                  ? 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white' 
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/10'}
              `}
            >
              {loading && !p.active ? 'Processing...' : p.buttonText}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
