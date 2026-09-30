'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ChevronDown, Check, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { VibeScorePill } from './VibeScorePill';

export const UserSwitcher: React.FC = () => {
  const { currentUser, setCurrentUser, allUsers } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/12 bg-cinema-850/80 px-3 py-1.5 text-xs sm:text-sm font-semibold text-cinema-200 shadow-glass backdrop-blur-xl transition-all hover:border-white/25 hover:bg-cinema-800"
      >
        <div className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-terracotta-500/50">
          <Image
            src={currentUser.avatar_url}
            alt={currentUser.full_name}
            fill
            className="object-cover"
            sizes="24px"
          />
        </div>
        <span className="max-w-[90px] truncate font-bold sm:max-w-none text-white">
          {currentUser.full_name.split(' ')[0]}
        </span>
        <VibeScorePill score={currentUser.vibe_score} size="sm" showIcon={false} />
        <ChevronDown size={14} className={`text-cinema-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-3xl border border-white/12 bg-cinema-900/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cinema-400">
                Switch Traveler Account
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <ShieldCheck size={12} /> Demo Mode
              </span>
            </div>
            <p className="mt-1 text-[11px] text-cinema-400 leading-snug">
              Test host approval workflows and join requests as different travelers.
            </p>
          </div>

          <div className="mt-1 max-h-72 space-y-1 overflow-y-auto py-1">
            {allUsers.map((user) => {
              const isSelected = user.id === currentUser.id;
              return (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl px-2.5 py-2 text-left transition-all ${
                    isSelected
                      ? 'bg-terracotta-600/30 text-white font-bold border border-terracotta-500/40 shadow-inner'
                      : 'text-cinema-300 hover:bg-cinema-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5 text-white">
                        {user.full_name}
                        <span className="text-[10px] text-cinema-400 font-normal">
                          • {user.travel_style}
                        </span>
                      </div>
                      <div className="text-[10px] text-cinema-400">
                        {user.budget_tier} • {user.age} yrs
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <VibeScorePill score={user.vibe_score} size="sm" />
                    {isSelected && <Check size={14} className="text-terracotta-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
