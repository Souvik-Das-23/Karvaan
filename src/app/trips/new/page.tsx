'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { TravelStyle } from '@/lib/types';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

const PRESET_COVERS = [
  {
    label: 'Himachal Mountains',
    url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Gokarna Beaches',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Spiti Valley',
    url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Meghalaya Waterfalls',
    url: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Kerala Backwaters',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Rajasthan Forts',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function NewTripPage() {
  const router = useRouter();
  const { createTrip } = useApp();

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [budgetPerPerson, setBudgetPerPerson] = useState<number>(6500);
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-06');
  const [maxMembers, setMaxMembers] = useState<number>(4);
  const [minVibeScore, setMinVibeScore] = useState<number>(4.0);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Backpacker');
  const [highlights, setHighlights] = useState<string[]>([
    'Shared budget homestay stay',
    'Scenic sunrise trail hike',
    'Local food hopping & sunset bonfire',
  ]);
  const [newHighlight, setNewHighlight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, idx) => idx !== index));
  };

  const totalBudget = budgetPerPerson * maxMembers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination || !description) return;

    setIsSubmitting(true);
    try {
      await createTrip({
        title,
        destination,
        description,
        cover_image: coverImage,
        budget_per_person: Number(budgetPerPerson),
        total_budget: totalBudget,
        start_date: startDate,
        end_date: endDate,
        max_members: Number(maxMembers),
        min_vibe_score: Number(minVibeScore),
        travel_style: travelStyle,
        status: 'open',
        itinerary_highlights: highlights,
      });

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#10b981', '#f59e0b', '#d97706'],
        });
      } catch {
        // ignore
      }

      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cinema-850/80 px-3.5 py-1 text-xs font-bold text-cinema-300 border border-white/10 mb-2 shadow-glass backdrop-blur-xl">
          <Compass size={14} className="text-terracotta-400" />
          <span>Host a Group Itinerary</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
          Post Your Next Group Travel Plan
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-cinema-400">
          Set your budget limits, minimum required vibe score, and let fellow travelers swipe to join your squad.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Destination & Concept */}
        <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-8 shadow-glass backdrop-blur-2xl space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-terracotta-600 text-white text-xs font-black">
              1
            </span>
            Destination & Concept
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-1.5">
                Trip Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Kasol & Kheerganga Stargazing Backpacking"
                className="w-full rounded-2xl border border-white/10 bg-cinema-950 px-4 py-3 text-sm text-white placeholder-cinema-500 focus:border-terracotta-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-1.5">
                Destination / Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 text-cinema-400" size={16} />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="E.g., Parvati Valley, Himachal Pradesh"
                  className="w-full rounded-2xl border border-white/10 bg-cinema-950 pl-10 pr-4 py-3 text-sm text-white placeholder-cinema-500 focus:border-terracotta-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-1.5">
              Trip Description & Squad Vibe *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the plan, stays, daily activities, transportation split, and the kind of co-travelers you're seeking..."
              className="w-full rounded-2xl border border-white/10 bg-cinema-950 p-4 text-sm text-white placeholder-cinema-500 focus:border-terracotta-500 focus:outline-none"
            />
          </div>

          {/* Travel Style Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-2">
              Preferred Travel Style
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  'Backpacker',
                  'Trekker',
                  'Roadtripper',
                  'Digital Nomad',
                  'Leisure',
                  'Luxury Seeker',
                ] as TravelStyle[]
              ).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    travelStyle === style
                      ? 'bg-terracotta-600 text-white shadow-glow scale-105'
                      : 'bg-cinema-850 text-cinema-300 hover:bg-cinema-800 border border-white/5'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Cover Photo */}
        <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-8 shadow-glass backdrop-blur-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-terracotta-600 text-white text-xs font-black">
              2
            </span>
            Destination Visuals
          </h2>

          <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-1">
            Select a Destination Cover
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_COVERS.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => setCoverImage(preset.url)}
                className={`group relative h-24 overflow-hidden rounded-2xl border-2 transition-all ${
                  coverImage === preset.url
                    ? 'border-terracotta-500 ring-2 ring-terracotta-500/40 scale-[1.02]'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={preset.url}
                  alt={preset.label}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[11px] font-bold text-white truncate">
                    {preset.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Or paste custom image URL: https://..."
              className="w-full rounded-2xl border border-white/10 bg-cinema-950 px-4 py-2.5 text-xs text-white focus:border-terracotta-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Step 3: Budget, Dates & Group Constraints */}
        <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-8 shadow-glass backdrop-blur-2xl space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-terracotta-600 text-white text-xs font-black">
              3
            </span>
            Budget, Dates & Vibe Constraints
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Budget Per Person */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-1.5">
                Estimated Budget / Head (₹) *
              </label>
              <input
                type="number"
                min={500}
                step={100}
                required
                value={budgetPerPerson}
                onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-cinema-950 px-4 py-2.5 text-sm text-emerald-400 font-extrabold focus:border-terracotta-500 focus:outline-none"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-cinema-950 px-4 py-2.5 text-sm text-white focus:border-terracotta-500 focus:outline-none"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cinema-400 mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-cinema-950 px-4 py-2.5 text-sm text-white focus:border-terracotta-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Max Group Size */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-cinema-400">
                  Max Squad Size: <span className="text-terracotta-400 font-extrabold">{maxMembers} People</span>
                </label>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full accent-terracotta-500"
              />
              <div className="flex justify-between text-[10px] text-cinema-500 mt-1 font-medium">
                <span>2 (Tandem)</span>
                <span>4 (Optimal)</span>
                <span>8 (Mid squad)</span>
                <span>12 (Max)</span>
              </div>
            </div>

            {/* Minimum Vibe Score Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-cinema-400 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-amber-400" />
                  Min Required Vibe Score: <span className="text-amber-300 font-extrabold">{minVibeScore.toFixed(1)} / 5.0</span>
                </label>
              </div>
              <input
                type="range"
                min={3.0}
                max={4.8}
                step={0.1}
                value={minVibeScore}
                onChange={(e) => setMinVibeScore(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-cinema-500 mt-1 font-medium">
                <span>3.0 (Open)</span>
                <span>4.0 (Recommended)</span>
                <span>4.5 (High Vibe Only)</span>
              </div>
            </div>
          </div>

          {/* Computed Summary Box */}
          <div className="rounded-2xl bg-cinema-950 p-4 border border-white/10 flex items-center justify-between">
            <div className="text-xs text-cinema-400 font-medium">
              Total Estimated Group Kitty Pool:
            </div>
            <div className="text-lg font-black text-emerald-400 font-display">
              ₹{(budgetPerPerson * maxMembers).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Step 4: Itinerary Highlights */}
        <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/80 p-6 sm:p-8 shadow-glass backdrop-blur-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-terracotta-600 text-white text-xs font-black">
              4
            </span>
            Key Itinerary Highlights
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHighlight();
                }
              }}
              placeholder="E.g., Midnight cliff camping under the Perseid meteor shower"
              className="flex-1 rounded-2xl border border-white/10 bg-cinema-950 px-4 py-3 text-xs sm:text-sm text-white placeholder-cinema-500 focus:border-terracotta-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="flex items-center gap-1.5 rounded-2xl bg-cinema-800 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-cinema-700 border border-white/10"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 rounded-2xl border border-white/5 bg-cinema-950/60 p-3.5"
              >
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-cinema-200">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta-500/20 text-terracotta-400 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeHighlight(idx)}
                  className="text-cinema-400 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-2xl border border-white/10 bg-cinema-850 px-6 py-3 text-sm font-bold text-cinema-300 hover:bg-cinema-800 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 px-8 py-3 text-sm font-extrabold text-white shadow-glow hover:scale-105 transition-all disabled:opacity-50"
          >
            <CheckCircle2 size={18} />
            <span>{isSubmitting ? 'Publishing Expedition...' : 'Launch Group Trip'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
