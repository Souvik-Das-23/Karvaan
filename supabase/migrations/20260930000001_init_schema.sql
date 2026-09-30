-- =================================================================================
-- Karvaan: Tinder for Group Travel Budgeting
-- Complete PostgreSQL / Supabase Schema with RLS, Constraints, and Vibe Score Triggers
-- =================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- Stores traveler profiles, bio, travel preferences, and dynamic aggregate Vibe Score
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    bio TEXT DEFAULT 'Ready for the next adventure 🎒✈️',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    age INTEGER CHECK (age >= 18 AND age <= 100),
    travel_style TEXT NOT NULL DEFAULT 'Backpacker' 
        CHECK (travel_style IN ('Backpacker', 'Trekker', 'Leisure', 'Roadtripper', 'Digital Nomad', 'Luxury Seeker')),
    budget_tier TEXT NOT NULL DEFAULT 'Budget' 
        CHECK (budget_tier IN ('Budget', 'Mid-range', 'Luxury')),
    vibe_score NUMERIC(3, 2) NOT NULL DEFAULT 5.00 
        CHECK (vibe_score >= 1.00 AND vibe_score <= 5.00),
    reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
    badges JSONB NOT NULL DEFAULT '{
        "Punctual": 0,
        "Chill": 0,
        "Budget Maestro": 0,
        "Photographer": 0,
        "Navigation Pro": 0,
        "Party Starter": 0,
        "Last-minute Canceler": 0
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 2. TRIPS TABLE
-- Trips hosted by users with destination, budget per person, dates, and vibe requirements
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    budget_per_person NUMERIC(10, 2) NOT NULL CHECK (budget_per_person >= 0),
    total_budget NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_budget >= 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_members INTEGER NOT NULL DEFAULT 4 CHECK (max_members >= 2 AND max_members <= 30),
    min_vibe_score NUMERIC(3, 2) NOT NULL DEFAULT 3.00 CHECK (min_vibe_score >= 1.00 AND min_vibe_score <= 5.00),
    travel_style TEXT NOT NULL DEFAULT 'Backpacker'
        CHECK (travel_style IN ('Backpacker', 'Trekker', 'Leisure', 'Roadtripper', 'Digital Nomad', 'Luxury Seeker')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'in_progress', 'completed', 'cancelled')),
    itinerary_highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- 3. TRIP SWIPES TABLE
-- Captures swipe deck interactions (like/pass) and host decision status (pending/accepted/rejected)
CREATE TABLE IF NOT EXISTS public.trip_swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    swipe_direction TEXT NOT NULL CHECK (swipe_direction IN ('like', 'pass')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT unique_trip_user_swipe UNIQUE (trip_id, user_id)
);

-- 4. TRIP MEMBERS TABLE
-- Confirmed participants who form the travel squad
CREATE TABLE IF NOT EXISTS public.trip_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('host', 'member')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT unique_trip_member UNIQUE (trip_id, user_id)
);

-- 5. TRIP REVIEWS TABLE
-- Post-trip mutual ratings and community badge endorsements
CREATE TABLE IF NOT EXISTS public.trip_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT unique_mutual_review_per_trip UNIQUE (trip_id, reviewer_id, reviewee_id),
    CONSTRAINT cannot_review_self CHECK (reviewer_id <> reviewee_id)
);

-- =================================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================================
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_host_id ON public.trips(host_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON public.trips(start_date);
CREATE INDEX IF NOT EXISTS idx_trip_swipes_trip_user ON public.trip_swipes(trip_id, user_id);
CREATE INDEX IF NOT EXISTS idx_trip_swipes_status ON public.trip_swipes(trip_id, status);
CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON public.trip_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_user_id ON public.trip_members(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_reviews_reviewee ON public.trip_reviews(reviewee_id);

-- =================================================================================
-- TRIGGERS AND STORED PROCEDURES
-- =================================================================================

-- A. Auto-add host as confirmed member when a trip is created
CREATE OR REPLACE FUNCTION public.handle_new_trip_host()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.trip_members (trip_id, user_id, role)
    VALUES (NEW.id, NEW.host_id, 'host')
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_trip_created
    AFTER INSERT ON public.trips
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_trip_host();


-- B. Auto-join trip member when host accepts a swipe & check squad capacity
CREATE OR REPLACE FUNCTION public.handle_swipe_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_member_count INTEGER;
    v_max_members INTEGER;
BEGIN
    -- Only trigger when accepted
    IF NEW.status = 'accepted' AND (OLD.status IS DISTINCT FROM 'accepted') THEN
        -- Check current count
        SELECT COUNT(*) INTO v_member_count 
        FROM public.trip_members 
        WHERE trip_id = NEW.trip_id;

        SELECT max_members INTO v_max_members 
        FROM public.trips 
        WHERE id = NEW.trip_id;

        IF v_member_count >= v_max_members THEN
            RAISE EXCEPTION 'This trip squad is already at full capacity (%)', v_max_members;
        END IF;

        -- Insert into trip_members
        INSERT INTO public.trip_members (trip_id, user_id, role)
        VALUES (NEW.trip_id, NEW.user_id, 'member')
        ON CONFLICT (trip_id, user_id) DO NOTHING;

        -- Check if now full
        IF (v_member_count + 1) >= v_max_members THEN
            UPDATE public.trips 
            SET status = 'full' 
            WHERE id = NEW.trip_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_swipe_status_updated
    AFTER UPDATE OF status ON public.trip_swipes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_swipe_status_change();


-- C. Recalculate Vibe Score & Aggregate Badges after every review
CREATE OR REPLACE FUNCTION public.recalculate_user_vibe_score()
RETURNS TRIGGER AS $$
DECLARE
    v_avg_rating NUMERIC(3, 2);
    v_count INTEGER;
    v_badges JSONB;
    v_tag TEXT;
BEGIN
    -- Calculate new average rating and total review count
    SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 5.00), COUNT(*)
    INTO v_avg_rating, v_count
    FROM public.trip_reviews
    WHERE reviewee_id = NEW.reviewee_id;

    -- Aggregate all tags received by this user
    SELECT jsonb_object_agg(tag_name, tag_count)
    INTO v_badges
    FROM (
        SELECT unnest(tags) AS tag_name, COUNT(*)::int AS tag_count
        FROM public.trip_reviews
        WHERE reviewee_id = NEW.reviewee_id
        GROUP BY tag_name
    ) t;

    -- Merge with defaults
    IF v_badges IS NULL THEN
        v_badges := '{}'::jsonb;
    END IF;

    UPDATE public.profiles
    SET 
        vibe_score = v_avg_rating,
        reviews_count = v_count,
        badges = (
            '{
                "Punctual": 0,
                "Chill": 0,
                "Budget Maestro": 0,
                "Photographer": 0,
                "Navigation Pro": 0,
                "Party Starter": 0,
                "Last-minute Canceler": 0
            }'::jsonb || v_badges
        ),
        updated_at = TIMEZONE('utc', NOW())
    WHERE id = NEW.reviewee_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_created
    AFTER INSERT OR UPDATE ON public.trip_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.recalculate_user_vibe_score();


-- D. Profile creation trigger when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Traveler ' || substring(NEW.id::text, 1, 4)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id::text)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- =================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view; only owner can update
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trips: Anyone can view active trips; authenticated users can create; host can update/delete
CREATE POLICY "Trips are viewable by everyone" 
    ON public.trips FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create trips" 
    ON public.trips FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own trips" 
    ON public.trips FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own trips" 
    ON public.trips FOR DELETE USING (auth.uid() = host_id);

-- Trip Swipes: Users can view their own swipes or hosts can view swipes for their trips
CREATE POLICY "Users can view their own swipes" 
    ON public.trip_swipes FOR SELECT 
    USING (auth.uid() = user_id OR auth.uid() IN (SELECT host_id FROM public.trips WHERE id = trip_swipes.trip_id));

CREATE POLICY "Users can insert their own swipes" 
    ON public.trip_swipes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Hosts can update swipe status for their trips" 
    ON public.trip_swipes FOR UPDATE 
    USING (auth.uid() IN (SELECT host_id FROM public.trips WHERE id = trip_swipes.trip_id));

-- Trip Members: Members viewable by all; host or auto-trigger can manage
CREATE POLICY "Trip members are viewable by everyone" 
    ON public.trip_members FOR SELECT USING (true);

CREATE POLICY "Hosts can insert members into their trips" 
    ON public.trip_members FOR INSERT 
    WITH CHECK (auth.uid() IN (SELECT host_id FROM public.trips WHERE id = trip_members.trip_id) OR auth.uid() = user_id);

-- Trip Reviews: Viewable by everyone; confirmed trip participants can review other participants
CREATE POLICY "Trip reviews are viewable by everyone" 
    ON public.trip_reviews FOR SELECT USING (true);

CREATE POLICY "Participants can insert reviews for co-travelers" 
    ON public.trip_reviews FOR INSERT 
    WITH CHECK (
        auth.uid() = reviewer_id 
        AND EXISTS (
            SELECT 1 FROM public.trip_members tm1
            JOIN public.trip_members tm2 ON tm1.trip_id = tm2.trip_id
            WHERE tm1.trip_id = trip_reviews.trip_id
              AND tm1.user_id = trip_reviews.reviewer_id
              AND tm2.user_id = trip_reviews.reviewee_id
        )
    );
