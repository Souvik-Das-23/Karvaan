'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Flame,
  PlusCircle,
  Star,
  User,
  Bell,
  ShieldCheck,
  Mountain,
  MapPin,
  Layers,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Image from 'next/image';
import { VibeScorePill } from './VibeScorePill';
import { VibeBadge } from './VibeBadge';

export const LeftSidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, getIncomingRequestsForHost } = useApp();

  const incomingRequests = getIncomingRequestsForHost();
  const pendingCount = incomingRequests.filter((r) => r.status === 'pending').length;

  const navLinks = [
    { href: '/', label: 'Discover Trips', icon: Compass },
    {
      href: '/host',
      label: 'Host Requests',
      icon: Bell,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { href: '/trips/new', label: 'Post a Trip', icon: PlusCircle, highlight: true },
    { href: '/reviews', label: 'Mutual Reviews', icon: Star },
    { href: '/profile', label: 'My Vibe & Profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-72 xl:w-80 flex-shrink-0 sticky top-20 h-[calc(100vh-6rem)] pr-4 py-2">
      {/* Top Section: Navigation Links */}
      <div className="space-y-6">
        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 px-4 py-3 text-sm font-extrabold text-white shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] mb-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </div>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                    Host
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-cinema-850 text-white font-bold border border-white/12 shadow-glass'
                    : 'text-cinema-400 hover:bg-cinema-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isActive ? 'text-terracotta-400' : 'text-cinema-400'}
                  />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-600 px-1.5 text-[10px] font-extrabold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Active Persona Profile Summary Card */}
      <div className="rounded-[2rem] border border-white/10 bg-cinema-900/80 p-5 shadow-glass backdrop-blur-2xl space-y-3.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-2 ring-terracotta-500/40">
              <Image
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {currentUser.full_name}
              </h3>
              <p className="text-[11px] text-cinema-400">
                {currentUser.travel_style} • {currentUser.age} yrs
              </p>
            </div>
          </div>

          <VibeScorePill score={currentUser.vibe_score} size="sm" />
        </div>

        <p className="text-xs text-cinema-300 line-clamp-2 leading-relaxed">
          {currentUser.bio}
        </p>

        {/* Top Badges */}
        {currentUser.badges && (
          <div className="flex flex-wrap gap-1 pt-1">
            {Object.entries(currentUser.badges)
              .slice(0, 2)
              .map(([badgeName, count]) => (
                <VibeBadge key={badgeName} name={badgeName} count={count} size="sm" />
              ))}
          </div>
        )}

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-cinema-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck size={13} /> Verified Traveler
          </span>
          <Link
            href="/profile"
            className="text-terracotta-400 font-bold hover:underline"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </aside>
  );
};
