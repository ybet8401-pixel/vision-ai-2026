import React from 'react';
import AdBanner from '../AdBanner';

interface RewardedAdProps {
  isPremium?: boolean;
}

export default function RewardedAd({ isPremium = false }: RewardedAdProps) {
  if (isPremium) return null;
  // Note: Rewarded Ads via AdSense typically require specific rewarded ad tags/slots,
  // we'll assume 'auto' for now or a specific rewarded ad slot.
  return (
    <div className="w-full mt-4 p-4 border border-emerald-500/30 bg-emerald-950/20 rounded-2xl">
      <div className="text-center mb-4">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Earn Additional Credits</h3>
        <p className="text-xs text-neutral-400">View this placement to generate more free content.</p>
      </div>
      <AdBanner adSlot="auto" adFormat="auto" className="min-h-[250px]" isPremium={isPremium} />
    </div>
  );
}
