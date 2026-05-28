import React, { useEffect, useRef, useState } from 'react';

// Extend the Window object to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  adSlot?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  isPremium?: boolean;
}

export default function AdBanner({ 
  adSlot = "auto", 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = '',
  isPremium = false
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Lazy load intersection observer
  useEffect(() => {
    if (isPremium || hasFailed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger ad push once when visible
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isPremium, hasFailed]);

  // Push AdSense when visible
  useEffect(() => {
    if (!isVisible || isPremium || hasFailed) return;

    try {
      const insElement = containerRef.current?.querySelector('ins');
      if (insElement && !insElement.dataset.adsbygoogleStatus) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense initialization error:', err);
      setHasFailed(true);
    }
  }, [isVisible, isPremium, hasFailed]);

  if (isPremium || hasFailed) return null;

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden w-full flex justify-center items-center rounded-xl bg-neutral-900/10 border border-neutral-800/30 min-h-[90px] ${className}`}
    >
      <ins
        className="adsbygoogle animate-pulse"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client="ca-pub-3282448341991495"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        onLoad={() => {
          const el = containerRef.current?.querySelector('ins');
          if (el) el.classList.remove('animate-pulse');
        }}
      />
    </div>
  );
}
