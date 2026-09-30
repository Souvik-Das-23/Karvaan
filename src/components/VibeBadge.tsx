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
    bg: 'bg-stone-50',
    text: 'text-stone-700',
    border: 'border-stone-200',
    desc: 'Community Endorsement',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1 font-medium',
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
        'inline-flex items-center rounded-lg border transition-all duration-150 select-none shadow-subtle',
        sizeClasses[size],
        selected
          ? 'bg-terracotta-500 border-terracotta-600 text-white shadow-md scale-105'
          : `${badgeConfig.bg} ${badgeConfig.text} ${badgeConfig.border}`,
        interactive &&
          !selected &&
          'hover:border-stone-400 hover:bg-stone-100 cursor-pointer active:scale-95',
        !interactive && 'cursor-default'
      )}
    >
      <span className="text-xs sm:text-sm">{badgeConfig.icon}</span>
      <span>{badgeConfig.label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold',
            selected ? 'bg-white/20 text-white' : 'bg-black/5 text-gray-700'
          )}
        >
          +{count}
        </span>
      )}
    </button>
  );
};
