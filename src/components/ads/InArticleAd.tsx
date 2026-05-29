import React from 'react';
import AdBanner from '../AdBanner';

interface InArticleAdProps {
  isPremium?: boolean;
}

export default function InArticleAd({ isPremium = false }: InArticleAdProps) {
  if (isPremium) return null;
  return (
    <div className="w-full my-8">
      <AdBanner adSlot="auto" adFormat="fluid" className="min-h-[200px]" isPremium={isPremium} />
    </div>
  );
}
