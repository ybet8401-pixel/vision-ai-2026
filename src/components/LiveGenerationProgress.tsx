import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, CircleDashed } from 'lucide-react';

export default function LiveGenerationProgress({ isRtl, type }: { isRtl: boolean, type: string }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = type === 'image' ? [
       { en: "Analyzing prompt", ar: "تحليل المطالبة" },
       { en: "Optimizing prompt", ar: "تحسين وتوسعة المطالبة" },
       { en: "Selecting model", ar: "اختيار النموذج" },
       { en: "Generating image", ar: "توليد الصورة" },
       { en: "Enhancing quality", ar: "تعزيز الجودة" },
       { en: "Validating result", ar: "التحقق من النتيجة" }
  ] : [
       { en: "Understanding request", ar: "تحليل المتطلبات" },
       { en: "Planning architecture", ar: "تخطيط المعمارية" },
       { en: "Generating UI", ar: "إنشاء واجهة المستخدم" },
       { en: "Generating backend", ar: "إنشاء الواجهة الخلفية" },
       { en: "Generating assets", ar: "إنشاء العناصر" },
       { en: "Optimizing result", ar: "تحسين الأداء" },
       { en: "Validating quality", ar: "التحقق من الجودة" },
       { en: "Preparing deployment", ar: "تجهيز النشر" }
  ];

  useEffect(() => {
    let timers: any[] = [];
    if (type === 'image') {
       timers.push(setTimeout(() => setCurrentStep(1), 1500));
       timers.push(setTimeout(() => setCurrentStep(2), 2500));
       timers.push(setTimeout(() => setCurrentStep(3), 3500));
       timers.push(setTimeout(() => setCurrentStep(4), 7000));
       timers.push(setTimeout(() => setCurrentStep(5), 9000));
    } else {
       timers.push(setTimeout(() => setCurrentStep(1), 1500));
       timers.push(setTimeout(() => setCurrentStep(2), 3500));
       timers.push(setTimeout(() => setCurrentStep(3), 6000));
       timers.push(setTimeout(() => setCurrentStep(4), 8500));
       timers.push(setTimeout(() => setCurrentStep(5), 10500));
       timers.push(setTimeout(() => setCurrentStep(6), 12500));
       timers.push(setTimeout(() => setCurrentStep(7), 14000));
    }

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [type]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-28 flex-1 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-cyan-500/20 blur-[40px] rounded-full scale-150 animate-pulse"></div>
        <div className="w-16 h-16 bg-neutral-950 border border-cyan-800/50 rounded-2xl flex items-center justify-center relative z-10 shadow-lg shadow-cyan-900/40">
          <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center font-sans space-y-1 relative z-10">
        <h3 className="text-lg font-bold text-white tracking-wide">
          {isRtl ? 'جاري المعالجة الكمية' : 'Neural Processing'}
        </h3>
        <p className="text-xs text-cyan-400/80 font-mono tracking-widest uppercase">
          {type === 'image' ? 'IMAGE SYNTHESIS ENGINE' : type === 'video' ? 'MOTION ENGINE ACTIVE' : 'COGNI-CORE COMPILER'}
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-3 font-mono text-xs text-left relative z-10 bg-neutral-950/60 p-5 rounded-2xl border border-neutral-900/80 shadow-2xl backdrop-blur-xl">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
          return (
            <div key={idx} className={`flex items-center gap-3 transition-all duration-300 ${isDone ? 'opacity-60 grayscale' : isActive ? 'opacity-100 scale-105' : 'opacity-30'}`}>
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                 {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : isActive ? <CircleDashed className="w-4 h-4 text-cyan-400 animate-spin" /> : <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full" />}
              </div>
              <span className={`tracking-wide ${isActive ? 'text-cyan-300 font-bold' : isDone ? 'text-neutral-300' : 'text-neutral-500'}`}>
                {isRtl ? step.ar : step.en}
                {isActive && <span className="animate-pulse">...</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
