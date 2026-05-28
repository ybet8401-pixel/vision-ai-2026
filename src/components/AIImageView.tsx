import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Image as ImageIcon,
  Sliders,
  Cpu,
  Wand2,
  EyeOff,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { Generation } from '../types';

interface AIImageViewProps {
  addGeneration: (gen: Omit<Generation, 'id' | 'date'>) => void;
  language: 'en' | 'ar';
}

export default function AIImageView({
  addGeneration,
  language
}: AIImageViewProps) {
  const isRtl = language === 'ar';
  
  // States mapping user decisions
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [engine, setEngine] = useState('flux');
  const [style, setStyle] = useState('none');
  const [lighting, setLighting] = useState('none');
  const [camera, setCamera] = useState('none');
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [sourceUsed, setSourceUsed] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // High-fidelity localized simulation pipeline steps
  const stepMessages = isRtl 
    ? [
        "جاري إرسال المتجهات وتحضير خوارزميات التوليد التدريجي...",
        "جاري الاستعانة بذكاء جيميناي الفائق لتطوير الأوصاف والترجمة...",
        "جاري تهيئة نمط الألوان وإضاءات المعالجة المفضلة...",
        "جاري حقن حقول التباين والبدء في سحب الضبابية الدقيقة...",
        "جاري تحسين الأبعاد وصقل مخرجات اللوحة الفنية..."
      ]
    : [
        "Initiating visual pipeline vectors and model clusters...",
        "Integrating Gemini Cognitive Core for description synthesis...",
        "Applying specialized style matrices and camera options...",
        "Executing latent noise fields and progressive diffusion passes...",
        "Polishing high-fidelity details, contrast, and pixel upscale..."
      ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      setGenerationStep(0);
      interval = setInterval(() => {
        setGenerationStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 2500);
    } else {
      setGenerationStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Aspect ratio configuration ratios map
  const ratios = [
    { value: '1:1', size: { w: 1024, h: 1024 }, label: isRtl ? 'مربع (1:1)' : 'Square (1:1)', icon: '⬜' },
    { value: '16:9', size: { w: 1280, h: 720 }, label: isRtl ? 'سينمائي (16:9)' : 'Cinematic (16:9)', icon: '🎞️' },
    { value: '9:16', size: { w: 720, h: 1280 }, label: isRtl ? 'طولي (9:16)' : 'Portrait (9:16)', icon: '📱' },
    { value: '4:3', size: { w: 1024, h: 768 }, label: isRtl ? 'استوديو (4:3)' : 'Studio (4:3)', icon: '📸' },
    { value: '21:9', size: { w: 1280, h: 544 }, label: isRtl ? 'عريض جداً (21:9)' : 'Ultra-Wide (21:9)', icon: '🖥️' }
  ];

  const stylePresets = [
    { id: 'none', label: isRtl ? 'بدون قالب (حر)' : 'Raw Prompt', icon: '🎨' },
    { id: 'photorealistic', label: isRtl ? '📸 واقعية فوتوغرافية' : '📸 Photorealistic', desc: '8K, raw texture, cinematic details' },
    { id: 'cyberpunk', label: isRtl ? '🌌 سايبيربانك نيون' : '🌌 Cyberpunk Neon', desc: 'Futuristic atmosphere, electric neon glow' },
    { id: 'anime', label: isRtl ? '🎨 أنيمي ياباني' : '🎨 Celestial Anime', desc: 'Vibrant cel-shaded key visual art' },
    { id: '3d_render', label: isRtl ? '🧸 مجسم ثلاثي الأبعاد' : '🧸 Octane 3D Render', desc: 'Smooth glossy Pixar-like figures' },
    { id: 'concept_art', label: isRtl ? '🖼️ رسم مفاهيمي' : '🖼️ Concept Painting', desc: 'Dreamy matte artwork textures' },
    { id: 'origami', label: isRtl ? '📄 مجسم أوريغامي ورقي' : '📄 Paper Origami', desc: 'Delicate stylized clean paper folds' }
  ];

  const lightingPresets = [
    { id: 'none', label: isRtl ? 'إضاءة تلقائية' : 'Ambient Light' },
    { id: 'studio', label: isRtl ? 'استوديو احترافي' : 'Professional Studio' },
    { id: 'neon', label: isRtl ? 'توهج النيون الخلفي' : 'Neon Backlights' },
    { id: 'golden_hour', label: isRtl ? 'الغروب الذهبي الخلاب' : 'Golden Hour Glow' },
    { id: 'lunar', label: isRtl ? 'وهج القمر الفضي' : 'Lunar Moonlight' },
    { id: 'volumetric', label: isRtl ? 'أشعة ريمبراندت الضبابية' : 'Volumetric God Rays' }
  ];

  const cameraPresets = [
    { id: 'none', label: isRtl ? 'منظور تلقائي' : 'Default Angle' },
    { id: 'macro', label: isRtl ? 'ماكرو مقرب جداً' : 'Macro Extreme Close-Up' },
    { id: 'wide', label: isRtl ? 'عدسة سينمائية واسعة' : 'Wide-Angle Cinema' },
    { id: 'drone', label: isRtl ? 'تصوير جوي علوي' : 'Drone Aerial View' },
    { id: 'isometric', label: isRtl ? 'ثنائي الأبعاد آيزومتريك' : '3D Isometric Diorama' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setImageUrl(null);
    setIsImageLoaded(false);

    try {
      const selected = ratios.find(r => r.value === aspectRatio) || ratios[0];
      const { w, h } = selected.size;

      const response = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          aspectRatio: aspectRatio,
          negativePrompt: negativePrompt,
          engine: engine,
          style: style,
          lighting: lighting,
          camera: camera,
          enhancePrompt: enhancePrompt
        })
      });

      if (!response.ok) {
        throw new Error("Local visual matrix engine compilation error");
      }

      const data = await response.json();
      const finalUrl = data.imageUrl;
      const finalSource = data.source || 'FLUX Engine Premium';

      setImageUrl(finalUrl);
      setSourceUsed(finalSource);

      // Add to session generation history securely
      addGeneration({
        type: 'image',
        title: prompt.slice(0, 30) + '...',
        prompt: prompt,
        output: finalUrl,
        aspectRatio: aspectRatio,
        resolution: `${w}x${h}`,
        modelUsed: finalSource
      });

    } catch (err) {
      console.error("High-fidelity image generation failed, activating failsafe:", err);
      // Resilience fallback
      const selected = ratios.find(r => r.value === aspectRatio) || ratios[0];
      const { w, h } = selected.size;
      const fallbackUrl = `https://image.pollinations.ai/p/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${Math.floor(Math.random() * 99999)}&model=${style === 'anime' ? 'flux-anime' : style === 'photorealistic' ? 'flux-realism' : 'flux'}&enhance=true`;
      
      setImageUrl(fallbackUrl);
      setSourceUsed('Pollinations AI (Failsafe XL Core)');
      
      addGeneration({
        type: 'image',
        title: prompt.slice(0, 25) + '... (Resilient Fallback)',
        prompt: prompt,
        output: fallbackUrl,
        aspectRatio: aspectRatio,
        resolution: `${w}x${h}`,
        modelUsed: 'Pollinations AI (Failsafe XL Core)'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `vision_forge_${Date.now()}.png`;
    link.target = "_blank";
    link.click();
  };

  const copyUrl = () => {
    if (!imageUrl) return;
    navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      {/* Parameters Panel Console (2 columns) */}
      <div className="lg:col-span-2 p-5 rounded-2xl bg-neutral-900/40 border border-neutral-850 space-y-5">
        
        {/* Module Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider font-mono">
              {isRtl ? 'معمل التصميم الذكي' : 'Image Engine Parameters'}
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-0.5 rounded-full select-none">
            v4.5 PRO
          </span>
        </div>

        {/* Engine Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5 uppercase font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRtl ? 'محرك التوليد الأساسي:' : 'Visual AI Core Engine:'}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setEngine('flux')}
              className={`p-2.5 rounded-xl border text-center transition flex flex-col justify-center items-center gap-1 cursor-pointer ${
                engine === 'flux' 
                  ? 'bg-neutral-900/90 border-cyan-400 text-cyan-400 ring-1 ring-cyan-400/30' 
                  : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span className="text-xs font-bold font-mono">FLUX.1 Neural</span>
              <span className="text-[9px] text-neutral-500">{isRtl ? 'واقعي ومبهر' : 'Pro Photorealism'}</span>
            </button>
            <button
              onClick={() => setEngine('imagen')}
              className={`p-2.5 rounded-xl border text-center transition flex flex-col justify-center items-center gap-1 cursor-pointer ${
                engine === 'imagen' 
                  ? 'bg-neutral-900/90 border-purple-400 text-purple-400 ring-1 ring-purple-400/30' 
                  : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span className="text-xs font-bold font-mono">Imagen 4 Premium</span>
              <span className="text-[9px] text-neutral-500">{isRtl ? 'جوجل الفائق' : 'Google SOTA Core'}</span>
            </button>
          </div>
        </div>

        {/* Prompt Input & Gemini Enhancer Block */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-neutral-400">{isRtl ? 'فكرة اللوحة الإبداعية:' : 'Visual Concept Prompt:'}</label>
            
            {/* Toggle Switch design */}
            <button
              onClick={() => setEnhancePrompt(!enhancePrompt)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-900 border transition hover:bg-neutral-800 cursor-pointer ${
                enhancePrompt ? 'border-purple-500/40 text-purple-400' : 'border-neutral-800 text-neutral-500'
              }`}
            >
              <Wand2 className={`w-3 h-3 ${enhancePrompt ? 'animate-bounce' : ''}`} />
              <span className="text-[10px] font-mono font-bold select-none">{isRtl ? 'ترقية جيميناي' : 'Gemini Auto-Enhance'}</span>
            </button>
          </div>
          
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={isRtl ? 'صف مشهد تفصيلي هنا... (يمكنك الكتابة بالعربية حيث سيتولى جيميناي ترجمتها وصياغتها باحترافية)' : 'Describe your creative image concept... (Gemini can automatically upgrade and embellish it with photographic details)'}
            rows={3}
            className="w-full px-3 py-2.5 bg-neutral-950 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-xl border border-neutral-850 outline-none focus:border-cyan-400/65 focus:ring-1 focus:ring-cyan-400/20 resize-none transition duration-150"
          />
        </div>

        {/* Negative Prompt Layer */}
        <div className="space-y-1.5">
          <label className="text-[10.5px] font-bold text-neutral-400 flex items-center gap-1">
            <EyeOff className="w-3.5 h-3.5 text-pink-400" />
            <span>{isRtl ? 'عناصر تجنب توليدها (مستبعدات):' : 'Negative Prompt (Avoid):'}</span>
          </label>
          <input 
            type="text"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder={isRtl ? 'جودة ضعيفة، تشوهات، فوضوي، تفاصيل مكررة' : 'blurry, distorted face, low quality, warped hands'}
            className="w-full px-3 py-2 bg-neutral-950 text-xs text-white placeholder-neutral-700 rounded-xl border border-neutral-850 outline-none focus:border-pink-400/50 transition font-mono"
          />
        </div>

        {/* Aspect Ratio Prefs */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isRtl ? 'الأبعاد الهندسية ونسبة العرض:' : 'Aspect Ratio Preference:'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {ratios.map((r, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAspectRatio(r.value)}
                className={`
                  p-2 flex flex-col items-center justify-center rounded-lg border text-center transition duration-200 cursor-pointer
                  ${aspectRatio === r.value 
                    ? 'bg-neutral-900 border-cyan-400 text-cyan-400 ring-1 ring-cyan-400/20' 
                    : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'}
                `}
              >
                <span className="text-xs mb-0.5">{r.icon}</span>
                <span className="text-[8.5px] font-bold font-mono whitespace-nowrap">{r.value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Section: Presets Styles, Lighting, Camera */}
        <div className="border-t border-neutral-850 pt-4 space-y-3.5">
          {/* Preset Art Style */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] font-mono text-neutral-400">{isRtl ? 'قالب النمط الفني:' : 'Artistic Preset Template:'}</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 text-xs text-neutral-300 rounded-lg border border-neutral-850 focus:border-cyan-400 outline-none cursor-pointer"
            >
              {stylePresets.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Lighting Preset */}
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-mono text-neutral-400">{isRtl ? 'تجاويف الإضاءة:' : 'Studio Lighting:'}</label>
              <select
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 text-xs text-neutral-300 rounded-lg border border-neutral-850 focus:border-cyan-400 outline-none cursor-pointer"
              >
                {lightingPresets.map(l => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Camera Angle Preset */}
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-mono text-neutral-400">{isRtl ? 'منظور الكاميرا:' : 'Camera Preset:'}</label>
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 text-xs text-neutral-300 rounded-lg border border-neutral-850 focus:border-cyan-400 outline-none cursor-pointer"
              >
                {cameraPresets.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Generate Trigger Button */}
        <button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 disabled:from-neutral-900 disabled:to-neutral-950 disabled:text-neutral-600 transition duration-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/5 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
              <span>{isRtl ? 'جاري رسم الأبعاد طيفياً...' : 'Synthesizing creative pixels...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{isRtl ? 'توليد الصورة الذكية الآن' : 'Initiate Image Generation'}</span>
            </>
          )}
        </button>

      </div>

      {/* Visual Render Canvas Area (3 columns) */}
      <div className="lg:col-span-3 min-h-[460px] flex flex-col justify-between p-6 rounded-2xl bg-neutral-950/40 border border-neutral-850 relative overflow-hidden">
        
        {/* Subtle decorative glowing backdrops */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/5 blur-[90px] -z-10 rounded-full" />
        <div className="absolute bottom-4 left-4 w-44 h-44 bg-purple-500/5 blur-[80px] -z-10 rounded-full" />

        {/* 1. Standby Empty Placeholder state */}
        {!imageUrl && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
            <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-center shadow-lg">
              <ImageIcon className="w-6 h-6 text-neutral-600 animate-pulse" />
            </div>
            <div>
              <p className="text-white text-sm font-bold tracking-wide">
                {isRtl ? 'بوابة العرض مستعدة للرسم' : 'Awaiting Forge Request'}
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
                {isRtl 
                  ? 'قم بإدخال تفاصيل الخيال والأبعاد بالجانب الأيسر، ثم اضغط زر التوليد لتفويض الخوادم الذكية وبدء المعالجة فورا.' 
                  : 'Enter visual coordinates, select styles of choice on the parameter matrix, and engage deep neural visual clusters.'}
              </p>
            </div>
          </div>
        )}

        {/* 2. Generation Progress Loading state with steps telemetry */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border border-cyan-500/20 border-t-cyan-400 border-r-purple-500 animate-spin"></div>
              <Cpu className="w-4.5 h-4.5 text-cyan-400 absolute animate-pulse" />
            </div>
            
            <div className="space-y-3 font-mono text-xs text-neutral-400 max-w-sm">
              <div className="text-cyan-400 font-bold uppercase tracking-widest animate-pulse flex items-center justify-center gap-1.5">
                <span>{isRtl ? '// التوليف العصبي نشط حالياً' : '// CORE SYNTHESIS ACTIVE'}</span>
              </div>
              
              {/* Dynamic live simulation step messages */}
              <div className="bg-neutral-950/80 border border-neutral-900 rounded-xl px-4 py-3 text-[11px] text-neutral-300 min-h-[50px] flex items-center justify-center leading-relaxed">
                {stepMessages[generationStep]}
              </div>

              {/* Progress visual bar */}
              <div className="w-40 h-1 bg-neutral-900 rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700 ease-out"
                  style={{ width: `${(generationStep + 1) * 20}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* 3. High Fidelity Generated Image output viewport */}
        {imageUrl && !loading && (
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            
            {/* Display screen wrapper with neat responsive scaling & frame bounds */}
            <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-900 shadow-2xl overflow-hidden flex items-center justify-center flex-1 max-h-[500px] relative">
              {!isImageLoaded && (
                <div className="absolute inset-x-3 inset-y-3 rounded-xl bg-neutral-900/50 animate-pulse backdrop-blur-xl flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-neutral-700" />
                </div>
              )}
              <img 
                src={imageUrl} 
                alt="Vision AI Smart Frame Output" 
                className={`rounded-xl max-h-[440px] max-w-full object-contain shadow-md hover:scale-[1.01] transition-all duration-700 border border-neutral-900 ${isImageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>

            {/* Controls, Telemetry labels and action buttons footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-neutral-950/70 border border-neutral-900 font-mono text-xs">
              
              {/* Model usage data badges */}
              <div className="flex items-center gap-1.5 text-neutral-500 overflow-hidden text-ellipsis whitespace-nowrap">
                <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span className="truncate max-w-[280px]">
                  {isRtl ? 'مصدر الإنشاء:' : 'Engine:'} <strong className="text-cyan-400">{sourceUsed}</strong>
                </span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto shrink-0">
                <button 
                  onClick={copyUrl}
                  className="flex-1 sm:flex-initial px-3 py-2 text-[10.5px] font-bold bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{copied ? (isRtl ? 'تم نسخ الرابط!' : 'Copied!') : (isRtl ? 'نسخ الرابط' : 'Copy URL')}</span>
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex-1 sm:flex-initial px-3.5 py-2 text-[10.5px] font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-lg transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>{isRtl ? 'تحميل PNG' : 'Download Output'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
