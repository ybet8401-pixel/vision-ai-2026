import React from 'react';
import AdBanner from '../AdBanner';

interface MultiplexAdProps {
  isPremium?: boolean;
}

export default function MultiplexAd({ isPremium = false }: MultiplexAdProps) {
  if (isPremium) return null;
  return (
    <div className="w-full mt-12 mb-8">
      <AdBanner adSlot="auto" adFormat="autorelaxed" className="min-h-[300px]" isPremium={isPremium} />
    </div>
  );
}
