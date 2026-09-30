'use client';

import React from 'react';
import { SwipeFeed } from '@/components/SwipeFeed';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { useApp } from '@/context/AppContext';
import { Flame, ShieldCheck, Users, Sparkles, Heart, Ban, ArrowRight, Award, Mountain, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { trips, allUsers } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-5 w-full flex-1 flex flex-col justify-start">
      {/* 3-Column Desktop Grid / 1-Column Mobile Layout */}
      <div className="flex justify-between items-start gap-4 lg:gap-6 w-full">
        {/* Column 1 (Left Sidebar): Navigation & User Profile Summary */}
        <LeftSidebar />

        {/* Column 2 (Center): Horizon Swipe Deck Feed */}
        <main className="flex-1 flex flex-col items-center justify-start w-full max-w-md mx-auto">
          {/* Header Title & Date Subtitle (matching reference image e.g. "Russia / 22.03–25.03") */}
          <div className="mb-3 text-center w-full">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-cinema-850/80 px-3.5 py-1 text-xs font-bold text-cinema-300 mb-1.5 shadow-glass backdrop-blur-xl">
              <Mountain size={13} className="text-terracotta-400" />
              <span>Expedition Season • Autumn 2026</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-display drop-shadow-md">
              Discover <span className="text-terracotta-400">Karvaan</span>
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-cinema-400 max-w-sm mx-auto leading-relaxed font-medium">
              Match by budget tiers, travel styles, and verified{' '}
              <span className="text-emerald-400 font-bold">Vibe Scores</span>.
            </p>
          </div>

          {/* Framer Motion Swipe Deck with Metric Capsule Pods */}
          <SwipeFeed />

          {/* Mobile Gestures Legend (visible on mobile/tablet) */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full xl:hidden">
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-cinema-900/80 p-3 shadow-glass">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-rose-950/60 text-rose-400 border border-rose-500/30">
                <Ban size={16} />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-white">Left: Pass</h4>
                <p className="text-[10px] text-cinema-400">Skip trip</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-cinema-900/80 p-3 shadow-glass">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                <Heart size={16} className="fill-current" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-white">Right: Join</h4>
                <p className="text-[10px] text-cinema-400">Request to join</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-cinema-900/80 p-3 shadow-glass">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-cinema-800 text-cinema-300 border border-white/10">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-white">Vibe Vetting</h4>
                <p className="text-[10px] text-cinema-400">Peer verified</p>
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
