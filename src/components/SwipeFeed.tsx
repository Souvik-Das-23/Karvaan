'use client';

import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart,
  X,
  RotateCcw,
  Info,
  Sparkles,
  Filter,
  Plus,
  Compass,
  DollarSign,
  Users,
  ShieldCheck,
  Calendar,
  Mountain,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Trip } from '@/lib/types';
import { SwipeCard } from './SwipeCard';
import { TripDetailsModal } from './TripDetailsModal';
import { useWindowSize } from '@/hooks/useWindowSize';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';
import Link from 'next/link';

export const SwipeFeed: React.FC = () => {
  const { trips, swipes, swipeTrip, currentUser } = useApp();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const { width } = useWindowSize();

  const dragBoundsWidth = useMemo(() => {
    if (typeof window === 'undefined') return 360;
    return Math.min(width * 0.45, 400);
  }, [width]);

  const availableTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (selectedStyle !== 'All' && trip.travel_style !== selectedStyle) {
        return false;
      }
      const alreadySwiped = swipes.some(
        (s) => s.trip_id === trip.id && s.user_id === currentUser.id
      );
      return !alreadySwiped;
    });
  }, [trips, swipes, currentUser.id, selectedStyle]);

  const activeDeck = availableTrips;
  const currentTrip = activeDeck.length > 0 ? activeDeck[0] : null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ea580c', '#10b981', '#f59e0b', '#d97706', '#f43f5e'],
      });
    } catch {
      // ignore
    }
  };

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (!currentTrip) return;

    const tripId = currentTrip.id;
    if (direction === 'like') {
      triggerConfetti();
    }
    await swipeTrip(tripId, direction);
  };

  const travelStyles = ['All', 'Backpacker', 'Trekker', 'Roadtripper', 'Digital Nomad', 'Leisure'];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto py-1 sm:py-2">
      {/* Top Travel Style Chips */}
      <div className="w-full flex items-center justify-between gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none px-1">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {travelStyles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`flex-shrink-0 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                selectedStyle === style
                  ? 'bg-cinema-100 text-cinema-950 shadow-lg'
                  : 'bg-cinema-850/80 text-cinema-400 hover:text-white border border-white/10'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Main Swipe Deck Container */}
      <div className="relative h-[72vh] max-h-[580px] min-h-[500px] sm:h-[570px] w-full">
        <AnimatePresence>
          {activeDeck.length > 0 ? (
            activeDeck.slice(0, 3).map((trip, index) => {
              const isFront = index === 0;
              return (
                <SwipeCard
                  key={trip.id}
                  trip={trip}
                  isFront={isFront}
                  onSwipe={handleSwipe}
                  onOpenDetails={(t) => setSelectedTrip(t)}
                  styleOffset={index}
                  totalCards={activeDeck.length}
                  currentIndex={index + 1}
                  dragBoundsWidth={dragBoundsWidth}
                />
              );
            })
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[2.5rem] border border-white/10 bg-cinema-900/90 p-6 text-center shadow-card-cinematic backdrop-blur-2xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-terracotta-500/15 text-terracotta-400 mb-4 ring-1 ring-terracotta-500/30">
                <Compass className="h-8 w-8 animate-spin-slow" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                You’re All Caught Up!
              </h3>
              <p className="text-xs sm:text-sm text-cinema-400 max-w-xs mb-6 leading-relaxed">
                No more open expeditions matching this filter. Check back soon or launch your own group itinerary!
              </p>

              <div className="flex flex-col gap-2.5 w-full max-w-xs">
                {selectedStyle !== 'All' && (
                  <button
                    onClick={() => setSelectedStyle('All')}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-cinema-800 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-cinema-700 transition-all border border-white/10"
                  >
                    <span>View All Travel Styles</span>
                  </button>
                )}

                <Link
                  href="/trips/new"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Plus size={16} />
                  <span>Host a New Trip</span>
                </Link>

                <Link
                  href="/host"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-cinema-950 px-4 py-2.5 text-xs sm:text-sm font-semibold text-cinema-400 hover:text-white border border-white/10"
                >
                  <span>Review Host Requests</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Floating Metric Pods Capsule Dock (exact match to the reference image) */}
      {currentTrip && (
        <div className="mt-4 w-full flex items-center justify-center gap-2 px-2">
          <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-cinema-900/90 border border-white/15 px-4 py-2 shadow-capsule-glow backdrop-blur-2xl text-[11px] font-bold text-cinema-200">
            <span className="flex items-center gap-1 text-emerald-400">
              <DollarSign size={13} /> {formatINR(currentTrip.budget_per_person)}
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1 text-cinema-100">
              <Users size={13} className="text-terracotta-400" />
              {currentTrip.members?.length || 1}/{currentTrip.max_members} Spots
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1 text-amber-300">
              <Sparkles size={13} /> Min {currentTrip.min_vibe_score}★
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1 text-cinema-300">
              <Mountain size={13} /> {currentTrip.travel_style}
            </span>
          </div>
        </div>
      )}

      {/* Action Triggers (Pass / Details / Join) */}
      {currentTrip && (
        <div className="mt-4 flex items-center justify-center gap-5">
          {/* PASS BUTTON */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleSwipe('pass')}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-cinema-900/90 text-rose-400 shadow-glass backdrop-blur-xl transition-all hover:bg-rose-950/40 hover:border-rose-500/50 hover:shadow-glow"
            title="Pass (Swipe Left)"
            aria-label="Pass trip"
          >
            <X size={24} className="stroke-[2.5]" />
          </motion.button>

          {/* VIEW DETAILS MODAL BUTTON */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedTrip(currentTrip)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-cinema-900/90 text-cinema-200 shadow-glass backdrop-blur-xl transition-all hover:bg-cinema-800 hover:text-white"
            title="View Full Trip Details & Itinerary"
            aria-label="Trip Details"
          >
            <Info size={19} />
          </motion.button>

          {/* JOIN REQUEST BUTTON */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleSwipe('like')}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-forest-600 text-white shadow-glow-emerald backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
            title="Interested / Join Request (Swipe Right)"
            aria-label="Join trip"
          >
            <Heart size={26} className="fill-white stroke-white" />
          </motion.button>
        </div>
      )}

      {/* Trip Details Modal */}
      <TripDetailsModal
        trip={selectedTrip}
        isOpen={Boolean(selectedTrip)}
        onClose={() => setSelectedTrip(null)}
        onSwipeRight={(id) => handleSwipe('like')}
        onSwipeLeft={(id) => handleSwipe('pass')}
      />
    </div>
  );
};
