'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  Sparkles,
  Send,
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { formatINR, formatDateRange } from '@/lib/utils';
import { VibeScorePill } from './VibeScorePill';

export const RightSidebar: React.FC = () => {
  const { trips, currentUser } = useApp();
  const [chatMessage, setChatMessage] = useState('');
  const [simulatedMessages, setSimulatedMessages] = useState<
    { sender: string; avatar: string; text: string; time: string; isMe?: boolean }[]
  >([
    {
      sender: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      text: 'Booking the wooden homestay in Tosh today! Kitty split link pinned in group 🏕️',
      time: '10:45 AM',
    },
    {
      sender: 'Ananya Mehta',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      text: 'Checked the weather for Kheerganga hot springs—crystal clear starry nights expected ✨',
      time: '11:15 AM',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setSimulatedMessages((prev) => [
      ...prev,
      {
        sender: currentUser.full_name,
        avatar: currentUser.avatar_url,
        text: chatMessage.trim(),
        time: 'Just now',
        isMe: true,
      },
    ]);
    setChatMessage('');
  };

  const confirmedTrips = trips.filter(
    (t) =>
      t.host_id === currentUser.id ||
      (t.members && t.members.some((m) => m.user_id === currentUser.id))
  );

  return (
    <aside className="hidden xl:flex flex-col justify-between w-80 2xl:w-96 flex-shrink-0 sticky top-20 h-[calc(100vh-6rem)] pl-4 py-2 space-y-5 overflow-y-auto custom-scrollbar">
      {/* 1. Confirmed Trip Squads */}
      <div className="rounded-[2rem] border border-white/10 bg-cinema-900/80 p-5 shadow-glass backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-terracotta-400" /> Confirmed Travel Squads
          </h3>
          <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
            {confirmedTrips.length} Active
          </span>
        </div>

        <div className="space-y-3">
          {confirmedTrips.slice(0, 2).map((trip) => {
            const members = trip.members || [];
            return (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="group block rounded-2xl border border-white/5 bg-cinema-850/60 p-3.5 transition-all hover:bg-cinema-800 hover:border-white/15 shadow-subtle"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-white group-hover:text-terracotta-400 transition-colors line-clamp-1">
                    {trip.title}
                  </h4>
                  <ChevronRight size={14} className="text-cinema-400 group-hover:text-terracotta-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-cinema-400 mb-2">
                  <span className="truncate">{trip.destination}</span>
                  <span className="font-extrabold text-emerald-400">
                    {formatINR(trip.budget_per_person)}
                  </span>
                </div>

                {/* Squad member avatars */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center -space-x-2">
                    {members.map((m, idx) => (
                      <div
                        key={idx}
                        className="relative h-6 w-6 overflow-hidden rounded-full ring-2 ring-cinema-900"
                        title={m.profile?.full_name}
                      >
                        {m.profile && (
                          <Image
                            src={m.profile.avatar_url}
                            alt={m.profile.full_name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <span className="text-[10px] font-bold text-cinema-400">
                    {members.length} / {trip.max_members} spots filled
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Live Squad Group Chat Preview */}
      <div className="rounded-[2rem] border border-white/10 bg-cinema-900/80 p-5 shadow-glass backdrop-blur-2xl flex-1 flex flex-col justify-between space-y-3 min-h-[300px]">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white">
                Squad Chat: Parvati Valley
              </h3>
            </div>
            <span className="text-[10px] text-cinema-400 font-medium">4 members</span>
          </div>

          {/* Messages list */}
          <div className="space-y-2.5 pt-3 max-h-52 overflow-y-auto pr-1">
            {simulatedMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}
              >
                <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                  <Image
                    src={msg.avatar}
                    alt={msg.sender}
                    fill
                    className="object-cover"
                  />
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.isMe
                      ? 'bg-terracotta-700 text-white rounded-tr-none'
                      : 'bg-cinema-800 text-cinema-200 rounded-tl-none border border-white/5'
                  }`}
                >
                  {!msg.isMe && (
                    <div className="text-[10px] font-bold text-cinema-400 mb-0.5">
                      {msg.sender.split(' ')[0]}
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="relative pt-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Message Kasol squad..."
            className="w-full rounded-2xl border border-white/10 bg-cinema-950 pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-cinema-500 focus:border-terracotta-500 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-3.5 flex h-7 w-7 items-center justify-center rounded-xl bg-terracotta-600 text-white transition-transform hover:scale-105 active:scale-95"
          >
            <Send size={12} />
          </button>
        </form>
      </div>
    </aside>
  );
};
