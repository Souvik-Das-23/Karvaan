'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Calendar, Users, Sparkles, Heart, Ban, Info, ShieldCheck } from 'lucide-react';
import { Trip } from '@/lib/types';
import { formatINR, formatDateRange } from '@/lib/utils';
import { VibeScorePill } from './VibeScorePill';

interface SwipeCardProps {
  trip: Trip;
  isFront: boolean;
  onSwipe: (direction: 'like' | 'pass') => void;
  onOpenDetails: (trip: Trip) => void;
  styleOffset?: number;
  dragBoundsWidth?: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  trip,
  isFront,
  onSwipe,
  onOpenDetails,
  styleOffset = 0,
  dragBoundsWidth = 360,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-dragBoundsWidth * 0.8, dragBoundsWidth * 0.8], [-14, 14]);
  const likeOpacity = useTransform(x, [30, dragBoundsWidth * 0.35], [0, 1]);
  const passOpacity = useTransform(x, [-dragBoundsWidth * 0.35, -30], [1, 0]);

  const confirmedMembers = trip.members || [];
  const spotsFilled = confirmedMembers.length;
  const spotsLeft = Math.max(0, trip.max_members - spotsFilled);
  const hostProfile = trip.host || confirmedMembers.find((m) => m.role === 'host')?.profile;

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = Math.min(130, dragBoundsWidth * 0.3);
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    }
  };

  // Stack depth visual offsets
  const scale = 1 - styleOffset * 0.035;
  const translateY = styleOffset * 12;

  return (
    <motion.div
      style={
        isFront
          ? {
              x,
              rotate,
              zIndex: 30 - styleOffset,
              transformOrigin: 'bottom center',
            }
          : {
              scale,
              y: translateY,
              zIndex: 30 - styleOffset,
              pointerEvents: 'none',
              transformOrigin: 'bottom center',
            }
      }
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: -dragBoundsWidth, right: dragBoundsWidth, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={isFront ? handleDragEnd : undefined}
      whileDrag={{ cursor: 'grabbing', scale: 1.01 }}
      animate={
        !isFront
          ? {
              scale,
              y: translateY,
              transition: { type: 'spring', stiffness: 350, damping: 28 },
            }
          : undefined
      }
      className="absolute inset-0 select-none rounded-3xl sm:rounded-4xl bg-white border border-stone-200/90 shadow-card overflow-hidden flex flex-col cursor-grab will-change-transform"
    >
      {/* Top Image Section */}
      <div className="relative h-[54%] sm:h-[56%] w-full overflow-hidden bg-stone-100">
        <Image
          src={trip.cover_image}
          alt={trip.title}
          fill
          sizes="(max-width: 640px) 100vw, 440px"
          className="object-cover pointer-events-none brightness-[0.92]"
          priority={isFront}
        />

        {/* Ambient Top & Bottom Image Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 backdrop-blur-md border border-white/40 shadow-subtle">
            {trip.travel_style}
          </span>

          <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-terracotta-700 backdrop-blur-md border border-stone-200 shadow-subtle">
            <ShieldCheck size={14} className="text-terracotta-600" />
            <span>Min {trip.min_vibe_score.toFixed(1)}+ Vibe</span>
          </div>
        </div>

        {/* SWIPE OVERLAY STAMPS */}
        {isFront && (
          <>
            {/* RIGHT SWIPE = JOIN / LIKE STAMP (Soft Emerald) */}
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-8 left-6 rotate-[-16deg] rounded-2xl border-[3px] border-emerald-500 bg-white/95 px-4 py-2 backdrop-blur-md pointer-events-none shadow-glow-emerald z-20"
            >
              <div className="flex items-center gap-2 text-xl font-black uppercase tracking-wider text-emerald-600">
                <Heart size={24} className="fill-emerald-500 stroke-emerald-600" />
                <span>JOIN</span>
              </div>
            </motion.div>

            {/* LEFT SWIPE = PASS / NOPE STAMP (Muted Coral) */}
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-8 right-6 rotate-[16deg] rounded-2xl border-[3px] border-rose-500 bg-white/95 px-4 py-2 backdrop-blur-md pointer-events-none shadow-glow z-20"
            >
              <div className="flex items-center gap-2 text-xl font-black uppercase tracking-wider text-rose-600">
                <Ban size={24} className="stroke-rose-600 stroke-[2.5]" />
                <span>PASS</span>
              </div>
            </motion.div>
          </>
        )}

        {/* Price Tag Pill Floating on Image */}
        <div className="absolute bottom-3.5 left-4 pointer-events-none z-10">
          <div className="flex items-baseline gap-1.5 rounded-2xl bg-white/95 px-3.5 py-1.5 backdrop-blur-md border border-stone-200 shadow-subtle">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Per Head:
            </span>
            <span className="text-xl font-black text-gray-900 font-display">
              {formatINR(trip.budget_per_person)}
            </span>
          </div>
        </div>

        {/* Info button to open full details */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(trip);
          }}
          className="absolute bottom-3.5 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 backdrop-blur-md border border-stone-200 shadow-md transition-all hover:bg-white hover:text-terracotta-600 hover:scale-105 active:scale-95"
          title="View full trip details"
        >
          <Info size={18} />
        </button>
      </div>

      {/* Bottom Content Area */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 bg-white text-gray-900">
        {/* Title & Location */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-terracotta-700 mb-1">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{trip.destination}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight line-clamp-1">
            {trip.title}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Calendar size={13} />
            <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
          </div>
        </div>

        {/* Confirmed Squad Avatars & Vibe Scores */}
        <div className="mt-2.5 rounded-2xl border border-stone-100 bg-stone-50/80 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <Users size={14} className="text-terracotta-600" />
              <span>
                Confirmed Squad ({spotsFilled}/{trip.max_members})
              </span>
            </div>
            <span className="text-[11px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
              {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Squad Full'}
            </span>
          </div>

          {/* Avatars with mini Vibe Score chips */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
            {confirmedMembers.map((member) => {
              const profile = member.profile || (member.user_id === trip.host_id ? hostProfile : undefined);
              if (!profile) return null;

              return (
                <div
                  key={member.id}
                  className="group relative flex flex-col items-center flex-shrink-0"
                  title={`${profile.full_name} (${member.role === 'host' ? 'Host' : 'Member'}) • Vibe: ${profile.vibe_score}`}
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow-subtle transition-transform group-hover:scale-105">
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="-mt-2 z-10">
                    <VibeScorePill score={profile.vibe_score} size="sm" showIcon={false} />
                  </div>
                </div>
              );
            })}

            {/* Empty Spot Placeholders */}
            {Array.from({ length: spotsLeft }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-stone-300 bg-white text-stone-400"
                title="Open squad slot"
              >
                <Users size={13} />
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary Snippet */}
        {trip.itinerary_highlights && trip.itinerary_highlights.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600 truncate font-medium">
            <Sparkles size={13} className="text-amber-500 flex-shrink-0" />
            <span className="truncate">{trip.itinerary_highlights[0]}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
