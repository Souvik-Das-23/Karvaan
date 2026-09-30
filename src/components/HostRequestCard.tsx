'use client';

import React from 'react';
import Image from 'next/image';
import { TripSwipe } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { VibeScorePill } from './VibeScorePill';
import { VibeBadge } from './VibeBadge';
import { Check, X, ShieldAlert, MapPin } from 'lucide-react';

interface HostRequestCardProps {
  swipe: TripSwipe;
  onAccept: (swipeId: string) => void;
  onReject: (swipeId: string) => void;
}

export const HostRequestCard: React.FC<HostRequestCardProps> = ({
  swipe,
  onAccept,
  onReject,
}) => {
  const applicant = swipe.user;
  const trip = swipe.trip;

  if (!applicant || !trip) return null;

  const meetsVibe = applicant.vibe_score >= trip.min_vibe_score;
  const isPending = swipe.status === 'pending';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 shadow-card transition-all hover:border-stone-300">
      {/* Left: Applicant info */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-2xl ring-2 ring-terracotta-400/40 shadow-subtle">
          <Image
            src={applicant.avatar_url}
            alt={applicant.full_name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
              {applicant.full_name}
            </h3>
            <VibeScorePill
              score={applicant.vibe_score}
              reviewsCount={applicant.reviews_count}
              size="sm"
            />
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 border border-stone-200">
              {applicant.travel_style}
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {applicant.bio}
          </p>

          {/* Badges preview */}
          {applicant.badges && Object.keys(applicant.badges).length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {Object.entries(applicant.badges)
                .slice(0, 3)
                .map(([badgeName, count]) => (
                  <VibeBadge
                    key={badgeName}
                    name={badgeName}
                    count={count}
                    size="sm"
                  />
                ))}
            </div>
          )}

          {/* Requested Trip info */}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-stone-100 font-medium">
            <div className="flex items-center gap-1 text-terracotta-700 font-bold truncate">
              <MapPin size={13} />
              <span>{trip.title}</span>
            </div>
            <span>•</span>
            <span>Est. {formatINR(trip.budget_per_person)} / head</span>
          </div>
        </div>
      </div>

      {/* Right: Actions / Status */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 flex-shrink-0">
        {isPending ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onReject(swipe.id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
            >
              <X size={15} />
              <span>Reject</span>
            </button>

            <button
              onClick={() => onAccept(swipe.id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-forest-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-emerald hover:scale-105 transition-all active:scale-95"
            >
              <Check size={15} />
              <span>Accept into Squad</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {swipe.status === 'accepted' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3.5 py-1 text-xs font-bold text-forest-700 border border-forest-200">
                <Check size={14} /> Confirmed Squad Member
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3.5 py-1 text-xs font-semibold text-gray-500 border border-stone-200">
                <X size={14} /> Request Declined
              </span>
            )}
          </div>
        )}

        {/* Vibe requirement note */}
        {!meetsVibe && isPending && (
          <div className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
            <ShieldAlert size={12} />
            <span>Below trip minimum ({trip.min_vibe_score.toFixed(1)})</span>
          </div>
        )}
      </div>
    </div>
  );
};
