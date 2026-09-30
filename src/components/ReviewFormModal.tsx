'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { Profile, Trip } from '@/lib/types';
import { BADGE_CONFIG } from '@/lib/utils';
import { VibeBadge } from './VibeBadge';
import confetti from 'canvas-confetti';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewee: Profile | null;
  trip: Trip | null;
  onSubmitReview: (
    tripId: string,
    revieweeId: string,
    rating: number,
    tags: string[],
    comment: string
  ) => Promise<void>;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  reviewee,
  trip,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual', 'Chill']);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !reviewee || !trip) return null;

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitReview(trip.id, reviewee.id, rating, selectedTags, comment);
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
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableBadges = Object.keys(BADGE_CONFIG);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/12 bg-cinema-900 shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-cinema-850 text-cinema-300 hover:text-white hover:bg-cinema-800 transition-all border border-white/10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-white/10">
          <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-terracotta-500/50">
            <Image
              src={reviewee.avatar_url}
              alt={reviewee.full_name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Endorse {reviewee.full_name}
            </h2>
            <p className="text-xs text-cinema-400 truncate max-w-xs font-medium">
              Trip: <span className="text-terracotta-400 font-bold">{trip.title}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Star Rating Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-2">
              Overall Travel Vibe Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={`transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                          : 'text-cinema-700'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-3 text-sm font-extrabold text-amber-400">
                {hoverRating !== null ? hoverRating : rating}.0 Stars
              </span>
            </div>
          </div>

          {/* Badge Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" /> Endorse Community Badges
            </label>
            <p className="text-[11px] text-cinema-400 mb-3">
              Select all behavioral tags that describe your travel experience with them:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableBadges.map((badgeName) => {
                const isSelected = selectedTags.includes(badgeName);
                return (
                  <VibeBadge
                    key={badgeName}
                    name={badgeName}
                    interactive
                    selected={isSelected}
                    onClick={() => toggleTag(badgeName)}
                    size="md"
                  />
                );
              })}
            </div>
          </div>

          {/* Feedback Comment */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-2">
              Traveler Feedback & Memory
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="E.g., Great company on the trail, always woke up on time, kept the shared expense kitty spot on!"
              className="w-full rounded-2xl border border-white/10 bg-cinema-950 p-4 text-xs sm:text-sm text-white placeholder-cinema-500 focus:border-terracotta-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-cinema-850 px-5 py-2.5 text-xs font-bold text-cinema-300 hover:bg-cinema-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-glow hover:scale-105 transition-all disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Updating Vibe...' : 'Submit Endorsement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
