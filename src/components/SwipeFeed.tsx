'use client';

import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, X, RotateCcw, Info, Sparkles, Filter, Plus, Compass } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Trip } from '@/lib/types';
import { SwipeCard } from './SwipeCard';
import { TripDetailsModal } from './TripDetailsModal';
import { useWindowSize } from '@/hooks/useWindowSize';
import confetti from 'canvas-confetti';
import Link from 'next/link';

export const SwipeFeed: React.FC = () => {
  const { trips, swipes, swipeTrip, currentUser } = useApp();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const { width, isMobile } = useWindowSize();

  // Dynamic drag constraint bounds based on window width
  const dragBoundsWidth = useMemo(() => {
    if (typeof window === 'undefined') return 360;
    return Math.min(width * 0.45, 400);
  }, [width]);

  // Filter available trips for current user
  const availableTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Style filter
      if (selectedStyle !== 'All' && trip.travel_style !== selectedStyle) {
        return false;
      }
      // Check if already swiped by current user
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
        colors: ['#c2410c', '#10b981', '#047857', '#d97706', '#f43f5e'],
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
      {/* Travel Style Filter Chips */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none px-1">
        <span className="text-xs font-bold text-gray-500 flex items-center gap-1 pl-1 flex-shrink-0">
          <Filter size={12} /> Style:
        </span>
        {travelStyles.map((style) => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`flex-shrink-0 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
              selectedStyle === style
                ? 'bg-terracotta-700 text-white shadow-glow'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-stone-200 shadow-subtle'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Swipe Deck Container (80% height on mobile, fixed height on desktop) */}
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
                  dragBoundsWidth={dragBoundsWidth}
                />
              );
            })
          ) : (
            /* Empty State when deck is complete */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl sm:rounded-4xl border border-stone-200 bg-white p-6 text-center shadow-card"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-terracotta-50 text-terracotta-600 mb-4 ring-1 ring-terracotta-200">
                <Compass className="h-8 w-8 text-terracotta-700" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">
                You’re All Caught Up!
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
                No more open trips matching your current filter. Check back soon or launch your own group itinerary!
              </p>

              <div className="flex flex-col gap-2.5 w-full max-w-xs">
                {selectedStyle !== 'All' && (
                  <button
                    onClick={() => setSelectedStyle('All')}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-stone-100 px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-800 hover:bg-stone-200 transition-all border border-stone-200"
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
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 border border-stone-200"
                >
                  <span>Review Host Requests</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe Action Trigger Buttons */}
      {currentTrip && (
        <div className="mt-5 flex items-center justify-center gap-4 sm:gap-6">
          {/* PASS BUTTON (Muted Coral) */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleSwipe('pass')}
            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-stone-200 bg-white text-rose-500 shadow-md transition-all hover:bg-rose-50 hover:border-rose-300 hover:shadow-subtle"
            title="Pass (Swipe Left)"
            aria-label="Pass trip"
          >
            <X size={26} className="stroke-[2.5]" />
          </motion.button>

          {/* VIEW DETAILS MODAL BUTTON */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedTrip(currentTrip)}
            className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-stone-200 bg-white text-gray-700 shadow-md transition-all hover:bg-stone-50 hover:text-terracotta-700"
            title="View Full Trip Details & Itinerary"
            aria-label="Trip Details"
          >
            <Info size={20} />
          </motion.button>

          {/* JOIN REQUEST BUTTON (Soft Emerald / Terracotta Glow) */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleSwipe('like')}
            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-forest-600 text-white shadow-glow-emerald transition-all hover:scale-105 active:scale-95"
            title="Interested / Join Request (Swipe Right)"
            aria-label="Join trip"
          >
            <Heart size={28} className="fill-white stroke-white" />
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
