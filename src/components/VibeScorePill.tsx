'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VibeScorePillProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  reviewsCount?: number;
  showIcon?: boolean;
  className?: string;
}

export const VibeScorePill: React.FC<VibeScorePillProps> = ({
  score,
  size = 'md',
  reviewsCount,
  showIcon = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-bold gap-1',
    md: 'px-2.5 py-1 text-xs font-bold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-extrabold gap-2',
  };

  const iconSizes = {
    sm: 11,
    md: 13,
    lg: 15,
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full bg-cinema-850/90 text-amber-300 border border-white/12 shadow-capsule-glow backdrop-blur-xl transition-all duration-200',
        sizeClasses[size],
        className
      )}
      title={`Vibe Score: ${score.toFixed(1)} / 5.0${
        reviewsCount !== undefined ? ` (${reviewsCount} peer reviews)` : ''
      }`}
    >
      {showIcon && (
        <Star
          size={iconSizes[size]}
          className="fill-amber-400 text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
        />
      )}
      <span className="text-white font-extrabold">{score.toFixed(1)}</span>
      <span className="text-[0.7em] text-cinema-400 font-medium">/ 5.0</span>
      {reviewsCount !== undefined && (
        <span className="text-[0.75em] text-cinema-400 font-normal ml-0.5">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
