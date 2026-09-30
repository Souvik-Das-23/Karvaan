'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Star,
  Award,
  Calendar,
  Compass,
  DollarSign,
  HeartHandshake,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { VibeScorePill } from '@/components/VibeScorePill';
import { VibeBadge } from '@/components/VibeBadge';

export default function ProfilePage() {
  const { currentUser, reviews, trips, resetDemoData, allUsers } = useApp();

  const userReviewsReceived = reviews.filter((r) => r.reviewee_id === currentUser.id);
  const userTrips = trips.filter(
    (t) =>
      t.host_id === currentUser.id ||
      (t.members && t.members.some((m) => m.user_id === currentUser.id))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/12 bg-cinema-900/85 p-6 sm:p-8 shadow-card-cinematic backdrop-blur-2xl">
        {/* Subtle warm ambient glow */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-terracotta-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 flex-shrink-0 overflow-hidden rounded-3xl ring-4 ring-terracotta-500/40 shadow-2xl">
            <Image
              src={currentUser.avatar_url}
              alt={currentUser.full_name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
                  {currentUser.full_name}
                </h1>
                <p className="text-xs sm:text-sm text-cinema-400 mt-0.5 font-medium">
                  {currentUser.age} years old • {currentUser.travel_style} • {currentUser.budget_tier} Tier
                </p>
              </div>

              <div>
                <VibeScorePill
                  score={currentUser.vibe_score}
                  reviewsCount={currentUser.reviews_count}
                  size="lg"
                />
              </div>
            </div>

            <p className="text-sm text-cinema-200 leading-relaxed max-w-2xl">
              {currentUser.bio}
            </p>

            {/* Travel Attributes Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="rounded-xl bg-cinema-800 px-3 py-1 text-xs font-semibold text-cinema-200 border border-white/10">
                🎒 Style: {currentUser.travel_style}
              </span>
              <span className="rounded-xl bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                💰 Budget: {currentUser.budget_tier}
              </span>
              <span className="rounded-xl bg-terracotta-950/60 px-3 py-1 text-xs font-semibold text-terracotta-400 border border-terracotta-500/30">
                🧭 {userTrips.length} Squad Expeditions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vibe Score Breakdown & Badge Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Badges Endorsement Matrix */}
        <div className="lg:col-span-2 rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-8 shadow-glass backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="text-terracotta-400" size={20} /> Community Badges & Endorsements
            </h2>
            <span className="text-xs text-cinema-400">
              Verified by squad mates
            </span>
          </div>

          <p className="text-xs text-cinema-300 leading-relaxed">
            Travelers who completed group trips with {currentUser.full_name.split(' ')[0]} endorsed them with these behavioral badges:
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {currentUser.badges && Object.entries(currentUser.badges).length > 0 ? (
              Object.entries(currentUser.badges).map(([name, count]) => (
                <VibeBadge key={name} name={name} count={count} size="lg" />
              ))
            ) : (
              <p className="text-xs text-cinema-500 italic">No badges earned yet.</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Trust & Reputation Index */}
        <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-8 shadow-glass backdrop-blur-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={20} /> Trust & Vibe Index
          </h2>

          <div className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cinema-400">Reliability Rate</span>
              <span className="font-extrabold text-emerald-400">98% (Zero Flakes)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-cinema-800 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[98%]" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-cinema-400">Punctuality Score</span>
              <span className="font-extrabold text-terracotta-400">4.9 / 5.0</span>
            </div>
            <div className="h-2 w-full rounded-full bg-cinema-800 overflow-hidden">
              <div className="h-full bg-terracotta-500 rounded-full w-[98%]" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-cinema-400">Budget Kitty Compliance</span>
              <span className="font-extrabold text-emerald-400">100% Instant Split</span>
            </div>
            <div className="h-2 w-full rounded-full bg-cinema-800 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[100%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Peer Reviews Received */}
      <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-8 shadow-glass backdrop-blur-2xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <HeartHandshake className="text-terracotta-400" size={20} /> Peer Reviews from Squad Mates ({userReviewsReceived.length})
        </h2>

        {userReviewsReceived.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {userReviewsReceived.map((review) => {
              const reviewer =
                review.reviewer || allUsers.find((u) => u.id === review.reviewer_id);

              return (
                <div
                  key={review.id}
                  className="rounded-2xl border border-white/5 bg-cinema-950/60 p-4 space-y-3 shadow-subtle"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/15">
                        {reviewer && (
                          <Image
                            src={reviewer.avatar_url}
                            alt={reviewer.full_name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          {reviewer?.full_name || 'Traveler'}
                        </h4>
                        <span className="text-[10px] text-cinema-400">
                          {reviewer?.travel_style}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                      <Star size={13} className="fill-current" />
                      <span>{review.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-cinema-200 italic leading-relaxed">
                    "{review.comment}"
                  </p>

                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {review.tags.map((t) => (
                        <VibeBadge key={t} name={t} size="sm" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-cinema-400 italic">
            No peer reviews recorded for this user yet.
          </p>
        )}
      </div>

      {/* Demo State Reset Control */}
      <div className="flex justify-end pt-2">
        <button
          onClick={resetDemoData}
          className="flex items-center gap-1.5 text-xs text-cinema-500 hover:text-cinema-300 transition-colors"
        >
          <RotateCcw size={13} />
          <span>Reset Sample Demo Data</span>
        </button>
      </div>
    </div>
  );
}
