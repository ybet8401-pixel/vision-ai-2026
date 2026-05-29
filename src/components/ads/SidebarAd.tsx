import React from 'react';
import AdBanner from '../AdBanner';

interface SidebarAdProps {
  isPremium?: boolean;
}

export default function SidebarAd({ isPremium = false }: SidebarAdProps) {
  if (isPremium) return null;
  return (
    <div className="w-full mt-6 sticky top-24 hidden lg:block">
      <AdBanner adSlot="auto" adFormat="vertical" className="min-h-[400px] shadow-lg shadow-black/20" isPremium={isPremium} />
    </div>
  );
}
