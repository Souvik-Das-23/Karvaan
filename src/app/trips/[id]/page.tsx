'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  Heart,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { formatINR, formatDateRange } from '@/lib/utils';
import { VibeScorePill } from '@/components/VibeScorePill';
import { VibeBadge } from '@/components/VibeBadge';
import confetti from 'canvas-confetti';

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  const { trips, swipeTrip, currentUser } = useApp();

  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Trip Not Found</h2>
        <p className="text-cinema-400 text-sm mb-6">
          The requested trip plan could not be located or has been archived.
        </p>
        <button
          onClick={() => router.push('/')}
          className="rounded-2xl bg-terracotta-600 px-6 py-3 text-sm font-bold text-white shadow-glow"
        >
          Return to Discover
        </button>
      </div>
    );
  }

  const confirmedMembers = trip.members || [];
  const spotsFilled = confirmedMembers.length;
  const spotsLeft = Math.max(0, trip.max_members - spotsFilled);
  const isHost = trip.host_id === currentUser.id;
  const isMember = confirmedMembers.some((m) => m.user_id === currentUser.id);
  const hostProfile = trip.host || confirmedMembers.find((m) => m.role === 'host')?.profile;

  const handleJoinRequest = async () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#10b981', '#f59e0b', '#d97706'],
      });
    } catch {
      // ignore
    }
    await swipeTrip(trip.id, 'like');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cinema-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Discover
      </button>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/12 bg-cinema-900 shadow-card-cinematic">
        <div className="relative h-72 sm:h-96 w-full bg-cinema-950">
          <Image
            src={trip.cover_image}
            alt={trip.title}
            fill
            className="object-cover brightness-[0.88] contrast-[1.05]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/30 to-black/50" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold uppercase text-white backdrop-blur-xl border border-white/10 shadow-lg">
              {trip.travel_style}
            </span>
            <span className="rounded-full bg-terracotta-600 px-3 py-1 text-xs font-bold text-white shadow-glow">
              Min {trip.min_vibe_score.toFixed(1)} Vibe
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-terracotta-400 mb-1">
              <MapPin size={16} />
              <span>{trip.destination}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
              {trip.title}
            </h1>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 bg-cinema-950/70 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-cinema-850/80 border border-white/10 shadow-glass">
            <span className="text-[11px] font-bold text-cinema-400 uppercase">Estimated Budget</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5 font-display">{formatINR(trip.budget_per_person)}</div>
            <span className="text-[10px] text-cinema-400">Per person</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-cinema-850/80 border border-white/10 shadow-glass">
            <span className="text-[11px] font-bold text-cinema-400 uppercase">Travel Dates</span>
            <div className="text-xs font-bold text-white mt-1 line-clamp-1">{formatDateRange(trip.start_date, trip.end_date)}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-cinema-850/80 border border-white/10 shadow-glass">
            <span className="text-[11px] font-bold text-cinema-400 uppercase">Squad Capacity</span>
            <div className="text-base font-extrabold text-terracotta-400 mt-0.5">{spotsFilled} / {trip.max_members} Filled</div>
            <span className="text-[10px] text-emerald-400 font-bold">{spotsLeft} spots remaining</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-cinema-850/80 border border-white/10 shadow-glass">
            <span className="text-[11px] font-bold text-cinema-400 uppercase">Trip Lead</span>
            <div className="text-xs font-bold text-white mt-1 truncate">{hostProfile?.full_name || 'Trip Host'}</div>
            {hostProfile && <VibeScorePill score={hostProfile.vibe_score} size="sm" showIcon={false} />}
          </div>
        </div>
      </div>

      {/* Description & Itinerary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-8 shadow-glass backdrop-blur-2xl space-y-3">
            <h2 className="text-xs font-bold text-cinema-400 uppercase tracking-wider">
              Expedition Details & Rules
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-cinema-200">
              {trip.description}
            </p>
          </div>

          {trip.itinerary_highlights && trip.itinerary_highlights.length > 0 && (
            <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-8 shadow-glass backdrop-blur-2xl space-y-4">
              <h2 className="text-xs font-bold text-cinema-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" /> Key Itinerary Highlights
              </h2>
              <div className="space-y-2.5">
                {trip.itinerary_highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-cinema-950/60 p-3.5"
                  >
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-terracotta-500/20 text-terracotta-400 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-cinema-100 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirmed Squad Sidebar */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 shadow-glass backdrop-blur-2xl space-y-4">
            <h2 className="text-xs font-bold text-cinema-400 uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-terracotta-400" /> Squad Roster ({spotsFilled}/{trip.max_members})
            </h2>

            <div className="space-y-3">
              {confirmedMembers.map((member) => {
                const profile = member.profile || (member.user_id === trip.host_id ? hostProfile : undefined);
                if (!profile) return null;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-cinema-950/70 p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-terracotta-400/40 flex-shrink-0">
                        <Image
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {profile.full_name}
                        </div>
                        <div className="text-[10px] text-cinema-400">
                          {member.role === 'host' ? 'Host' : 'Member'}
                        </div>
                      </div>
                    </div>

                    <VibeScorePill score={profile.vibe_score} size="sm" showIcon={false} />
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              {isHost ? (
                <div className="text-xs font-bold text-terracotta-400 bg-terracotta-500/10 p-3 rounded-2xl border border-terracotta-500/20 text-center">
                  You are the host of this trip
                </div>
              ) : isMember ? (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={16} /> You're in this Squad!
                </div>
              ) : (
                <button
                  onClick={handleJoinRequest}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-forest-600 py-3 text-xs sm:text-sm font-extrabold text-white shadow-glow-emerald hover:scale-105 transition-all"
                >
                  <Heart size={16} className="fill-current" />
                  <span>Request to Join Squad</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
