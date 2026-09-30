'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { HostRequestCard } from '@/components/HostRequestCard';
import {
  Bell,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Compass,
  MapPin,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatINR } from '@/lib/utils';

export default function HostDashboardPage() {
  const {
    currentUser,
    trips,
    swipes,
    updateSwipeStatus,
    getIncomingRequestsForHost,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'squad' | 'all'>('pending');

  const incomingSwipes = getIncomingRequestsForHost();
  const hostedTrips = trips.filter((t) => t.host_id === currentUser.id);

  const pendingRequests = incomingSwipes.filter((s) => s.status === 'pending');
  const acceptedRequests = incomingSwipes.filter((s) => s.status === 'accepted');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cinema-850/80 px-3.5 py-1 text-xs font-bold text-cinema-300 border border-white/10 mb-2 shadow-glass backdrop-blur-xl">
            <Bell size={14} className="text-terracotta-400" />
            <span>Host Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
            Incoming Squad Join Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-cinema-400">
            Review travelers who swiped right on your trips. Inspect their Vibe Scores and peer badges before accepting.
          </p>
        </div>

        <Link
          href="/trips/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-glow hover:scale-105 transition-all self-start md:self-auto"
        >
          <Plus size={18} />
          <span>Host Another Trip</span>
        </Link>
      </div>

      {/* Hosted Trips Overview Carousel / Strip */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cinema-400 mb-3.5 flex items-center gap-2">
          <Compass size={16} className="text-terracotta-400" /> Your Hosted Trips ({hostedTrips.length})
        </h2>

        {hostedTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostedTrips.map((trip) => {
              const members = trip.members || [];
              const spotsLeft = Math.max(0, trip.max_members - members.length);
              const tripPendingSwipes = swipes.filter(
                (s) => s.trip_id === trip.id && s.status === 'pending'
              );

              return (
                <div
                  key={trip.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-cinema-900/80 p-4 transition-all hover:border-white/20 shadow-glass backdrop-blur-2xl"
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-2xl mb-3 bg-cinema-950">
                    <Image
                      src={trip.cover_image}
                      alt={trip.title}
                      fill
                      className="object-cover brightness-[0.85] group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-extrabold uppercase text-emerald-400 backdrop-blur-xl border border-white/10 shadow-lg">
                        {formatINR(trip.budget_per_person)} / head
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">
                    {trip.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-cinema-400 mb-3 font-medium">
                    <MapPin size={12} className="text-terracotta-400 flex-shrink-0" />
                    <span className="truncate">{trip.destination}</span>
                  </div>

                  {/* Squad spots progress */}
                  <div className="rounded-2xl bg-cinema-950/60 p-2.5 border border-white/5">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span className="text-cinema-400">Squad Capacity:</span>
                      <span className="font-bold text-terracotta-400">
                        {members.length} / {trip.max_members}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-cinema-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-terracotta-500 to-emerald-400 rounded-full"
                        style={{ width: `${(members.length / trip.max_members) * 100}%` }}
                      />
                    </div>
                  </div>

                  {tripPendingSwipes.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-500/30">
                      <AlertCircle size={14} />
                      <span>{tripPendingSwipes.length} pending join request(s)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-cinema-900/60 p-8 text-center shadow-glass backdrop-blur-xl">
            <p className="text-sm text-cinema-400">
              You haven't hosted any trips yet under this account ({currentUser.full_name}).
            </p>
            <Link
              href="/trips/new"
              className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-terracotta-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow"
            >
              <Plus size={14} /> Host Your First Trip
            </Link>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`relative rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'pending'
              ? 'bg-cinema-850 text-white border border-white/15 shadow-glass'
              : 'text-cinema-400 hover:text-white'
          }`}
        >
          Pending Requests ({pendingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('squad')}
          className={`relative rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'squad'
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shadow-glass'
              : 'text-cinema-400 hover:text-white'
          }`}
        >
          Accepted Squad Members ({acceptedRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`relative rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-cinema-800 text-white border border-white/10 shadow-glass'
              : 'text-cinema-400 hover:text-white'
          }`}
        >
          All Swipes ({incomingSwipes.length})
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {activeTab === 'pending' && (
          <>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((swipe) => (
                <HostRequestCard
                  key={swipe.id}
                  swipe={swipe}
                  onAccept={(id) => updateSwipeStatus(id, 'accepted')}
                  onReject={(id) => updateSwipeStatus(id, 'rejected')}
                />
              ))
            ) : (
              <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/70 p-12 text-center shadow-card-cinematic backdrop-blur-2xl">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">
                  No Pending Requests
                </h3>
                <p className="text-xs sm:text-sm text-cinema-400 max-w-sm mx-auto leading-relaxed">
                  All incoming swipe join requests have been addressed! Switch personas to test other traveler perspectives.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'squad' && (
          <>
            {acceptedRequests.length > 0 ? (
              acceptedRequests.map((swipe) => (
                <HostRequestCard
                  key={swipe.id}
                  swipe={swipe}
                  onAccept={(id) => updateSwipeStatus(id, 'accepted')}
                  onReject={(id) => updateSwipeStatus(id, 'rejected')}
                />
              ))
            ) : (
              <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/70 p-12 text-center shadow-card-cinematic backdrop-blur-2xl">
                <Users className="mx-auto h-12 w-12 text-cinema-500 mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">
                  No Accepted Squad Members Yet
                </h3>
                <p className="text-xs sm:text-sm text-cinema-400 max-w-sm mx-auto leading-relaxed">
                  Review pending join requests and click "Accept into Squad" to fill up your trip roster.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'all' && (
          <>
            {incomingSwipes.length > 0 ? (
              incomingSwipes.map((swipe) => (
                <HostRequestCard
                  key={swipe.id}
                  swipe={swipe}
                  onAccept={(id) => updateSwipeStatus(id, 'accepted')}
                  onReject={(id) => updateSwipeStatus(id, 'rejected')}
                />
              ))
            ) : (
              <div className="rounded-[2.5rem] border border-white/10 bg-cinema-900/70 p-12 text-center shadow-card-cinematic backdrop-blur-2xl">
                <Bell className="mx-auto h-12 w-12 text-cinema-500 mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">
                  No Incoming Swipes Found
                </h3>
                <p className="text-xs sm:text-sm text-cinema-400 max-w-sm mx-auto leading-relaxed">
                  Try switching personas with the top-right persona switcher to simulate other travelers swiping right on your trips!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
