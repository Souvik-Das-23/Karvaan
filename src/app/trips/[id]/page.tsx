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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">
          The requested trip plan could not be located or has been archived.
        </p>
        <button
          onClick={() => router.push('/')}
          className="rounded-2xl bg-terracotta-700 px-6 py-3 text-sm font-bold text-white shadow-glow"
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
        colors: ['#c2410c', '#10b981', '#047857', '#d97706'],
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
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Discover
      </button>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl border border-stone-200 bg-white shadow-card">
        <div className="relative h-72 sm:h-96 w-full bg-stone-100">
          <Image
            src={trip.cover_image}
            alt={trip.title}
            fill
            className="object-cover brightness-[0.92]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase text-gray-900 backdrop-blur-md border border-white/40 shadow-subtle">
              {trip.travel_style}
            </span>
            <span className="rounded-full bg-terracotta-700 px-3 py-1 text-xs font-bold text-white shadow-glow">
              Min {trip.min_vibe_score.toFixed(1)} Vibe
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-terracotta-200 mb-1">
              <MapPin size={16} />
              <span>{trip.destination}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
              {trip.title}
            </h1>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 bg-stone-50 border-t border-stone-200">
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-subtle">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Estimated Budget</span>
            <div className="text-lg font-black text-forest-700 mt-0.5 font-display">{formatINR(trip.budget_per_person)}</div>
            <span className="text-[10px] text-gray-500">Per person</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-subtle">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Travel Dates</span>
            <div className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">{formatDateRange(trip.start_date, trip.end_date)}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-subtle">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Squad Capacity</span>
            <div className="text-base font-extrabold text-terracotta-700 mt-0.5">{spotsFilled} / {trip.max_members} Filled</div>
            <span className="text-[10px] text-forest-700 font-bold">{spotsLeft} spots remaining</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-subtle">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Trip Lead</span>
            <div className="text-xs font-bold text-gray-900 mt-1 truncate">{hostProfile?.full_name || 'Trip Host'}</div>
            {hostProfile && <VibeScorePill score={hostProfile.vibe_score} size="sm" showIcon={false} />}
          </div>
        </div>
      </div>

      {/* Description & Itinerary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl sm:rounded-4xl border border-stone-200 bg-white p-6 sm:p-8 shadow-card space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Expedition Details & Rules
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">
              {trip.description}
            </p>
          </div>

          {trip.itinerary_highlights && trip.itinerary_highlights.length > 0 && (
            <div className="rounded-3xl sm:rounded-4xl border border-stone-200 bg-white p-6 sm:p-8 shadow-card space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" /> Key Itinerary Highlights
              </h2>
              <div className="space-y-2.5">
                {trip.itinerary_highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3.5"
                  >
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirmed Squad Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl sm:rounded-4xl border border-stone-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-terracotta-600" /> Squad Roster ({spotsFilled}/{trip.max_members})
            </h2>

            <div className="space-y-3">
              {confirmedMembers.map((member) => {
                const profile = member.profile || (member.user_id === trip.host_id ? hostProfile : undefined);
                if (!profile) return null;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-3"
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
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {profile.full_name}
                        </div>
                        <div className="text-[10px] text-gray-400">
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
                <div className="text-xs font-bold text-terracotta-700 bg-terracotta-50 p-3 rounded-2xl border border-terracotta-200 text-center">
                  You are the host of this trip
                </div>
              ) : isMember ? (
                <div className="text-xs font-bold text-forest-700 bg-forest-50 p-3 rounded-2xl border border-forest-200 text-center flex items-center justify-center gap-1.5">
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
