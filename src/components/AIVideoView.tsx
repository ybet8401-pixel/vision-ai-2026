import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Video, 
  Film, 
  Play, 
  Pause, 
  Download, 
  Cpu, 
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Generation } from '../types';
import AIVideoPlayer from './AIVideoPlayer';
import RewardedAd from './ads/RewardedAd';
import InArticleAd from './ads/InArticleAd';
import LiveGenerationProgress from './LiveGenerationProgress';

interface AIVideoViewProps {
  addGeneration: (gen: Omit<Generation, 'id' | 'date'>) => void;
  language: 'en' | 'ar';
  checkUsageLimit?: () => Promise<boolean>;
  isPremium?: boolean;
}

export default function AIVideoView({
  addGeneration,
  language,
  checkUsageLimit,
  isPremium
}: AIVideoViewProps) {
  const isRtl = language === 'ar';
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [styleDesc, setStyleDesc] = useState('Realistic Animation');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const steps = isRtl 
    ? [
        { label: 'تحليل الصورة وبناء المجسم', desc: 'استخراج الملامح والأبعاد...' },
        { label: 'فهم الحركة المطلوبة', desc: 'تطبيق موجه النص على المجسم...' },
        { label: 'رندرة الإطارات', desc: 'إنشاء الحركة بسلاسة...' },
        { label: 'تجميع الإطارات النهائية', desc: 'توليد فيديو الانيميشن...' }
      ]
    : [
        { label: 'Analyzing Image & Modeling', desc: 'Extracting features and dimensions...' },
        { label: 'Processing Motion Prompt', desc: 'Mapping text prompt to skeletal movement...' },
        { label: 'Rendering Motion Frames', desc: 'Synthesizing smooth animation frames...' },
        { label: 'Finalizing Video Assembly', desc: 'Stitching frames into complete MP4...' }
      ];

  const handleImageFile = (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size exceeds 10MB limit. Please provide a smaller image.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  };

  // JOB POLLING EFFECT
  useEffect(() => {
    if (!jobId || !loading) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/ai/video/status/${jobId}`);
        if (!res.ok) throw new Error("Job tracking failed");
        
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
        
        // Update active step based on progress for visual feedback
        if (data.progress > 0) setActiveStep(0);
        if (data.progress > 25) setActiveStep(1);
        if (data.progress > 50) setActiveStep(2);
        if (data.progress > 75) setActiveStep(3);
        
        if (data.status === 'completed') {
           clearInterval(pollInterval);
           setVideoUrl(data.videoUrl);
           setLoading(false);
           setJobId(null);
           addGeneration({
              type: 'video',
              title: prompt.slice(0, 35) + '...',
              prompt: prompt,
              output: data.videoUrl,
              duration: '5s',
              modelUsed: data.source || 'Motion-AI'
           });
        } else if (data.status === 'failed') {
           clearInterval(pollInterval);
           setErrorMsg(data.error || "Generation failed in processing pipeline.");
           setLoading(false);
           setJobId(null);
        }
      } catch (err: any) {
        console.warn("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [jobId, loading, prompt, addGeneration]);

  const handleStartGenerate = async () => {
    if (!prompt.trim() || !imagePreview || loading) return;
    
    if (checkUsageLimit) {
      const allowed = await checkUsageLimit();
      if (!allowed) return;
    }

    setLoading(true);
    setActiveStep(0);
    setVideoUrl(null);
    setErrorMsg(null);
    setJobId(null);
    setLogs(["Initializing upload..."]);

    try {
      const response = await fetch('/api/ai/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          image: imagePreview,
          style: styleDesc
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Generation submission failed");
      }
      
      setJobId(data.jobId);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `motion_ai_${Date.now()}.mp4`;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      {/* Parameters panel (2 cols) */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 space-y-6">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
            {isRtl ? 'محرك تحريك الصور الذكي' : 'AI Motion & Animation System'}
          </h3>
        </div>

        {/* Image Upload Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400">{isRtl ? 'صورة الشخصية / الوجه:' : 'Base Character / Face Image:'}</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`w-full relative h-[140px] flex flex-col items-center justify-center border-2 border-dashed ${isDragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-neutral-800 bg-neutral-950 hover:border-indigo-500'} rounded-xl transition cursor-pointer overflow-hidden group`}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-bold">{isRtl ? 'تغيير الصورة' : 'Change Image'}</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-neutral-500">
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">{isRtl ? 'اسحب الصورة أو اضغط هنا' : 'Drag & drop image or click'}</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs sm:text-sm font-bold flex flex-col gap-3">
            <span>{errorMsg}</span>
            <button 
              onClick={handleStartGenerate}
              className="bg-red-900/50 hover:bg-red-800 text-white py-2 rounded-lg transition"
            >
              {isRtl ? 'إعادة المحاولة' : 'Retry Generation'}
            </button>
          </div>
        )}

        {/* Motion Prompt Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400">{isRtl ? 'أمر الحركة (ماذا يفعـل؟):' : 'Motion Command (Action):'}</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={isRtl ? 'اجعلني أركض بسرعة الكاميرا تتبعني...' : 'Make this character walk forward, waving their hands...'}
            rows={3}
            className="w-full px-4 py-3 bg-neutral-950 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-xl border border-neutral-850 outline-none focus:border-indigo-400 transition resize-none"
          />
        </div>

        {/* Animation Style Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400">{isRtl ? 'نمط التحريك:' : 'Animation Style:'}</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Realistic Animation', 'Anime Action', '3D Pixar Style', 'Smooth Lip Sync'].map((s) => (
              <button
                key={s}
                onClick={() => setStyleDesc(s)}
                className={`
                  p-2.5 rounded-xl border font-bold transition duration-200
                  ${styleDesc === s 
                    ? 'bg-neutral-900 border-indigo-400 text-indigo-400' 
                    : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'}
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleStartGenerate}
          disabled={!prompt.trim() || !imagePreview || loading}
          className="w-full py-4.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 hover:opacity-95 disabled:from-neutral-900 disabled:to-neutral-950 disabled:text-neutral-600 transition font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/15 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{isRtl ? 'جاري تحريك الصورة...' : 'Animating Image...'}</span>
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              <span>{isRtl ? 'إنشاء فيديو حركي' : 'Generate Motion Video'}</span>
            </>
          )}
        </button>

        <RewardedAd isPremium={isPremium} />
      </div>

      {/* Presentation screen (3 cols) */}
      <div className="lg:col-span-3 min-h-[400px] flex flex-col justify-between p-6 rounded-2xl bg-neutral-900/15 border border-neutral-900 relative">
        <div className="absolute inset-0 bg-indigo-500/5 blur-3xl -z-10 rounded-full" />

        {!videoUrl && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-16">
            <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-center">
              <Film className="w-7 h-7 text-neutral-600 animate-pulse" />
            </div>
            <div>
              <p className="text-white text-md font-bold">{isRtl ? 'الاستوديو فارغ' : 'Motion Studio Standby'}</p>
              <p className="text-xs text-neutral-500 max-w-sm mt-1">
                {isRtl 
                  ? 'ارفع صورة واكتب وصف التحريك لبدء بناء الفيديو.' 
                  : 'Upload an image and write a motion prompt to animate.'}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col justify-center h-full mx-auto space-y-8 w-full max-w-md py-6">
            <div className="flex items-center justify-between text-cyan-400 font-mono text-xs uppercase tracking-widest border-b border-neutral-900 pb-2">
              <div className="flex items-center gap-2.5 animate-pulse">
                <Cpu className="w-4 h-4 animate-spin-slow" />
                <span>Motion Engine Active</span>
              </div>
              <span>{Math.round((activeStep + 1) / steps.length * 100)}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-1000 ease-out"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                />
            </div>

            <div className="space-y-4">
              {steps.map((st, idx) => {
                const stepActive = activeStep === idx;
                const stepPassed = idx < activeStep;
                return (
                  <div key={idx} className={`flex gap-3 text-xs transition-opacity duration-300 ${stepActive ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono text-[9px] border ${
                      stepPassed ? 'bg-indigo-950 border-emerald-500/50 text-emerald-400' :
                      stepActive ? 'bg-indigo-900 border-indigo-500 text-white animate-pulse' :
                      'bg-neutral-950 border-neutral-850 text-neutral-600'
                    }`}>
                      {stepPassed ? '✓' : idx + 1}
                    </div>

                    <div className="min-w-0">
                      <p className={`font-semibold ${stepActive ? 'text-white' : 'text-neutral-400'}`}>
                        {st.label}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {logs.length > 0 && (
              <div className="mt-4 p-3 bg-neutral-950 border border-neutral-900 rounded-xl h-24 overflow-y-auto text-[10px] font-mono text-neutral-500 space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-neutral-700">[{new Date().toLocaleTimeString()}]</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Real output display frame */}
        {videoUrl && !loading && (
          <div className="space-y-6 flex-1 flex flex-col justify-between items-center w-full max-w-2xl mx-auto">
            <div className="bg-neutral-950/40 p-2.5 rounded-2xl border border-neutral-900 shadow-xl overflow-hidden flex items-center justify-center w-full relative">
              <AIVideoPlayer 
                src={videoUrl}
                language={language}
                aspectRatioLabel="16:9"
                fpsLabel={60}
              />
              {!isPremium && (
                <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 flex items-center gap-2 pointer-events-none z-50">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <span className="text-white text-xs font-mono font-bold tracking-widest opacity-80">OmniNexa AI Trial</span>
                </div>
              )}
            </div>

            <div className="flex w-full flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950/50 border border-neutral-900 font-mono text-xs">
              <span className="text-neutral-500 uppercase">HD Motion Stream Completed</span>
              
              <button 
                onClick={handleDownload}
                className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-500/15 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تحميل MP4' : 'Download Video'}</span>
              </button>
            </div>
            
            <InArticleAd isPremium={isPremium} />
          </div>
        )}

      </div>
    </div>
  );
}

