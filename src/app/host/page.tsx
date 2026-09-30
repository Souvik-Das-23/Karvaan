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
          <div className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 px-3 py-1 text-xs font-bold text-terracotta-700 border border-terracotta-200 mb-2 shadow-subtle">
            <Bell size={14} />
            <span>Host Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-display">
            Incoming Squad Join Requests
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3.5 flex items-center gap-2">
          <Compass size={16} className="text-terracotta-600" /> Your Hosted Trips ({hostedTrips.length})
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
                  className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-4 transition-all hover:border-stone-300 shadow-card"
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-2xl mb-3 bg-stone-100">
                    <Image
                      src={trip.cover_image}
                      alt={trip.title}
                      fill
                      className="object-cover brightness-[0.92] group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase text-forest-700 backdrop-blur-md border border-stone-200 shadow-subtle">
                        {formatINR(trip.budget_per_person)} / head
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">
                    {trip.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 font-medium">
                    <MapPin size={12} className="text-terracotta-600 flex-shrink-0" />
                    <span className="truncate">{trip.destination}</span>
                  </div>

                  {/* Squad spots progress */}
                  <div className="rounded-2xl bg-stone-50 p-2.5 border border-stone-100">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span className="text-gray-500">Squad Capacity:</span>
                      <span className="font-bold text-terracotta-700">
                        {members.length} / {trip.max_members}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-terracotta-500 to-forest-600 rounded-full"
                        style={{ width: `${(members.length / trip.max_members) * 100}%` }}
                      />
                    </div>
                  </div>

                  {tripPendingSwipes.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      <AlertCircle size={14} />
                      <span>{tripPendingSwipes.length} pending join request(s)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-subtle">
            <p className="text-sm text-gray-500">
              You haven't hosted any trips yet under this account ({currentUser.full_name}).
            </p>
            <Link
              href="/trips/new"
              className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-terracotta-700 px-5 py-2.5 text-xs font-bold text-white shadow-glow"
            >
              <Plus size={14} /> Host Your First Trip
            </Link>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`relative rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'pending'
              ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200 shadow-subtle'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Pending Requests ({pendingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('squad')}
          className={`relative rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'squad'
              ? 'bg-forest-50 text-forest-700 border border-forest-200 shadow-subtle'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Accepted Squad Members ({acceptedRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`relative rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-stone-100 text-gray-900 border border-stone-200 shadow-subtle'
              : 'text-gray-500 hover:text-gray-900'
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
              <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-card">
                <CheckCircle2 className="mx-auto h-12 w-12 text-forest-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No Pending Requests
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
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
              <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-card">
                <Users className="mx-auto h-12 w-12 text-stone-400 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No Accepted Squad Members Yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
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
              <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-card">
                <Bell className="mx-auto h-12 w-12 text-stone-400 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No Incoming Swipes Found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
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
