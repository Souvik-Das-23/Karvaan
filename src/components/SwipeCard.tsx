'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Calendar, Users, Sparkles, Heart, Ban, Info, ShieldCheck, Compass } from 'lucide-react';
import { Trip } from '@/lib/types';
import { formatINR, formatDateRange } from '@/lib/utils';
import { VibeScorePill } from './VibeScorePill';

interface SwipeCardProps {
  trip: Trip;
  isFront: boolean;
  onSwipe: (direction: 'like' | 'pass') => void;
  onOpenDetails: (trip: Trip) => void;
  styleOffset?: number;
  totalCards?: number;
  currentIndex?: number;
  dragBoundsWidth?: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  trip,
  isFront,
  onSwipe,
  onOpenDetails,
  styleOffset = 0,
  totalCards = 5,
  currentIndex = 1,
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

  // 3D Horizon Fan Carousel perspective based on stack offset
  // Offset 0 = Active center card
  // Offset 1 = Left or Right flanking preview
  // Offset 2 = Outer receding card
  const scale = 1 - styleOffset * 0.05;
  const translateY = styleOffset * 8;
  const rotateY = styleOffset === 1 ? -6 : styleOffset === 2 ? 6 : 0;
  const brightness = 1 - styleOffset * 0.25;

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
              rotate: rotateY,
              zIndex: 30 - styleOffset,
              pointerEvents: 'none',
              transformOrigin: 'bottom center',
              filter: `brightness(${brightness})`,
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
              rotate: rotateY,
              transition: { type: 'spring', stiffness: 350, damping: 28 },
            }
          : undefined
      }
      className="absolute inset-0 select-none rounded-[2.25rem] sm:rounded-[2.75rem] bg-cinema-900 border border-white/15 shadow-card-cinematic overflow-hidden flex flex-col cursor-grab will-change-transform"
    >
      {/* Full-Bleed Atmospheric Destination Image */}
      <div className="relative h-full w-full overflow-hidden bg-cinema-950">
        <Image
          src={trip.cover_image}
          alt={trip.title}
          fill
          sizes="(max-width: 640px) 100vw, 440px"
          className="object-cover pointer-events-none brightness-[0.88] contrast-[1.05]"
          priority={isFront}
        />

        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-cinema-950/25 to-black/50 pointer-events-none" />

        {/* Top Header: Style Badge & Index Counter (e.g., 1 / 20) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <span className="rounded-full bg-black/50 backdrop-blur-xl px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-cinema-100 border border-white/10 shadow-lg">
            {trip.travel_style}
          </span>

          {/* Index Counter Pill (like "1 / 20" in the reference image) */}
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-xl px-3 py-1 text-xs font-black text-cinema-200 border border-white/12 shadow-lg">
            <span className="text-white font-extrabold">{currentIndex}</span>
            <span className="text-cinema-400 font-medium">/</span>
            <span className="text-cinema-400 font-medium">{totalCards}</span>
          </div>
        </div>

        {/* SWIPE OVERLAY STAMPS */}
        {isFront && (
          <>
            {/* JOIN STAMP */}
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-12 left-6 rotate-[-16deg] rounded-3xl border-[3px] border-emerald-400 bg-emerald-950/80 px-5 py-2.5 backdrop-blur-2xl pointer-events-none shadow-glow-emerald z-30"
            >
              <div className="flex items-center gap-2 text-xl font-black uppercase tracking-widest text-emerald-300">
                <Heart size={24} className="fill-emerald-400 stroke-emerald-400" />
                <span>JOIN</span>
              </div>
            </motion.div>

            {/* PASS STAMP */}
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-12 right-6 rotate-[16deg] rounded-3xl border-[3px] border-rose-500 bg-rose-950/80 px-5 py-2.5 backdrop-blur-2xl pointer-events-none shadow-glow z-30"
            >
              <div className="flex items-center gap-2 text-xl font-black uppercase tracking-widest text-rose-300">
                <Ban size={24} className="stroke-rose-400 stroke-[2.5]" />
                <span>PASS</span>
              </div>
            </motion.div>
          </>
        )}

        {/* Floating Info Button on Image */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(trip);
          }}
          className="absolute top-4 right-20 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-cinema-300 backdrop-blur-xl border border-white/10 shadow-lg transition-all hover:bg-white/20 hover:text-white active:scale-95"
          title="Trip Details & Itinerary"
        >
          <Info size={14} />
        </button>

        {/* Center / Bottom Card Typography (Clean White & Warm Champagne) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end text-left z-20 bg-gradient-to-t from-cinema-950 via-cinema-950/80 to-transparent pt-16">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-terracotta-400 mb-1">
            <MapPin size={13} className="flex-shrink-0" />
            <span className="truncate tracking-wide">{trip.destination}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight font-display drop-shadow-md">
            {trip.title}
          </h3>

          <div className="mt-1.5 flex items-center justify-between text-xs text-cinema-300">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-cinema-400" />
              {formatDateRange(trip.start_date, trip.end_date)}
            </span>
            <span className="font-extrabold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              Min {trip.min_vibe_score.toFixed(1)}+ Vibe
            </span>
          </div>

          {/* Confirmed Squad Members Avatars Row */}
          <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-cinema-300 uppercase tracking-wider">
                Squad ({spotsFilled}/{trip.max_members}):
              </span>
              <div className="flex items-center -space-x-2">
                {confirmedMembers.map((member) => {
                  const profile = member.profile || (member.user_id === trip.host_id ? hostProfile : undefined);
                  if (!profile) return null;

                  return (
                    <div
                      key={member.id}
                      className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-cinema-950 shadow-md"
                      title={`${profile.full_name} (${member.role === 'host' ? 'Host' : 'Member'}) • Vibe: ${profile.vibe_score}`}
                    >
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Pill */}
            <div className="text-right">
              <span className="text-lg sm:text-xl font-black text-emerald-400 font-display">
                {formatINR(trip.budget_per_person)}
              </span>
              <span className="text-[10px] text-cinema-400 block -mt-1 font-medium">per head</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
