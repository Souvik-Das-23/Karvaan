export type TravelStyle =
  | 'Backpacker'
  | 'Trekker'
  | 'Leisure'
  | 'Roadtripper'
  | 'Digital Nomad'
  | 'Luxury Seeker';

export type BudgetTier = 'Budget' | 'Mid-range' | 'Luxury';

export type TripStatus = 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';

export type SwipeDirection = 'like' | 'pass';

export type SwipeStatus = 'pending' | 'accepted' | 'rejected';

export type MemberRole = 'host' | 'member';

export type VibeBadgeName =
  | 'Punctual'
  | 'Chill'
  | 'Budget Maestro'
  | 'Photographer'
  | 'Navigation Pro'
  | 'Party Starter'
  | 'Last-minute Canceler'
  | 'Safety First'
  | 'Culinary Explorer';

export interface Profile {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  age: number;
  travel_style: TravelStyle;
  budget_tier: BudgetTier;
  vibe_score: number;
  reviews_count: number;
  badges: Record<string, number>;
  created_at?: string;
  updated_at?: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  profile?: Profile;
}

export interface Trip {
  id: string;
  host_id: string;
  host?: Profile;
  title: string;
  destination: string;
  description: string;
  cover_image: string;
  budget_per_person: number;
  total_budget: number;
  start_date: string;
  end_date: string;
  max_members: number;
  min_vibe_score: number;
  travel_style: TravelStyle;
  status: TripStatus;
  itinerary_highlights: string[];
  members?: TripMember[];
  created_at?: string;
}

export interface TripSwipe {
  id: string;
  trip_id: string;
  user_id: string;
  swipe_direction: SwipeDirection;
  status: SwipeStatus;
  created_at: string;
  user?: Profile;
  trip?: Trip;
}

export interface TripReview {
  id: string;
  trip_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  tags: string[];
  comment: string;
  created_at: string;
  reviewer?: Profile;
  reviewee?: Profile;
  trip?: Trip;
}
