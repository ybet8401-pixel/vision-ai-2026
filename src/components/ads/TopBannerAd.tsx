import React from 'react';
import AdBanner from '../AdBanner';

interface TopBannerAdProps {
  isPremium?: boolean;
}

export default function TopBannerAd({ isPremium = false }: TopBannerAdProps) {
  if (isPremium) return null;
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-6">
      <AdBanner adSlot="auto" adFormat="horizontal" className="shadow-lg shadow-black/20" isPremium={isPremium} />
    </div>
  );
}
