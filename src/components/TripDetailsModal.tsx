'use client';

import React from 'react';
import Image from 'next/image';
import {
  X,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Sparkles,
  Heart,
  Ban,
  CheckCircle2,
  DollarSign,
  Info,
} from 'lucide-react';
import { Trip } from '@/lib/types';
import { formatINR, formatDateRange } from '@/lib/utils';
import { VibeScorePill } from './VibeScorePill';
import { VibeBadge } from './VibeBadge';
import { useApp } from '@/context/AppContext';

interface TripDetailsModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onSwipeRight?: (tripId: string) => void;
  onSwipeLeft?: (tripId: string) => void;
  hasSwiped?: boolean;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  trip,
  isOpen,
  onClose,
  onSwipeRight,
  onSwipeLeft,
  hasSwiped = false,
}) => {
  const { currentUser } = useApp();

  if (!isOpen || !trip) return null;

  const confirmedMembers = trip.members || [];
  const spotsFilled = confirmedMembers.length;
  const spotsLeft = Math.max(0, trip.max_members - spotsFilled);
  const isHost = trip.host_id === currentUser.id;
  const isAlreadyMember = confirmedMembers.some((m) => m.user_id === currentUser.id);
  const hostProfile = trip.host || confirmedMembers.find((m) => m.role === 'host')?.profile;

  const meetsVibeRequirement = currentUser.vibe_score >= trip.min_vibe_score;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl sm:rounded-4xl border border-stone-200 bg-white shadow-2xl my-auto text-gray-900 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 backdrop-blur-md transition-all hover:bg-white hover:text-gray-900 hover:scale-105 border border-stone-200 shadow-sm"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Hero Image Section */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-100">
            <Image
              src={trip.cover_image}
              alt={trip.title}
              fill
              className="object-cover brightness-[0.92]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

            {/* Travel Style & Status Overlays */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-gray-900 backdrop-blur-md border border-white/40 shadow-subtle">
                {trip.travel_style}
              </span>
              <span className="rounded-full bg-terracotta-700 px-3 py-1 text-xs font-bold tracking-wider text-white shadow-glow">
                Min {trip.min_vibe_score.toFixed(1)} Vibe Required
              </span>
            </div>

            {/* Title & Location Header */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-terracotta-200 mb-1 drop-shadow">
                <MapPin size={15} />
                <span>{trip.destination}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-md">
                {trip.title}
              </h2>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 bg-stone-50 border-y border-stone-200">
            {/* Budget Per Person */}
            <div className="flex flex-col p-3.5 rounded-2xl bg-white border border-stone-200 shadow-subtle">
              <span className="text-[11px] font-bold uppercase text-gray-400">
                Estimated / Head
              </span>
              <span className="text-lg sm:text-xl font-black text-forest-700 mt-0.5 font-display">
                {formatINR(trip.budget_per_person)}
              </span>
              <span className="text-[10px] text-gray-500">Shared stays & travel</span>
            </div>

            {/* Total Budget */}
            <div className="flex flex-col p-3.5 rounded-2xl bg-white border border-stone-200 shadow-subtle">
              <span className="text-[11px] font-bold uppercase text-gray-400">
                Group Kitty
              </span>
              <span className="text-lg sm:text-xl font-black text-gray-900 mt-0.5 font-display">
                {formatINR(trip.total_budget || trip.budget_per_person * trip.max_members)}
              </span>
              <span className="text-[10px] text-gray-500">Estimated group pool</span>
            </div>

            {/* Dates */}
            <div className="flex flex-col p-3.5 rounded-2xl bg-white border border-stone-200 shadow-subtle">
              <span className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
                <Calendar size={12} /> Dates
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 mt-1 line-clamp-1">
                {formatDateRange(trip.start_date, trip.end_date)}
              </span>
              <span className="text-[10px] text-gray-500">Upcoming trip</span>
            </div>

            {/* Squad Spots */}
            <div className="flex flex-col p-3.5 rounded-2xl bg-white border border-stone-200 shadow-subtle">
              <span className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
                <Users size={12} /> Squad Status
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-base sm:text-lg font-black text-terracotta-700">
                  {spotsFilled} / {trip.max_members}
                </span>
                <span className="text-xs text-forest-700 font-extrabold">
                  {spotsLeft > 0 ? `${spotsLeft} left` : 'Full'}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-terracotta-500 to-forest-600"
                  style={{ width: `${(spotsFilled / trip.max_members) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Body Content with Generous Padding */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* About Trip */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Trip Plan & Vibe
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                {trip.description}
              </p>
            </div>

            {/* Itinerary Highlights */}
            {trip.itinerary_highlights && trip.itinerary_highlights.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" /> Key Highlights & Activities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trip.itinerary_highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5"
                    >
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-extrabold mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-800 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmed Squad Members Roster */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Users size={14} className="text-terracotta-600" /> Confirmed Travel Squad ({spotsFilled}/{trip.max_members})
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  {spotsLeft} open slot{spotsLeft !== 1 ? 's' : ''} remaining
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {confirmedMembers.map((member) => {
                  const memberProfile = member.profile || (member.user_id === trip.host_id ? hostProfile : undefined);
                  if (!memberProfile) return null;

                  return (
                    <div
                      key={member.id}
                      className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-subtle"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-terracotta-400/50">
                        <Image
                          src={memberProfile.avatar_url}
                          alt={memberProfile.full_name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-gray-900 truncate">
                            {memberProfile.full_name}
                          </h4>
                          {member.role === 'host' ? (
                            <span className="rounded-md bg-terracotta-50 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-terracotta-700 border border-terracotta-200">
                              Trip Lead
                            </span>
                          ) : (
                            <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                              Member
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <VibeScorePill
                            score={memberProfile.vibe_score}
                            reviewsCount={memberProfile.reviews_count}
                            size="sm"
                          />
                          <span className="text-[11px] text-gray-500 truncate">
                            {memberProfile.travel_style}
                          </span>
                        </div>

                        {/* Badges preview */}
                        {memberProfile.badges && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {Object.entries(memberProfile.badges)
                              .slice(0, 2)
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vibe Checklist */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                    meetsVibeRequirement ? 'text-forest-700' : 'text-amber-600'
                  }`}
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    {meetsVibeRequirement
                      ? 'You meet the minimum Vibe Score requirement!'
                      : `Minimum Vibe Score: ${trip.min_vibe_score.toFixed(1)}`}
                  </h4>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                    Your current Vibe Score is{' '}
                    <span className="font-extrabold text-forest-700">
                      {currentUser.vibe_score.toFixed(1)} / 5.0
                    </span>
                    . Hosts verify vibe history, peer badges, and reliability before approving join
                    requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-stone-200 bg-white p-4 sm:p-5 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-2.5 text-xs sm:text-sm font-bold text-gray-700 hover:bg-stone-100"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            {isHost ? (
              <div className="flex items-center gap-2 text-xs font-bold text-terracotta-700 bg-terracotta-50 px-3.5 py-2 rounded-xl border border-terracotta-200">
                <Info size={15} /> You are the host of this trip
              </div>
            ) : isAlreadyMember ? (
              <div className="flex items-center gap-2 text-xs font-bold text-forest-700 bg-forest-50 px-3.5 py-2 rounded-xl border border-forest-200">
                <CheckCircle2 size={15} /> You are in this Squad!
              </div>
            ) : (
              <>
                {onSwipeLeft && !hasSwiped && (
                  <button
                    onClick={() => {
                      onSwipeLeft(trip.id);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50"
                  >
                    <Ban size={15} />
                    <span>Pass</span>
                  </button>
                )}

                {onSwipeRight && !hasSwiped && (
                  <button
                    onClick={() => {
                      onSwipeRight(trip.id);
                      onClose();
                    }}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-forest-600 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-glow-emerald hover:scale-105 transition-all"
                  >
                    <Heart size={15} className="fill-current" />
                    <span>Request to Join Squad</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
