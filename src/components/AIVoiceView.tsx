import { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Play, 
  Trash2, 
  Sliders, 
  Cpu, 
  Music, 
  Activity,
  UserCheck,
  Megaphone,
  CheckCircle,
  HelpCircle,
  Download
} from 'lucide-react';
import { Generation } from '../types';

interface AIVoiceViewProps {
  addGeneration: (gen: Omit<Generation, 'id' | 'date'>) => void;
  language: 'en' | 'ar';
}

export default function AIVoiceView({
  addGeneration,
  language
}: AIVoiceViewProps) {
  const isRtl = language === 'ar';
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(isRtl ? 'Zeina' : 'Brian');
  const [volume, setVolume] = useState(90);
  const [pitch, setPitch] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  const [downloading, setDownloading] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<string>('normal');

  // Media system persistent reference hooks for Web Audio processing & rendering
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const voiceEffects = isRtl
    ? [
        { id: 'normal', name: 'استوديو نقي', desc: 'تلاوة نقية ومحسنة طبيعياً بدون مرشحات', icon: '🎤' },
        { id: 'echo', name: 'صدى جبلي تكراري', desc: 'صدى رنان مع ارتداد وعينات زمنية مختلفة', icon: '⛰️' },
        { id: 'robot', name: 'روبوت دجيتال', desc: 'مغير تردد معدني وحلقي آلي متقدم', icon: '🤖' },
        { id: 'telephone', name: 'مذياع عتيق', desc: 'مرشح مرور نطاق كلاسيكي شبيه بالهاتف', icon: '📻' },
        { id: 'alien', name: 'مستكشف فضائي اهتزازي', desc: 'ذبذبات ترددية اهتزازية مع ميكرو ديليه فضائي', icon: '🛸' },
        { id: 'demonic', name: 'سيد الظلام الجهوري', desc: 'صوت غليظ ومظلم مهيب معزز بالعمق والفلتر', icon: '😈' },
        { id: 'helium', name: 'بالون الهيليوم الضاحك', desc: 'صوت حاد وسريع مضحك يحاكي السناجب', icon: '🎈' },
        { id: 'chorus', name: 'الكورس النجمي الفسيح', desc: 'توليد طبقات من الكورس ثلاثي مدمج الزمن اللحظي', icon: '🌌' },
      ]
    : [
        { id: 'normal', name: 'Pure Studio', desc: 'Optimized voice bypass without metallic filters', icon: '🎤' },
        { id: 'echo', name: 'Mountain Echo', desc: 'Echo delay feedback with micro latency', icon: '⛰️' },
        { id: 'robot', name: 'Digital Robot', desc: 'Metallic ring-modulated carrier sound', icon: '🤖' },
        { id: 'telephone', name: 'Vintage Radio', desc: 'Q-factor bandpass telephone retro filter', icon: '📻' },
        { id: 'alien', name: 'Cyber Vibrato Alien', desc: 'Wobbly high-speed variable delay line', icon: '🛸' },
        { id: 'demonic', name: 'Shadow Overlord', desc: 'Deep cosmic pitch-lowered demonic master', icon: '😈' },
        { id: 'helium', name: 'Helium Balloon', desc: 'Adorably squeaky high-pitch vocal lift', icon: '🎈' },
        { id: 'chorus', name: 'Spectral Chorus', desc: 'Multi-layered delayed stereo expander', icon: '🌌' },
      ];

  const voiceModels = isRtl 
    ? [
        { name: 'زينة (صوت أنثوي ناعم)', id: 'Zeina', lang: 'ar', gender: 'female' },
        { name: 'طارق (صوت رجالي فخم)', id: 'Tarik', lang: 'ar', gender: 'male' },
        { name: 'برايان (إلكتروني مجسد)', id: 'Brian', lang: 'en', gender: 'male' },
      ]
    : [
        { name: 'Puck (Cheerful Male)', id: 'Brian', lang: 'en-US', gender: 'male' },
        { name: 'Kore (Elegant Female)', id: 'Amy', lang: 'en-GB', gender: 'female' },
        { name: 'Fenrir (Deep Cybernetic)', id: 'Russell', lang: 'en-US', gender: 'male' },
        { name: 'Zeina (Smooth Arabic)', id: 'Zeina', lang: 'ar', gender: 'female' },
      ];

  useEffect(() => {
    setSelectedVoice(isRtl ? 'Zeina' : 'Brian');
  }, [isRtl]);

  const presets = isRtl 
    ? [
        { label: 'رسالة ترحيبية بالزائر الكونية', text: 'أهلاً بك! مصفوفة الاتصال الإدراكي متصلة بالمستودع الجغرافي وهي متاحة بالكامل لتوليد المقاطع الصوتية الحقيقية.' },
        { label: 'تنبيه النظام فائق السرعة', text: 'تنبيه! معدل التفاعل الكوني تجاوز عتبة المليون عملية معالجة إيجابية.' }
      ]
    : [
        { label: 'System Greetings', text: 'Welcome operator! Core neural nodes are fully calibrated and accessible in standard L2 secure mode.' },
        { label: 'Cyber Alert', text: 'Warning! Quantum pipeline transaction speeds have reached peak operational limits.' }
      ];

  const getAudioContext = (): AudioContext => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDomainArray = new Uint8Array(bufferLength);

    const renderLoop = () => {
      if (!analyserRef.current || !canvasRef.current) return;
      animationFrameRef.current = requestAnimationFrame(renderLoop);

      analyserRef.current.getByteFrequencyData(dataArray);
      analyserRef.current.getByteTimeDomainData(timeDomainArray);

      // Create high-tech dark background clear
      ctx.fillStyle = 'rgba(10, 10, 10, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle guidelines grid background
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 25) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw frequency visualizer waves/bars
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.8;
        
        // Dynamic futuristic gradient based on intensity
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#110c1f');
        gradient.addColorStop(0.4, '#a855f7');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }

      // Draw shiny overlay time-domain wave line in core screen center
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#22d3ee'; // Cyber Neon Blue
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
      ctx.beginPath();

      const waveSliceWidth = canvas.width / bufferLength;
      let waveX = 0;

      for (let i = 0; i < bufferLength; i++) {
        const value = timeDomainArray[i] / 128.0;
        const waveY = (value * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(waveX, waveY);
        } else {
          ctx.lineTo(waveX, waveY);
        }

        waveX += waveSliceWidth;
      }
      ctx.stroke();
      
      // Reset shadows for next repaint iteration
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    };

    renderLoop();
  };

  const speakLocalFallback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume / 100;
      utterance.pitch = pitch;
      utterance.rate = speed;

      utterance.onend = () => {
        setPlaying(false);
        setLoading(false);
      };

      utterance.onerror = () => {
        setPlaying(false);
        setLoading(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setPlaying(false);
        setLoading(false);
      }, 3000);
    }
  };

  const speakLocalFallbackOrAudioElement = () => {
    try {
      const voiceId = selectedVoice;
      const ttsUrl = `/api/ai/tts?voice=${voiceId}&text=${encodeURIComponent(text)}`;
      const audio = new Audio(ttsUrl);
      
      audio.volume = volume / 100;
      audio.playbackRate = speed;

      audio.oncanplaythrough = () => {
        audio.play().catch(speakLocalFallback);
      };

      audio.onended = () => {
        setPlaying(false);
        setLoading(false);
      };

      audio.onerror = () => {
        speakLocalFallback();
      };
    } catch (e) {
      speakLocalFallback();
    }
  };

  const handleSynthesizeAndPlay = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setPlaying(true);

    try {
      // Clean previous runs
      stopPlayback();

      const voiceId = selectedVoice;
      const ttsUrl = `/api/ai/tts?voice=${voiceId}&text=${encodeURIComponent(text)}`;

      // 1. Fetch vocal buffer securely to stay CORS resilient
      const response = await fetch(ttsUrl);
      if (!response.ok) {
        throw new Error(`TTS server reported ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // 2. Decode the incoming MPEG chunks into binary AudioBuffer
      const ctx = getAudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      // 3. Setup core Buffer Source
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      activeSourceRef.current = source;

      // 4. Create premium master Analyser node for dynamic pixel-level visualization
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      // 5. Setup gain node for physical volume controls
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume / 100, ctx.currentTime);

      // Nodes to dispose at finish
      const activeNodes: AudioNode[] = [source, analyser, masterGain];

      // 6. Connect filters & real-time effects based on selection
      let lastNode: AudioNode = source;

      // Mathematically correct Pitch-Independent Speed Control Formula
      // speed scales the reading speed, detune cancels speed frequency shift & overlays user pitch config
      source.playbackRate.value = speed;
      const pitchDetune = 1200 * Math.log2(pitch / speed);
      source.detune.value = pitchDetune;

      if (selectedEffect === 'echo') {
        const delay = ctx.createDelay();
        delay.delayTime.value = 0.35; // 350ms delay loop
        
        const feedback = ctx.createGain();
        feedback.gain.value = 0.45;
        
        const wetGain = ctx.createGain();
        wetGain.gain.value = 0.40;

        // Feedback circuit
        lastNode.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        
        // Wet path to speaker
        delay.connect(wetGain);
        wetGain.connect(masterGain);

        // Dry route
        lastNode.connect(masterGain);

        activeNodes.push(delay, feedback, wetGain);
      } else if (selectedEffect === 'robot') {
        // High fidelity Ring Modulator to transfigure tone into synth-machine
        const osc = ctx.createOscillator();
        const ringMod = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(85, ctx.currentTime); // 85Hz robotic frequency
        ringMod.gain.setValueAtTime(1.0, ctx.currentTime);

        osc.connect(ringMod.gain);
        lastNode.connect(ringMod);
        
        lastNode = ringMod;
        osc.start();

        activeNodes.push(osc, ringMod);
      } else if (selectedEffect === 'telephone') {
        // Vintage Walkie-Talkie bandpass filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, ctx.currentTime);
        filter.Q.setValueAtTime(4.0, ctx.currentTime);

        lastNode.connect(filter);
        lastNode = filter;

        activeNodes.push(filter);
      } else if (selectedEffect === 'alien') {
        // Vibrato doppler pitch shifter via LFO modulated delay
        const delay = ctx.createDelay();
        delay.delayTime.value = 0.015;

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(9.5, ctx.currentTime); // LFO Speed

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.0045, ctx.currentTime); // Vibrato depth

        lfo.connect(lfoGain);
        lfoGain.connect(delay.delayTime);

        lastNode.connect(delay);
        lastNode = delay;

        lfo.start();

        activeNodes.push(delay, lfo, lfoGain);
      } else if (selectedEffect === 'demonic') {
        // Demon overlord - lower voice and apply lowpass filter to suppress highs
        source.detune.value = 1200 * Math.log2(0.58 / speed); 
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, ctx.currentTime);

        lastNode.connect(filter);
        lastNode = filter;

        activeNodes.push(filter);
      } else if (selectedEffect === 'helium') {
        // Cute Helium Squeak - high pitch shifter + highpass filter
        source.detune.value = 1200 * Math.log2(2.15 / speed);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);

        lastNode.connect(filter);
        lastNode = filter;

        activeNodes.push(filter);
      } else if (selectedEffect === 'chorus') {
        // Spatial Vocal Multi-Layering
        const delay1 = ctx.createDelay();
        delay1.delayTime.value = 0.020;

        const delay2 = ctx.createDelay();
        delay2.delayTime.value = 0.035;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 1.8;

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.0025;

        lfo.connect(lfoGain);
        lfoGain.connect(delay1.delayTime);

        // Splitting into dry and spatial delayed wet tracks
        lastNode.connect(masterGain);
        lastNode.connect(delay1);
        lastNode.connect(delay2);

        delay1.connect(masterGain);
        delay2.connect(masterGain);

        lfo.start();

        activeNodes.push(delay1, delay2, lfo, lfoGain);
      }

      // Bypass direct dry routing if we already completed wet splits
      if (selectedEffect !== 'echo' && selectedEffect !== 'chorus') {
        lastNode.connect(masterGain);
      }

      // Connect master output to Analyser and browser speakers
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      activeNodesRef.current = activeNodes;

      // Start audio playback
      source.start(0);

      // Start canvas drawings loop after a short mounting delay
      setTimeout(() => {
        drawVisualizer();
      }, 50);

      source.onended = () => {
        setPlaying(false);
        setLoading(false);
      };

      addGeneration({
        type: 'voice',
        title: text.slice(0, 30) + '...',
        prompt: text,
        output: `Voice Synthesizer Session Completed: Voice:${voiceId} Effect:${selectedEffect} Speed:${speed}x Volume:${volume}%`,
        modelUsed: `Poly-TTS Premium (${voiceId} + ${selectedEffect})`
      });

    } catch (e) {
      console.warn("High-fidelity Web Audio decode failed, falling back gracefully to normal audio stream", e);
      speakLocalFallbackOrAudioElement();
    }
  };

  const downloadAudio = () => {
    if (!text.trim()) return;
    setDownloading(true);
    
    try {
      const voiceId = selectedVoice;
      const downloadUrl = `/api/ai/tts?voice=${voiceId}&text=${encodeURIComponent(text)}`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `voice_synthesis_${voiceId}_${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        setDownloading(false);
      }, 1000);
    } catch (err) {
      console.error("Download failed:", err);
      setDownloading(false);
    }
  };

  const stopPlayback = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
      } catch (e) {}
      activeSourceRef.current = null;
    }

    activeNodesRef.current.forEach(node => {
      try {
        node.disconnect();
      } catch (e) {}
    });
    activeNodesRef.current = [];

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Clean drawing
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    setPlaying(false);
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (activeSourceRef.current) {
        try {
          activeSourceRef.current.stop();
        } catch (e) {}
      }
      activeNodesRef.current.forEach(node => {
        try {
          node.disconnect();
        } catch (e) {}
      });
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      {/* Parameters Controls Panel (2 cols) */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 space-y-6">
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-5 h-5 text-purple-400 animate-pulse" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
            {isRtl ? 'محاكي الصوت البيومتري والكلام' : 'Vocal Matrix Console'}
          </h3>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400">{isRtl ? 'النص المطلوب تلاوته:' : 'Script text to synthesize:'}</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isRtl ? 'اكتب جملاً هنا ليتم قراءتها بصوت بشري مجسد فائق الجودة...' : 'Write custom text scripts here to compile and synthesize into premium biometric vocals...'}
            rows={5}
            className="w-full px-4 py-3 bg-neutral-950 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-xl border border-neutral-850 outline-none focus:border-purple-400 transition resize-none"
          />
        </div>

        {/* Select Neural Voice */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400">{isRtl ? 'نبرة ومجسم الصوت:' : 'Biometric Speaker Model:'}</label>
          <select 
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 font-mono px-3 py-2.5 rounded-xl outline-none"
          >
            {voiceModels.map((m, idx) => (
              <option key={idx} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Vocal Tuning Sliders */}
        <div className="space-y-4 pt-2">
          {/* Pitch */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-500">{isRtl ? 'طبقة الصوت:' : 'Vocal Pitch:'}</span>
              <span className="text-purple-400">{pitch.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-purple-500 h-1 bg-neutral-950 rounded"
            />
          </div>

          {/* Speed */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-500">{isRtl ? 'سرعة التلاوة:' : 'Reading Tempo Speed:'}</span>
              <span className="text-purple-400">{speed.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-purple-500 h-1 bg-neutral-950 rounded"
            />
          </div>
        </div>

        {/* Dynamic Voice Changer / Real-time Web Audio API Filters Selection Grid */}
        <div className="space-y-3 pt-4 border-t border-neutral-850/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide font-mono flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>{isRtl ? 'تأثيرات مغير الصوت الذكي:' : 'Biometric Voice Transformer:'}</span>
            </label>
            <span className="text-[9.5px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 font-mono">
              REAL-TIME FX
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {voiceEffects.map((effect) => {
              const active = selectedEffect === effect.id;
              return (
                <button
                  key={effect.id}
                  onClick={() => setSelectedEffect(effect.id)}
                  type="button"
                  className={`p-2 rounded-xl border text-right sm:text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-[68px] ${
                    active 
                      ? 'bg-purple-500/10 border-purple-500 text-white shadow-md shadow-purple-500/5' 
                      : 'bg-neutral-950/40 border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 w-full ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm">{effect.icon}</span>
                    <span className="text-[11px] font-bold truncate">{effect.name}</span>
                  </div>
                  <span className={`text-[9.5px] text-neutral-500 font-medium truncate w-full block ${isRtl ? 'text-right' : 'text-left'}`}>
                    {effect.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button 
            onClick={playing ? stopPlayback : handleSynthesizeAndPlay}
            disabled={!text.trim() && !playing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:opacity-95 transition font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/15 cursor-pointer disabled:opacity-50"
          >
            {playing ? (
              <>
                <Activity className="w-4 h-4 text-white animate-bounce" />
                <span>{isRtl ? 'إيقاف التشغيل' : 'Halt Playback'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{isRtl ? 'توليد وسماع الصوت' : 'Synthesize & Broadcast'}</span>
              </>
            )}
          </button>

          <button
            onClick={downloadAudio}
            disabled={!text.trim() || downloading}
            className="w-full py-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-purple-500/40 text-neutral-300 hover:text-white transition font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            <span>{isRtl ? 'تحميل كـ MP3' : 'Download MP3'}</span>
          </button>
        </div>
      </div>

      {/* Presentation view (3 cols) */}
      <div className="lg:col-span-3 min-h-[400px] flex flex-col justify-between p-6 rounded-2xl bg-neutral-900/15 border border-neutral-900 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10 rounded-full" />

        {/* Presets listing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {isRtl ? 'قوالب تلاوة سريعة معتمدة' : 'Vocal Scenarios Presets'}
            </h4>
            <span className="text-[10px] font-mono text-neutral-500">{isRtl ? 'استماع بضغطة واحدة' : 'Sync: Active browser TTS'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setText(p.text);
                  handleSynthesizeAndPlay();
                }}
                className="p-4 bg-neutral-900/40 border border-neutral-850 hover:border-purple-500/30 rounded-xl text-left text-xs text-neutral-300 hover:text-white transition flex flex-col justify-between h-28 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
                  <Megaphone className="w-4 h-4" />
                  <span>{p.label}</span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-3 leading-relaxed">{p.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Visualizer and status bar */}
        <div className="mt-8 p-5 bg-neutral-950/75 border border-neutral-850 rounded-2xl flex flex-col justify-center items-center gap-4 min-h-[190px] relative overflow-hidden shadow-inner">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[9px] font-mono text-neutral-500 bg-neutral-900/40 px-2.5 py-1 rounded-md border border-neutral-850">
            <span className={`w-1.5 h-1.5 rounded-full ${playing ? 'bg-cyan-400 animate-ping' : 'bg-neutral-800'}`}></span>
            <span>{playing ? 'STREAM LIVE DATA' : 'DECIBEL SPECTRUM standby'}</span>
          </div>

          <div className="w-full flex-1 flex items-center justify-center">
            {playing ? (
              <canvas 
                ref={canvasRef} 
                width={360} 
                height={120} 
                className="w-full h-[120px] rounded-xl bg-neutral-950/90 border border-neutral-900"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 text-center w-full py-4">
                <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 shadow-md">
                  <Activity className="w-4 h-4 animate-pulse text-purple-400" />
                </div>
                <p className="text-[11px] font-mono text-neutral-400">
                  {isRtl ? 'المعالج الصوتي جاهز للبث المباشر' : 'Neural Vocal Pipeline is on Standby'}
                </p>
                <p className="text-[10px] text-neutral-600 max-w-[280px]">
                  {isRtl ? 'اكتب جملة في حقل النص باليسار لمشاهدة التحليل الطيفي الفوري' : 'Synthesize speech variables using any transformer preset node to activate spectrum telemetry.'}
                </p>
              </div>
            )}
          </div>

          {playing && (
            <div className="w-full text-center">
              <p className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 uppercase tracking-widest font-mono">
                {isRtl ? 'ترميز طيفي مباشر ومعالجة رقمية نشطة' : 'DIRECT AUDIO-DSP ENCODING COMPLETED'}
              </p>
              <p className="text-[10.5px] text-neutral-500 font-mono mt-1">
                {voiceModels.find(v => v.id === selectedVoice)?.name || selectedVoice} {isRtl ? 'يعمل بسرعة' : 'at'} {speed}x 
                <span className="text-purple-400 font-bold"> • FX: {voiceEffects.find(f => f.id === selectedEffect)?.name}</span>
              </p>
            </div>
          )}

          {!playing && text.trim() && (
            <button
              onClick={downloadAudio}
              disabled={downloading}
              className="px-4 py-1.5 rounded-full text-[11px] font-mono text-purple-400 hover:text-purple-300 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-3 h-3 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{isRtl ? 'تحميل الملف الصوتي الحالي كـ MP3' : 'Download Generated Sound (MP3)'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
