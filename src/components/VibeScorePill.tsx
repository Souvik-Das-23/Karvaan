'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { getVibeScoreColor, cn } from '@/lib/utils';

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
  const colors = getVibeScoreColor(score);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-bold gap-1',
    md: 'px-2.5 py-1 text-xs font-extrabold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-black gap-2',
  };

  const iconSizes = {
    sm: 11,
    md: 13,
    lg: 16,
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-200 shadow-subtle',
        colors.bg,
        colors.text,
        colors.border,
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
          className="fill-current text-current filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
        />
      )}
      <span>{score.toFixed(1)}</span>
      <span className="text-[0.7em] opacity-70 font-semibold">/ 5.0</span>
      {reviewsCount !== undefined && (
        <span className="text-[0.75em] opacity-60 font-semibold ml-0.5">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
