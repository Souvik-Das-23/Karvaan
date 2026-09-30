'use client';

import React from 'react';
import { SwipeFeed } from '@/components/SwipeFeed';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { useApp } from '@/context/AppContext';
import { Flame, ShieldCheck, Users, Sparkles, Heart, Ban, ArrowRight, Award } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { trips, allUsers } = useApp();

  const totalMembersJoined = trips.reduce(
    (acc, t) => acc + (t.members ? t.members.length : 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6 w-full flex-1 flex flex-col justify-start">
      {/* 3-Column Desktop Grid / 1-Column Mobile Layout */}
      <div className="flex justify-between items-start gap-4 lg:gap-6 w-full">
        {/* Column 1 (Left Sidebar): Navigation & User Profile Summary */}
        <LeftSidebar />

        {/* Column 2 (Center): Swipe Deck Feed */}
        <main className="flex-1 flex flex-col items-center justify-start w-full max-w-md mx-auto">
          {/* Header Tagline Banner */}
          <div className="mb-3 text-center w-full">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-terracotta-200 bg-terracotta-50 px-3 py-1 text-xs font-bold text-terracotta-700 mb-1.5 shadow-subtle">
              <Flame size={13} className="text-terracotta-600 animate-pulse" />
              <span>Group Travel Matchmaking</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-gray-900 font-display">
              Find Your <span className="text-terracotta-600">Travel Squad</span>
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              Match by budget tiers, travel styles, and verified{' '}
              <span className="text-forest-700 font-bold">Vibe Scores</span>.
            </p>
          </div>

          {/* Framer Motion Swipe Deck */}
          <SwipeFeed />

          {/* Mobile Gestures Legend (visible on mobile/tablet) */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full xl:hidden">
            <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-white p-3 shadow-subtle">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <Ban size={16} />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-gray-900">Left: Pass</h4>
                <p className="text-[10px] text-gray-500">Skip trip</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-white p-3 shadow-subtle">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <Heart size={16} className="fill-current" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-gray-900">Right: Join</h4>
                <p className="text-[10px] text-gray-500">Request to join</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-white p-3 shadow-subtle">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700 border border-stone-200">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-gray-900">Vibe Vetting</h4>
                <p className="text-[10px] text-gray-500">Peer verified</p>
              </div>
            </div>
          </div>
        </main>

        {/* Column 3 (Right Sidebar): Confirmed Squads & Live Chat Preview */}
        <RightSidebar />
      </div>
    </div>
  );
}
