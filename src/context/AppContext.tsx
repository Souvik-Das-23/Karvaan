'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Profile, Trip, TripSwipe, TripReview, SwipeDirection, SwipeStatus } from '@/lib/types';
import { MOCK_PROFILES, MOCK_TRIPS, MOCK_SWIPES, MOCK_REVIEWS } from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

interface AppContextType {
  currentUser: Profile;
  setCurrentUser: (user: Profile) => void;
  allUsers: Profile[];
  trips: Trip[];
  swipes: TripSwipe[];
  reviews: TripReview[];
  isLoading: boolean;
  isLiveSupabase: boolean;
  swipeTrip: (tripId: string, direction: SwipeDirection) => Promise<void>;
  createTrip: (tripData: Omit<Trip, 'id' | 'host_id' | 'host' | 'created_at' | 'members'>) => Promise<Trip>;
  updateSwipeStatus: (swipeId: string, status: SwipeStatus) => Promise<void>;
  submitReview: (
    tripId: string,
    revieweeId: string,
    rating: number,
    tags: string[],
    comment: string
  ) => Promise<void>;
  getTripById: (tripId: string) => Trip | undefined;
  getUserById: (userId: string) => Profile | undefined;
  getIncomingRequestsForHost: () => TripSwipe[];
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'wandermatch_current_user_v1',
  PROFILES: 'wandermatch_profiles_v1',
  TRIPS: 'wandermatch_trips_v1',
  SWIPES: 'wandermatch_swipes_v1',
  REVIEWS: 'wandermatch_reviews_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<Profile>(MOCK_PROFILES[0]);
  const [allUsers, setAllUsers] = useState<Profile[]>(MOCK_PROFILES);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [swipes, setSwipes] = useState<TripSwipe[]>(MOCK_SWIPES);
  const [reviews, setReviews] = useState<TripReview[]>(MOCK_REVIEWS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from LocalStorage or Supabase
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          // Fetch from Supabase
          const { data: profilesData } = await supabase.from('profiles').select('*');
          const { data: tripsData } = await supabase
            .from('trips')
            .select(`
              *,
              host:profiles!host_id(*),
              members:trip_members(
                *,
                profile:profiles(*)
              )
            `);
          const { data: swipesData } = await supabase
            .from('trip_swipes')
            .select(`*, user:profiles(*), trip:trips(*)`);
          const { data: reviewsData } = await supabase
            .from('trip_reviews')
            .select(`*, reviewer:profiles!reviewer_id(*), reviewee:profiles!reviewee_id(*)`);

          if (profilesData && profilesData.length > 0) {
            setAllUsers(profilesData);
            setCurrentUserState(profilesData[0]);
          }
          if (tripsData && tripsData.length > 0) {
            setTrips(tripsData);
          }
          if (swipesData) {
            setSwipes(swipesData);
          }
          if (reviewsData) {
            setReviews(reviewsData);
          }
        } else {
          // Load from LocalStorage or fallback to Mock
          const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
          const savedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
          const savedTrips = localStorage.getItem(STORAGE_KEYS.TRIPS);
          const savedSwipes = localStorage.getItem(STORAGE_KEYS.SWIPES);
          const savedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);

          if (savedProfiles) setAllUsers(JSON.parse(savedProfiles));
          if (savedTrips) setTrips(JSON.parse(savedTrips));
          if (savedSwipes) setSwipes(JSON.parse(savedSwipes));
          if (savedReviews) setReviews(JSON.parse(savedReviews));
          if (savedUser) {
            setCurrentUserState(JSON.parse(savedUser));
          } else {
            setCurrentUserState(MOCK_PROFILES[0]);
          }
        }
      } catch (err) {
        console.error('Failed to initialize app data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Sync to local storage when in mock mode
  useEffect(() => {
    if (!isSupabaseConfigured && !isLoading) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(allUsers));
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
      localStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify(swipes));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    }
  }, [currentUser, allUsers, trips, swipes, reviews, isLoading]);

  const setCurrentUser = useCallback((user: Profile) => {
    setCurrentUserState(user);
    if (!isSupabaseConfigured) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  }, []);

  // Swipe Action
  const swipeTrip = useCallback(
    async (tripId: string, direction: SwipeDirection) => {
      const newSwipe: TripSwipe = {
        id: `swipe-${Date.now()}`,
        trip_id: tripId,
        user_id: currentUser.id,
        swipe_direction: direction,
        status: direction === 'like' ? 'pending' : 'rejected',
        created_at: new Date().toISOString(),
        user: currentUser,
        trip: trips.find((t) => t.id === tripId),
      };

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('trip_swipes').upsert({
            trip_id: tripId,
            user_id: currentUser.id,
            swipe_direction: direction,
            status: direction === 'like' ? 'pending' : 'rejected',
          });
        } catch (error) {
          console.error('Supabase swipe error:', error);
        }
      }

      setSwipes((prev) => {
        const filtered = prev.filter(
          (s) => !(s.trip_id === tripId && s.user_id === currentUser.id)
        );
        return [...filtered, newSwipe];
      });
    },
    [currentUser, trips]
  );

  // Create Trip Action
  const createTrip = useCallback(
    async (tripData: Omit<Trip, 'id' | 'host_id' | 'host' | 'created_at' | 'members'>): Promise<Trip> => {
      const newTripId = `trip-${Date.now()}`;
      const newTrip: Trip = {
        ...tripData,
        id: newTripId,
        host_id: currentUser.id,
        host: currentUser,
        created_at: new Date().toISOString(),
        status: 'open',
        members: [
          {
            id: `tm-${Date.now()}`,
            trip_id: newTripId,
            user_id: currentUser.id,
            role: 'host',
            joined_at: new Date().toISOString(),
            profile: currentUser,
          },
        ],
      };

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('trips')
            .insert({
              host_id: currentUser.id,
              title: tripData.title,
              destination: tripData.destination,
              description: tripData.description,
              cover_image: tripData.cover_image,
              budget_per_person: tripData.budget_per_person,
              total_budget: tripData.total_budget,
              start_date: tripData.start_date,
              end_date: tripData.end_date,
              max_members: tripData.max_members,
              min_vibe_score: tripData.min_vibe_score,
              travel_style: tripData.travel_style,
              itinerary_highlights: tripData.itinerary_highlights,
            })
            .select()
            .single();

          if (data && !error) {
            newTrip.id = data.id;
          }
        } catch (error) {
          console.error('Supabase create trip error:', error);
        }
      }

      setTrips((prev) => [newTrip, ...prev]);
      return newTrip;
    },
    [currentUser]
  );

  // Update Swipe Status (Accept / Reject join request)
  const updateSwipeStatus = useCallback(
    async (swipeId: string, status: SwipeStatus) => {
      const targetSwipe = swipes.find((s) => s.id === swipeId);
      if (!targetSwipe) return;

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('trip_swipes')
            .update({ status })
            .eq('id', swipeId);
        } catch (error) {
          console.error('Supabase update swipe status error:', error);
        }
      }

      // Update swipe state
      setSwipes((prev) =>
        prev.map((s) => (s.id === swipeId ? { ...s, status } : s))
      );

      // If accepted, add applicant to trip members and check if full
      if (status === 'accepted') {
        const applicant = allUsers.find((u) => u.id === targetSwipe.user_id) || targetSwipe.user;
        
        setTrips((prevTrips) =>
          prevTrips.map((trip) => {
            if (trip.id === targetSwipe.trip_id) {
              const currentMembers = trip.members || [];
              // Prevent duplicate join
              if (currentMembers.some((m) => m.user_id === targetSwipe.user_id)) {
                return trip;
              }

              const newMember = {
                id: `tm-${Date.now()}`,
                trip_id: trip.id,
                user_id: targetSwipe.user_id,
                role: 'member' as const,
                joined_at: new Date().toISOString(),
                profile: applicant,
              };

              const updatedMembers = [...currentMembers, newMember];
              const isNowFull = updatedMembers.length >= trip.max_members;

              return {
                ...trip,
                members: updatedMembers,
                status: isNowFull ? 'full' : trip.status,
              };
            }
            return trip;
          })
        );
      }
    },
    [swipes, allUsers]
  );

  // Submit Mutual Review & Update Vibe Score
  const submitReview = useCallback(
    async (
      tripId: string,
      revieweeId: string,
      rating: number,
      tags: string[],
      comment: string
    ) => {
      const targetTrip = trips.find((t) => t.id === tripId);
      const targetReviewee = allUsers.find((u) => u.id === revieweeId);

      const newReview: TripReview = {
        id: `rev-${Date.now()}`,
        trip_id: tripId,
        reviewer_id: currentUser.id,
        reviewee_id: revieweeId,
        rating,
        tags,
        comment,
        created_at: new Date().toISOString(),
        reviewer: currentUser,
        reviewee: targetReviewee,
        trip: targetTrip,
      };

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('trip_reviews').insert({
            trip_id: tripId,
            reviewer_id: currentUser.id,
            reviewee_id: revieweeId,
            rating,
            tags,
            comment,
          });
        } catch (error) {
          console.error('Supabase review insert error:', error);
        }
      }

      setReviews((prev) => [newReview, ...prev]);

      // Recalculate reviewee's vibe score and badges in state
      setAllUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === revieweeId) {
            const userPastReviews = reviews.filter((r) => r.reviewee_id === revieweeId);
            const allRatings = [...userPastReviews.map((r) => r.rating), rating];
            const newVibeScore =
              Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 100) / 100;

            const updatedBadges = { ...(user.badges || {}) };
            tags.forEach((tag) => {
              updatedBadges[tag] = (updatedBadges[tag] || 0) + 1;
            });

            const updatedUser = {
              ...user,
              vibe_score: newVibeScore,
              reviews_count: (user.reviews_count || 0) + 1,
              badges: updatedBadges,
            };

            // If updating current user's profile
            if (currentUser.id === revieweeId) {
              setCurrentUserState(updatedUser);
            }

            return updatedUser;
          }
          return user;
        })
      );
    },
    [trips, allUsers, reviews, currentUser]
  );

  const getTripById = useCallback(
    (tripId: string) => trips.find((t) => t.id === tripId),
    [trips]
  );

  const getUserById = useCallback(
    (userId: string) => allUsers.find((u) => u.id === userId),
    [allUsers]
  );

  // Incoming join requests for trips where currentUser is host
  const getIncomingRequestsForHost = useCallback(() => {
    const hostedTripIds = trips
      .filter((t) => t.host_id === currentUser.id)
      .map((t) => t.id);

    return swipes.filter(
      (s) =>
        hostedTripIds.includes(s.trip_id) &&
        s.swipe_direction === 'like' &&
        s.user_id !== currentUser.id
    );
  }, [trips, swipes, currentUser]);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.TRIPS);
    localStorage.removeItem(STORAGE_KEYS.SWIPES);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);

    setCurrentUserState(MOCK_PROFILES[0]);
    setAllUsers(MOCK_PROFILES);
    setTrips(MOCK_TRIPS);
    setSwipes(MOCK_SWIPES);
    setReviews(MOCK_REVIEWS);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers,
        trips,
        swipes,
        reviews,
        isLoading,
        isLiveSupabase: isSupabaseConfigured,
        swipeTrip,
        createTrip,
        updateSwipeStatus,
        submitReview,
        getTripById,
        getUserById,
        getIncomingRequestsForHost,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
