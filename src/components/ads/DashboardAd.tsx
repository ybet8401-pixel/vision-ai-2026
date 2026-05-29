import React from 'react';
import AdBanner from '../AdBanner';

interface DashboardAdProps {
  isPremium?: boolean;
}

export default function DashboardAd({ isPremium = false }: DashboardAdProps) {
  if (isPremium) return null;
  return (
    <div className="w-full mt-4">
      <AdBanner adSlot="auto" adFormat="horizontal" className="min-h-[90px] rounded-2xl" isPremium={isPremium} />
    </div>
  );
}
