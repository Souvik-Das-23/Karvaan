import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateRange(startDate: string, endDate: string): string {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = differenceInDays(end, start) + 1;
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')} (${days} ${days === 1 ? 'day' : 'days'})`;
  } catch {
    return `${startDate} - ${endDate}`;
  }
}

export function getVibeScoreColor(score: number): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  if (score >= 4.8) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    };
  }
  if (score >= 4.2) {
    return {
      bg: "bg-teal-50",
      text: "text-teal-800",
      border: "border-teal-200",
      dot: "bg-teal-500",
    };
  }
  if (score >= 3.5) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    };
  }
  return {
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    dot: "bg-rose-500",
  };
}

export const BADGE_CONFIG: Record<
  string,
  { label: string; icon: string; bg: string; text: string; border: string; desc: string }
> = {
  Punctual: {
    label: "Punctual",
    icon: "⏰",
    bg: "bg-sky-50",
    text: "text-sky-800",
    border: "border-sky-200/80",
    desc: "Always on time for morning departures & transit",
  },
  Chill: {
    label: "Chill",
    icon: "🧘",
    bg: "bg-teal-50",
    text: "text-teal-800",
    border: "border-teal-200/80",
    desc: "Stress-free attitude, goes with the flow",
  },
  "Budget Maestro": {
    label: "Budget Maestro",
    icon: "💰",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200/80",
    desc: "Finds killer group deals & keeps Kitty strictly on track",
  },
  Photographer: {
    label: "Photographer",
    icon: "📸",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200/80",
    desc: "Takes stunning group portraits & drone shots",
  },
  "Navigation Pro": {
    label: "Navigation Pro",
    icon: "🧭",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200/80",
    desc: "Master of offline maps, trails & mountain shortcuts",
  },
  "Party Starter": {
    label: "Party Starter",
    icon: "🎉",
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-200/80",
    desc: "Brings the speaker, guitar vibes & campfire energy",
  },
  "Safety First": {
    label: "Safety First",
    icon: "🛡️",
    bg: "bg-cyan-50",
    text: "text-cyan-800",
    border: "border-cyan-200/80",
    desc: "Carries first aid, weather checks & emergency kit",
  },
  "Culinary Explorer": {
    label: "Culinary Explorer",
    icon: "🍜",
    bg: "bg-stone-100",
    text: "text-stone-800",
    border: "border-stone-300/80",
    desc: "Knows the hidden dhabas & authentic local food spots",
  },
  "Last-minute Canceler": {
    label: "Last-minute Canceler",
    icon: "⚠️",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200/80",
    desc: "Community flagged for past last-minute dropouts",
  },
};
