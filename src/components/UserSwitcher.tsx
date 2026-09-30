'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Users, ChevronDown, Check, ShieldCheck } from 'lucide-react';
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
        className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm transition-all hover:border-stone-300 hover:bg-stone-50"
      >
        <div className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-terracotta-400">
          <Image
            src={currentUser.avatar_url}
            alt={currentUser.full_name}
            fill
            className="object-cover"
            sizes="24px"
          />
        </div>
        <span className="max-w-[90px] truncate font-bold sm:max-w-none text-gray-900">
          {currentUser.full_name.split(' ')[0]}
        </span>
        <VibeScorePill score={currentUser.vibe_score} size="sm" showIcon={false} />
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-2xl border border-stone-200 bg-white p-2 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Switch Traveler Account
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-forest-600">
                <ShieldCheck size={12} /> Demo Mode
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-500 leading-snug">
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
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all ${
                    isSelected
                      ? 'bg-terracotta-50 text-terracotta-900 font-bold border border-terracotta-200'
                      : 'text-gray-700 hover:bg-stone-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-stone-200">
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5 text-gray-900">
                        {user.full_name}
                        <span className="text-[10px] text-gray-400 font-normal">
                          • {user.travel_style}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {user.budget_tier} • {user.age} yrs
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <VibeScorePill score={user.vibe_score} size="sm" />
                    {isSelected && <Check size={14} className="text-terracotta-600" />}
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
