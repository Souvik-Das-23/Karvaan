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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/12 bg-cinema-900 shadow-2xl my-auto text-cinema-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-cinema-300 backdrop-blur-xl transition-all hover:bg-white/20 hover:text-white hover:scale-105 border border-white/10 shadow-lg"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Hero Image Section */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-cinema-950">
            <Image
              src={trip.cover_image}
              alt={trip.title}
              fill
              className="object-cover brightness-[0.88] contrast-[1.05]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-900 via-cinema-900/30 to-black/50" />

            {/* Travel Style & Status Overlays */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur-xl border border-white/10 shadow-lg">
                {trip.travel_style}
              </span>
              <span className="rounded-full bg-terracotta-600 px-3 py-1 text-xs font-bold tracking-wider text-white shadow-glow">
                Min {trip.min_vibe_score.toFixed(1)} Vibe Required
              </span>
            </div>

            {/* Title & Location Header */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-terracotta-400 mb-1">
                <MapPin size={15} />
                <span>{trip.destination}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-md">
                {trip.title}
              </h2>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 bg-cinema-950/70 border-y border-white/10">
            {/* Budget Per Person */}
            <div className="flex flex-col p-3.5 rounded-2xl bg-cinema-850/80 border border-white/10 shadow-glass">
              <span className="text-[11px] font-bold uppercase text-cinema-400">
                Estimated / Head
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5 font-display">
                {formatINR(trip.budget_per_person)}
              </span>
              <span className="text-[10px] text-cinema-400">Shared stays & travel</span>
            </div>

            {/* Total Budget */}
            <div className="flex flex-col p-3.5 rounded-2xl bg-cinema-850/80 border border-white/10 shadow-glass">
              <span className="text-[11px] font-bold uppercase text-cinema-400">
                Group Kitty
              </span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 font-display">
                {formatINR(trip.total_budget || trip.budget_per_person * trip.max_members)}
              </span>
              <span className="text-[10px] text-cinema-400">Estimated group pool</span>
            </div>

            {/* Dates */}
            <div className="flex flex-col p-3.5 rounded-2xl bg-cinema-850/80 border border-white/10 shadow-glass">
              <span className="text-[11px] font-bold uppercase text-cinema-400 flex items-center gap-1">
                <Calendar size={12} /> Dates
              </span>
              <span className="text-xs sm:text-sm font-bold text-white mt-1 line-clamp-1">
                {formatDateRange(trip.start_date, trip.end_date)}
              </span>
              <span className="text-[10px] text-cinema-400">Upcoming trip</span>
            </div>

            {/* Squad Spots */}
            <div className="flex flex-col p-3.5 rounded-2xl bg-cinema-850/80 border border-white/10 shadow-glass">
              <span className="text-[11px] font-bold uppercase text-cinema-400 flex items-center gap-1">
                <Users size={12} /> Squad Status
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-base sm:text-lg font-black text-terracotta-400">
                  {spotsFilled} / {trip.max_members}
                </span>
                <span className="text-xs text-emerald-400 font-extrabold">
                  {spotsLeft > 0 ? `${spotsLeft} left` : 'Full'}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cinema-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-terracotta-500 to-emerald-400"
                  style={{ width: `${(spotsFilled / trip.max_members) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* About Trip */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-400 mb-2">
                Trip Plan & Vibe
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-cinema-200">
                {trip.description}
              </p>
            </div>

            {/* Itinerary Highlights */}
            {trip.itinerary_highlights && trip.itinerary_highlights.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-400 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" /> Key Highlights & Activities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trip.itinerary_highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-cinema-850/60 p-3.5 backdrop-blur-md"
                    >
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-terracotta-500/20 text-terracotta-400 text-xs font-extrabold mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm text-cinema-100 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmed Squad Members Roster */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-400 flex items-center gap-1.5">
                  <Users size={14} className="text-terracotta-400" /> Confirmed Travel Squad ({spotsFilled}/{trip.max_members})
                </h3>
                <span className="text-xs text-cinema-400 font-medium">
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
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-cinema-850/80 p-4 shadow-glass backdrop-blur-md"
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
                          <h4 className="text-sm font-bold text-white truncate">
                            {memberProfile.full_name}
                          </h4>
                          {member.role === 'host' ? (
                            <span className="rounded-md bg-terracotta-500/20 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-terracotta-400 border border-terracotta-500/30">
                              Trip Lead
                            </span>
                          ) : (
                            <span className="rounded-md bg-cinema-800 px-1.5 py-0.5 text-[10px] font-semibold text-cinema-400">
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
                          <span className="text-[11px] text-cinema-400 truncate">
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
            <div className="rounded-2xl border border-white/10 bg-cinema-950/60 p-4 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                    meetsVibeRequirement ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {meetsVibeRequirement
                      ? 'You meet the minimum Vibe Score requirement!'
                      : `Minimum Vibe Score: ${trip.min_vibe_score.toFixed(1)}`}
                  </h4>
                  <p className="mt-1 text-xs text-cinema-300 leading-relaxed">
                    Your current Vibe Score is{' '}
                    <span className="font-extrabold text-emerald-400">
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
        <div className="border-t border-white/10 bg-cinema-950 p-4 sm:p-5 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-cinema-850 px-5 py-2.5 text-xs sm:text-sm font-bold text-cinema-300 hover:bg-cinema-800"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            {isHost ? (
              <div className="flex items-center gap-2 text-xs font-bold text-terracotta-400 bg-terracotta-500/10 px-3.5 py-2 rounded-xl border border-terracotta-500/30">
                <Info size={15} /> You are the host of this trip
              </div>
            ) : isAlreadyMember ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/30">
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
                    className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-cinema-850 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-400 hover:bg-rose-950/40"
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
