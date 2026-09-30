'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Profile, Trip } from '@/lib/types';
import { Star, Sparkles, MessageSquare, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { VibeScorePill } from '@/components/VibeScorePill';
import { VibeBadge } from '@/components/VibeBadge';
import { ReviewFormModal } from '@/components/ReviewFormModal';
import { formatDateRange } from '@/lib/utils';

export default function ReviewsPage() {
  const { currentUser, trips, reviews, submitReview, allUsers } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewee, setSelectedReviewee] = useState<Profile | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const userTrips = trips.filter(
    (trip) =>
      trip.host_id === currentUser.id ||
      (trip.members && trip.members.some((m) => m.user_id === currentUser.id))
  );

  const openReviewModal = (trip: Trip, reviewee: Profile) => {
    setSelectedTrip(trip);
    setSelectedReviewee(reviewee);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cinema-850/80 px-3.5 py-1 text-xs font-bold text-cinema-300 border border-white/10 mb-2 shadow-glass backdrop-blur-xl">
          <HeartHandshake size={14} className="text-terracotta-400" />
          <span>Peer Review & Reputation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
          Post-Trip Mutual Reviews & Vibe Badges
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-cinema-400 max-w-2xl">
          Rate your fellow co-travelers after every adventure. Award badges like <span className="text-emerald-400 font-bold">"Punctual"</span>, <span className="text-teal-400 font-bold">"Chill"</span>, and <span className="text-terracotta-400 font-bold">"Budget Maestro"</span> to power their community Vibe Score.
        </p>
      </div>

      {/* Eligible Co-Travelers for Review Grid */}
      <div className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cinema-400 mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" /> Pending Peer Endorsements
        </h2>

        <div className="space-y-6">
          {userTrips.map((trip) => {
            const confirmedMembers = trip.members || [];
            const coTravelers = confirmedMembers
              .filter((m) => m.user_id !== currentUser.id)
              .map((m) => m.profile || allUsers.find((u) => u.id === m.user_id))
              .filter(Boolean) as Profile[];

            if (coTravelers.length === 0) return null;

            return (
              <div
                key={trip.id}
                className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-7 shadow-glass backdrop-blur-2xl"
              >
                {/* Trip Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-cinema-400 mt-0.5">
                      {trip.destination} • {formatDateRange(trip.start_date, trip.end_date)}
                    </p>
                  </div>
                  <span className="self-start sm:self-auto rounded-full bg-cinema-850 px-3 py-1 text-xs font-semibold text-cinema-300 border border-white/10">
                    {coTravelers.length} Co-Traveler{coTravelers.length !== 1 ? 's' : ''} in Squad
                  </span>
                </div>

                {/* Co-Travelers Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coTravelers.map((traveler) => {
                    const existingReview = reviews.find(
                      (r) =>
                        r.trip_id === trip.id &&
                        r.reviewer_id === currentUser.id &&
                        r.reviewee_id === traveler.id
                    );

                    return (
                      <div
                        key={traveler.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-2xl border border-white/10 bg-cinema-850/60 p-4 transition-all hover:bg-cinema-800 shadow-subtle backdrop-blur-md"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-terracotta-400/50">
                            <Image
                              src={traveler.avatar_url}
                              alt={traveler.full_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">
                              {traveler.full_name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <VibeScorePill score={traveler.vibe_score} size="sm" />
                              <span className="text-[11px] text-cinema-400 truncate">
                                {traveler.travel_style}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {existingReview ? (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
                              <CheckCircle2 size={14} />
                              <span>Endorsed ({existingReview.rating}★)</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => openReviewModal(trip, traveler)}
                              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 px-4 py-2 text-xs font-bold text-white shadow-glow hover:scale-105 transition-all"
                            >
                              <Star size={14} className="fill-current" />
                              <span>Leave Vibe Review</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Reviews Feed */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-cinema-400 mb-4 flex items-center gap-2">
          <MessageSquare size={16} className="text-terracotta-400" /> Recent Community Endorsements ({reviews.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => {
            const reviewer =
              review.reviewer || allUsers.find((u) => u.id === review.reviewer_id);
            const reviewee =
              review.reviewee || allUsers.find((u) => u.id === review.reviewee_id);
            const trip =
              review.trip || trips.find((t) => t.id === review.trip_id);

            return (
              <div
                key={review.id}
                className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-cinema-900/80 p-5 shadow-glass backdrop-blur-2xl"
              >
                <div>
                  {/* Review Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
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
                      <div className="text-xs">
                        <span className="font-bold text-white">
                          {reviewer?.full_name || 'Traveler'}
                        </span>
                        <span className="text-cinema-400"> reviewed </span>
                        <span className="font-bold text-terracotta-400">
                          {reviewee?.full_name || 'Traveler'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 text-xs font-extrabold text-amber-300">
                      <Star size={12} className="fill-current" />
                      <span>{review.rating}.0</span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-cinema-200 italic leading-relaxed mb-3">
                    "{review.comment}"
                  </p>
                </div>

                {/* Badges and Trip tag */}
                <div className="pt-3 border-t border-white/10">
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {review.tags.map((tag) => (
                        <VibeBadge key={tag} name={tag} size="sm" />
                      ))}
                    </div>
                  )}

                  {trip && (
                    <span className="text-[11px] text-cinema-400 font-medium">
                      Trip: {trip.title}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reviewee={selectedReviewee}
        trip={selectedTrip}
        onSubmitReview={submitReview}
      />
    </div>
  );
}
