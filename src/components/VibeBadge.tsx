'use client';

import React from 'react';
import { BADGE_CONFIG, cn } from '@/lib/utils';

interface VibeBadgeProps {
  name: string;
  count?: number;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const VibeBadge: React.FC<VibeBadgeProps> = ({
  name,
  count,
  interactive = false,
  selected = false,
  onClick,
  size = 'md',
}) => {
  const badgeConfig = BADGE_CONFIG[name] || {
    label: name,
    icon: '✨',
    desc: 'Community Endorsement',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 font-medium',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-semibold',
    lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
  };

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={onClick}
      title={badgeConfig.desc}
      className={cn(
        'inline-flex items-center rounded-xl border transition-all duration-200 select-none backdrop-blur-md',
        sizeClasses[size],
        selected
          ? 'bg-terracotta-600/40 border-terracotta-500 text-white shadow-glow scale-105'
          : 'bg-cinema-850/80 border-white/10 text-cinema-200 hover:border-white/25 hover:bg-cinema-800',
        interactive &&
          !selected &&
          'cursor-pointer active:scale-95',
        !interactive && 'cursor-default'
      )}
    >
      <span className="text-xs sm:text-sm">{badgeConfig.icon}</span>
      <span className="tracking-tight">{badgeConfig.label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold',
            selected ? 'bg-white/30 text-white' : 'bg-black/40 text-cinema-300'
          )}
        >
          +{count}
        </span>
      )}
    </button>
  );
};
