-- =================================================================================
-- Karvaan: Seed Data
-- =================================================================================

-- Insert sample profiles
INSERT INTO public.profiles (id, full_name, bio, avatar_url, age, travel_style, budget_tier, vibe_score, reviews_count, badges)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Aarav Sharma', 'Mountain addict, amateur drone pilot & chai lover. Always up for high-altitude passes.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 25, 'Trekker', 'Budget', 4.9, 14, '{"Punctual": 12, "Chill": 14, "Budget Maestro": 9, "Photographer": 11, "Navigation Pro": 8}'::jsonb),
    ('22222222-2222-2222-2222-222222222222', 'Rhea Chakraborty', 'Solo backpacker turned group trip organizer. Obsessed with sunset viewpoints & local street food.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 24, 'Backpacker', 'Budget', 4.8, 19, '{"Chill": 18, "Budget Maestro": 16, "Party Starter": 14, "Photographer": 12}'::jsonb),
    ('33333333-3333-3333-3333-333333333333', 'Kabir Sen', 'Work from anywhere nomadic lifestyle. Looking for quiet beach cafes with fast Wi-Fi and surf breaks.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 28, 'Digital Nomad', 'Mid-range', 4.6, 8, '{"Punctual": 7, "Chill": 8, "Navigation Pro": 6}'::jsonb),
    ('44444444-4444-4444-4444-444444444444', 'Ananya Mehta', 'Architect seeking heritage trails, boutique homestays, and aesthetic cafes. Sticking to smart budgets!', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 26, 'Leisure', 'Mid-range', 4.9, 11, '{"Photographer": 10, "Punctual": 9, "Chill": 11, "Budget Maestro": 8}'::jsonb),
    ('55555555-5555-5555-5555-555555555555', 'Dev Malhotra', 'Roadtrips across the Western Ghats & Leh-Ladakh circuit. Playlist master and splitwise enforcer.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 27, 'Roadtripper', 'Budget', 4.7, 16, '{"Navigation Pro": 15, "Budget Maestro": 14, "Punctual": 12, "Chill": 13}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert sample trips
INSERT INTO public.trips (id, host_id, title, destination, description, cover_image, budget_per_person, total_budget, start_date, end_date, max_members, min_vibe_score, travel_style, status, itinerary_highlights)
VALUES
    (
        'aaaa1111-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111111',
        'Kasol & Kheerganga Stargazing Backpacking',
        'Parvati Valley, Himachal Pradesh',
        'A 5-day budget backpacking escapade through Parvati Valley! We will stay in cozy wooden hostels in Kasol, hike up to Kheerganga natural hot springs, camp under the Milky Way, and split transport and shared meals evenly.',
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
        6500.00,
        26000.00,
        CURRENT_DATE + INTERVAL '14 days',
        CURRENT_DATE + INTERVAL '19 days',
        4,
        4.2,
        'Backpacker',
        'open',
        ARRAY['Hostel Stay in Tosh', 'Kheerganga Hot Spring Trek', 'Milky Way Astro Photography', 'Cafe Hopping in Old Manali']
    ),
    (
        'aaaa2222-0000-0000-0000-000000000002',
        '22222222-2222-2222-2222-222222222222',
        'Gokarna Beach Trek & Coastal Cliff Camping',
        'Gokarna, Karnataka',
        'Skip crowded Goa! Let’s trek along the pristine 5 beaches of Gokarna (Kudle to Paradise Beach), rent scooties to explore secret waterfalls in Yana caves, and sleep in beachside shacks with guitar jams around the bonfire.',
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        4800.00,
        24000.00,
        CURRENT_DATE + INTERVAL '21 days',
        CURRENT_DATE + INTERVAL '25 days',
        5,
        4.0,
        'Trekker',
        'open',
        ARRAY['5-Beach Cliff Trail Hike', 'Paradise Beach Shack Camping', 'Yana Rock Formations Cave Exploration', 'Sunset Bioluminescence Search']
    ),
    (
        'aaaa3333-0000-0000-0000-000000000003',
        '44444444-4444-4444-4444-444444444444',
        'Spiti Valley Winter Whiteout Expedition',
        'Spiti Valley, Himachal Pradesh',
        'An epic 4x4 expedition through high Himalayan snow passes. Visiting Key Monastery, the world’s highest post office at Hikkim, Kaza homestays with heating bukharis, and chasing the frozen Chandratal.',
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
        18500.00,
        111000.00,
        CURRENT_DATE + INTERVAL '30 days',
        CURRENT_DATE + INTERVAL '38 days',
        6,
        4.5,
        'Roadtripper',
        'open',
        ARRAY['Key Gompa Buddhist Retreat', 'Highest Post Office Hikkim postcard sending', '4x4 Snow Drifts Driving', 'Local Spitian Homestay Culture']
    ),
    (
        'aaaa4444-0000-0000-0000-000000000004',
        '55555555-5555-5555-5555-555555555555',
        'Meghalaya Living Root Bridges & Clear Waters',
        'Cherrapunji & Dawki, Meghalaya',
        'Explore the mystical caves of Meghalaya, hike 3500 steps down to the Double Decker Root Bridge, kayak in the crystal-clear glass waters of Umngot River at Dawki, and cliff jump in Krang Shuri.',
        'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=1200&q=80',
        11500.00,
        46000.00,
        CURRENT_DATE + INTERVAL '45 days',
        CURRENT_DATE + INTERVAL '51 days',
        4,
        4.3,
        'Trekker',
        'open',
        ARRAY['Double Decker Living Root Bridge', 'Dawki Umngot River Boat Cruise', 'Nohkalikai Falls Viewpoint', 'Mawsmai Limestone Caves']
    )
ON CONFLICT (id) DO NOTHING;

-- Insert existing trip members
INSERT INTO public.trip_members (trip_id, user_id, role)
VALUES
    ('aaaa1111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'host'),
    ('aaaa1111-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'member'),
    ('aaaa2222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'host'),
    ('aaaa2222-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'member'),
    ('aaaa2222-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'member'),
    ('aaaa3333-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'host'),
    ('aaaa3333-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'member'),
    ('aaaa4444-0000-0000-0000-000000000004', '55555555-5555-5555-5555-555555555555', 'host')
ON CONFLICT (trip_id, user_id) DO NOTHING;

-- Insert reviews
INSERT INTO public.trip_reviews (trip_id, reviewer_id, reviewee_id, rating, tags, comment)
VALUES
    ('aaaa1111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 5, ARRAY['Punctual', 'Chill', 'Photographer'], 'Ananya took breathtaking photos of everyone and was always on time for the morning treks!'),
    ('aaaa1111-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 5, ARRAY['Budget Maestro', 'Navigation Pro', 'Chill'], 'Aarav managed the group kitty brilliantly. Zero budget overshoots and found the best local homestay.')
ON CONFLICT (trip_id, reviewer_id, reviewee_id) DO NOTHING;
