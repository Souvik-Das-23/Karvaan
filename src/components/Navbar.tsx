'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Flame, PlusCircle, Star, User, Bell } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserSwitcher } from './UserSwitcher';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { getIncomingRequestsForHost } = useApp();
  const incomingRequests = getIncomingRequestsForHost();
  const pendingCount = incomingRequests.filter((r) => r.status === 'pending').length;

  const navLinks = [
    { href: '/', label: 'Discover', icon: Compass },
    {
      href: '/host',
      label: 'Host Requests',
      icon: Bell,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { href: '/trips/new', label: 'Post a Trip', icon: PlusCircle, highlight: true },
    { href: '/reviews', label: 'Mutual Reviews', icon: Star },
    { href: '/profile', label: 'My Vibe', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-header-cinema transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-terracotta-700 to-terracotta-500 shadow-glow transition-transform group-hover:scale-105">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white font-display flex items-center">
              Kar<span className="text-terracotta-400">vaan</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-cinema-400 -mt-1">
              Group Travel Matchmaking
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-terracotta-600 to-terracotta-700 px-4 py-2 text-xs lg:text-sm font-bold text-white shadow-glow transition-all hover:scale-105"
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs lg:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-cinema-850 text-white font-bold border border-white/10'
                    : 'text-cinema-400 hover:bg-cinema-900/60 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-600 px-1.5 text-[10px] font-extrabold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <UserSwitcher />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 z-40 flex w-full md:hidden glass-nav-mobile-cinema py-2 px-2 justify-around items-center shadow-2xl">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center gap-0.5 rounded-xl p-2 text-[10px] font-semibold transition-all ${
                isActive ? 'text-terracotta-400 font-bold' : 'text-cinema-400 hover:text-cinema-200'
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {link.badge && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-600 px-1 text-[9px] font-black text-white">
                    {link.badge}
                  </span>
                )}
              </div>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
