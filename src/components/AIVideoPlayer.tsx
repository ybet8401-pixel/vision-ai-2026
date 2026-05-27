import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Gauge, 
  RefreshCw,
  Sliders,
  Sparkles,
  Music
} from 'lucide-react';

const AUDIO_TRACKS = [
  { id: 'none', msgAr: 'بدون موسيقى', msgEn: 'No Music Track', url: '' },
  { id: 'space', msgAr: 'فضاء عميق', msgEn: 'Deep Space Drifter', url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/space_music.mp3' },
  { id: 'cyber', msgAr: 'نبض النيون', msgEn: 'Neon Lepidoptera', url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.mp3' },
  { id: 'retro', msgAr: 'سينثويف كلاسيكي', msgEn: 'Retro Synthwave', url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/ricerocks_theme.mp3' }
];

interface AIVideoPlayerProps {
  src: string;
  language: 'en' | 'ar';
  aspectRatioLabel?: string;
  fpsLabel?: number;
}

export default function AIVideoPlayer({
  src,
  language,
  aspectRatioLabel = '16:9',
  fpsLabel = 60
}: AIVideoPlayerProps) {
  const isRtl = language === 'ar';
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Custom video playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Background Audio overlay states
  const [selectedTrackId, setSelectedTrackId] = useState<string>('none');
  const [bgVolume, setBgVolume] = useState<number>(0.4); // 40% blend volume by default
  const [videoVolume, setVideoVolume] = useState<number>(0.8); // 80% default original volume to allow mixing
  const [showMusicMenu, setShowMusicMenu] = useState<boolean>(false);

  // Sync video volume and mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = videoVolume;
      videoRef.current.muted = isMuted;
    }
  }, [videoVolume, isMuted, src]);

  // Reset fallback on link changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Handle simulated time progression when video is in fallback Canvas mode
  useEffect(() => {
    if (!hasError || !isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.05 * playbackSpeed;
        const totalDuration = duration || 16;
        if (next >= totalDuration) {
          return 0; // Seamless loop simulation
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [hasError, isPlaying, duration, playbackSpeed]);

  // High-performance canvas visual generator for fallsafes
  useEffect(() => {
    if (!hasError || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const stars: Array<{ x: number; y: number; z: number; color: string }> = [];
    
    // Seed warp stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 1000,
        z: Math.random() * 1000,
        color: `hsl(${200 + Math.random() * 60}, 85%, 75%)`
      });
    }

    const render = () => {
      if (!ctx || !canvas) return;
      
      const w = canvas.width = canvas.parentElement?.clientWidth || 640;
      const h = canvas.height = canvas.parentElement?.clientHeight || 360;
      
      // Black slate canvas backdrop
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Draw vector cosmic warp lines
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 1;
      const numLines = 20;
      const centerX = w / 2;
      const centerY = h / 2;
      
      const warpSpeed = isPlaying ? 4 * playbackSpeed : 0.4;

      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2 + (currentTime * 0.02);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const targetX = centerX + Math.cos(angle) * w;
        const targetY = centerY + Math.sin(angle) * h;
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
      }

      // Draw holographic stars moving through spacetime
      stars.forEach(star => {
        if (isPlaying) {
          star.z -= warpSpeed;
        }
        if (star.z <= 0) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * 1000;
          star.y = (Math.random() - 0.5) * 1000;
        }

        const k = 400 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const size = Math.max(1, (1 - star.z / 1000) * 5);
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.shadowBlur = size * 2;
          ctx.shadowColor = star.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Digital energy waveform overlay
      ctx.beginPath();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      const numWaves = 40;
      for (let i = 0; i < numWaves; i++) {
        const x = (i / numWaves) * w;
        const sineInput = (i * 0.2) + (currentTime * 3);
        const amplitude = isPlaying ? 20 : 4;
        const y = centerY + Math.sin(sineInput) * amplitude + Math.cos(sineInput * 0.4) * 8;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Core telemetry diagnostics HUD
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#6366f1';
      ctx.fillText(`// CORE HARDWARE DECODER BYPASS ACTIVE`, 15, 25);
      ctx.fillStyle = '#22d3ee';
      ctx.fillText(`TIME: ${currentTime.toFixed(2)}s | SPEED: ${playbackSpeed}x | FPS: ${fpsLabel}`, 15, 40);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`SECURE CONTAINER COMPLETED FEEDS FLUSH`, 15, h - 15);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [hasError, isPlaying, currentTime, playbackSpeed, fpsLabel]);

  // Sync background track timing to matched relative position of main feed
  const syncAudioWithVideo = () => {
    if (!videoRef.current || !audioRef.current || selectedTrackId === 'none') return;
    const videoTime = videoRef.current.currentTime;
    const audioTime = audioRef.current.currentTime;
    const durationLimit = audioRef.current.duration || 100;
    const targetRelative = videoTime % durationLimit;
    
    // Prevent unprompted seek stutters by only bridging drift above 0.35s
    if (Math.abs(audioTime - targetRelative) > 0.35) {
      audioRef.current.currentTime = targetRelative;
    }
  };

  // Watch state alterations to control audio synchronization engine
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const track = AUDIO_TRACKS.find(t => t.id === selectedTrackId);

    if (!track || selectedTrackId === 'none') {
      audio.pause();
      return;
    }

    if (audio.src !== track.url) {
      audio.src = track.url;
      audio.load();
    }

    // Direct binding setup
    audio.volume = isMuted ? 0 : bgVolume;
    audio.playbackRate = playbackSpeed;

    if (isPlaying) {
      audio.play().catch(e => console.log("Background audio deferred:", e));
      syncAudioWithVideo();
    } else {
      audio.pause();
    }
  }, [selectedTrackId, bgVolume, isPlaying, playbackSpeed, isMuted]);

  // Handle auto-hide controls bar during normal playback hover experience
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const resetControlsTimer = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, currentTime]);

  const togglePlay = () => {
    if (hasError) {
      if (isPlaying) {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        setIsPlaying(true);
        if (audioRef.current && selectedTrackId !== 'none') {
          audioRef.current.play().catch(() => {});
        }
      }
      return;
    }

    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          if (audioRef.current && selectedTrackId !== 'none') {
            audioRef.current.play().catch(() => {});
            syncAudioWithVideo();
          }
        })
        .catch(err => {
          console.warn("Playback error, activating fallback emulator canvas:", err);
          setHasError(true);
          setIsPlaying(true);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    // Continuous sync checks
    syncAudioWithVideo();
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 4);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = Number(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    if (audioRef.current && selectedTrackId !== 'none') {
      const audioDuration = audioRef.current.duration || 100;
      audioRef.current.currentTime = seekTime % audioDuration;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = () => {
    if (!videoRef.current) return;
    let nextSpeed = 1;
    if (playbackSpeed === 1) nextSpeed = 1.5;
    else if (playbackSpeed === 1.5) nextSpeed = 2;
    else nextSpeed = 1;

    videoRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    const playerContainer = videoRef.current.parentElement;
    if (!playerContainer) return;

    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error("Failed to go fullscreen:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error("Failed to exit fullscreen:", err));
    }
  };

  // Re-sync fullscreen state in case of manual escapes
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const restartVideo = () => {
    setCurrentTime(0);
    if (audioRef.current && selectedTrackId !== 'none') {
      audioRef.current.currentTime = 0;
    }

    if (hasError) {
      setIsPlaying(true);
      if (audioRef.current && selectedTrackId !== 'none') {
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    
    videoRef.current.play()
      .then(() => {
        setIsPlaying(true);
        if (audioRef.current && selectedTrackId !== 'none') {
          audioRef.current.play().catch(() => {});
        }
      })
      .catch(() => {});
  };

  // Formatter function to show video timestamp standard layout e.g. 0:02
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      id="AIVideoPlayer"
      className="relative rounded-xl overflow-hidden bg-black border border-neutral-900 group shadow-2xl flex flex-col items-center justify-center h-full max-h-[460px] w-full"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      
      {/* Actual HTML Video Tag with Failsafe Canvas Emulation layer */}
      {hasError ? (
        <canvas
          ref={canvasRef}
          onClick={togglePlay}
          className="w-full h-full object-contain max-h-[420px] bg-neutral-950 transition-all duration-300 pointer-events-auto cursor-pointer"
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            console.warn("Playback source loaded failure, engaging hardware emulating synthesized Canvas canvas");
            setHasError(true);
          }}
          className="w-full h-full object-contain max-h-[420px] bg-neutral-950 transition-all duration-300 pointer-events-auto cursor-pointer"
          onClick={togglePlay}
          playsInline
          autoPlay
          loop
          muted={isMuted}
        />
      )}

      {/* Behind the scenes looping background track audio tag */}
      <audio
        ref={audioRef}
        loop
        className="hidden pointer-events-none"
        onCanPlay={() => {
          if (audioRef.current && isPlaying && selectedTrackId !== 'none') {
            audioRef.current.play().catch(() => {});
          }
        }}
      />

      {/* Futuristic Grid Overlay HUD Effect */}
      <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none" />

      {/* Play/Pause Giant Ambient Overlay Button on Mid Screen */}
      {!isPlaying && (
        <button 
          onClick={togglePlay}
          className="absolute w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-cyan-500 hover:scale-110 text-white flex items-center justify-center transition duration-300 shadow-xl border border-indigo-400/30 cursor-pointer animate-pulse z-15"
        >
          <Play className="w-8 h-8 fill-white ml-1" />
        </button>
      )}

      {/* High-Tech Background Music Selector Panel overlaying the feed if opened (using framer-motion) */}
      <AnimatePresence>
        {showMusicMenu && (
          <motion.div 
            id="audio-track-selector"
            initial={{ opacity: 0, scale: 0.96, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: 8, filter: "blur(4px)" }}
            transition={{ 
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1] // High-tech custom responsive cubic bezier curve
            }}
            className={`absolute bottom-32 inset-x-4 p-4 rounded-xl bg-neutral-950/95 border backdrop-blur-md z-20 space-y-3 transition-all duration-300 ${
              selectedTrackId !== 'none'
                ? 'border-cyan-500/60 shadow-[0_0_25px_rgba(34,211,238,0.3)]'
                : 'border-neutral-800/80 shadow-[0_0_30px_rgba(0,0,0,0.8)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                {isRtl ? 'دمج الموسيقى التصويرية المرافقة' : 'Cine-Foley Music Overlay'}
              </span>
              <button 
                onClick={() => setShowMusicMenu(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold leading-none px-1.5 py-0.5 rounded hover:bg-neutral-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Preset Selector Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {AUDIO_TRACKS.map(track => {
                const active = selectedTrackId === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      setSelectedTrackId(track.id);
                    }}
                    className={`px-2.5 py-2.5 rounded-lg text-left text-[10px] font-medium transition duration-300 cursor-pointer flex flex-col justify-between ${
                      active 
                        ? 'bg-gradient-to-r from-indigo-950 to-cyan-950 border border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]' 
                        : 'bg-neutral-900 hover:bg-neutral-850 border border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span className="font-semibold block truncate leading-none mb-1">
                      {isRtl ? track.msgAr : track.msgEn}
                    </span>
                    <span className="text-[8px] font-mono text-neutral-500 truncate block">
                      {track.id === 'none' ? (isRtl ? 'الصوت الأصلي' : 'original feeds') : (isRtl ? 'حلقة تدرج نيون' : 'studio audio loop')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dedicated Dual-Volume Mixer Section to mix background music levels relative to the video audio */}
            <div className="pt-3 border-t border-neutral-900 bg-neutral-950/40 p-2.5 rounded-lg space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-neutral-300 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isRtl ? 'ميكسر دمج الأصوات المتقدم' : 'Cine-Foley Audio Mixer'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Video Original Sound Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-cyan-400" />
                      {isRtl ? 'صوت الفيديو الأصلي' : 'Original Video Audio'}
                    </span>
                    <span className="text-cyan-400 font-bold">{Math.round(videoVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={videoVolume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVideoVolume(val);
                      if (val > 0 && isMuted) {
                        setIsMuted(false);
                      }
                    }}
                    className="w-full accent-cyan-400 h-1 bg-neutral-900 rounded-lg cursor-pointer"
                  />
                </div>

                {/* 2. Background Overlay Music Slider */}
                <div className={`space-y-1.5 transition-all duration-300 ${selectedTrackId === 'none' ? 'opacity-30 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Music className="w-3 h-3 text-indigo-400" />
                      {isRtl ? 'الموسيقى التصويرية' : 'Background Music'}
                    </span>
                    <span className="text-indigo-400 font-bold">
                      {selectedTrackId === 'none' ? '0%' : `${Math.round(bgVolume * 100)}%`}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={bgVolume}
                    disabled={selectedTrackId === 'none'}
                    onChange={(e) => setBgVolume(Number(e.target.value))}
                    className="w-full accent-indigo-400 h-1 bg-neutral-900 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyber Frame details top overlay */}
      <div className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between pointer-events-none transition-all duration-300 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-neutral-300 tracking-wider">
            {isRtl ? 'بث سينمائي مباشر | VEO LITE' : 'CINEMATIC FEED | VEO LITE'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-md bg-neutral-900/90 border border-neutral-800 text-[9px] font-mono font-bold text-cyan-400">
            {aspectRatioLabel}
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-neutral-900/90 border border-neutral-800 text-[9px] font-mono font-bold text-indigo-400">
            {fpsLabel} FPS
          </span>
        </div>
      </div>

      {/* Video Control Bar bottom overlay */}
      <div className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent space-y-3 transition-all duration-300 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        
        {/* Timeline Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-neutral-400 min-w-[32px] text-right">
            {formatTime(currentTime)}
          </span>
          
          <input 
            type="range"
            min="0"
            max={duration || 100}
            step="0.01"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-cyan-400 h-1 bg-neutral-800 rounded-lg cursor-pointer transition-all duration-200 outline-none hover:h-1.5 focus:accent-indigo-400"
          />

          <span className="text-[10px] font-mono text-neutral-400 min-w-[32px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            
            {/* Play/Pause Button */}
            <button 
              onClick={togglePlay}
              className="p-2 rounded-lg bg-neutral-900/85 hover:bg-neutral-850 hover:text-cyan-400 text-white transition cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
            </button>

            {/* Restart Button */}
            <button 
              onClick={restartVideo}
              className="p-2 rounded-lg bg-neutral-900/85 hover:bg-neutral-850 hover:text-indigo-400 text-white transition cursor-pointer"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Mute Toggler Button */}
            <button 
              onClick={toggleMute}
              className="p-2 rounded-lg bg-neutral-900/85 hover:bg-neutral-850 hover:text-indigo-400 text-white transition cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Audio Track Layer Selector */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMusicMenu(!showMusicMenu);
              }}
              className={`p-2 rounded-lg border transition cursor-pointer ${
                selectedTrackId !== 'none' 
                  ? 'bg-gradient-to-r from-indigo-900 to-cyan-900 border-cyan-500/40 text-cyan-300' 
                  : 'bg-neutral-900/85 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-cyan-400'
              }`}
              title={isRtl ? 'اختيار الموسيقى المصاحبة' : 'Overlay Audio Track'}
            >
              <Music className={`w-4 h-4 ${selectedTrackId !== 'none' ? 'animate-[bounce_2s_infinite]' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            
            {/* Playback rate speed toggler */}
            <button 
              onClick={changeSpeed}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900/85 hover:bg-neutral-850 text-[10px] font-mono font-bold text-neutral-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              title="Speed Modifier"
            >
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              <span>{playbackSpeed}x</span>
            </button>

            {/* Simulated fullscreen */}
            <button 
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-neutral-900/85 hover:bg-neutral-850 hover:text-cyan-400 text-white transition cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
