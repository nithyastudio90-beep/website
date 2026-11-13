-- ============================================================================
-- NITHYA STUDIO & VIDEO – COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- ============================================================================
-- Copy and paste this ENTIRE script into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/bbdfewknrwiurrioojll/sql/new
-- Click "RUN" to create all tables, security policies, and initial studio data.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ADMINS / PROFILES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT DEFAULT 'Studio Administrator',
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. STUDIO SETTINGS TABLE (Official verified business details)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.studio_settings (
    id TEXT PRIMARY KEY DEFAULT 'nithya-studio-official',
    business_name TEXT NOT NULL DEFAULT 'Nithya Studio & Video',
    address_line1 TEXT NOT NULL DEFAULT '99, Karapattu Village and Post',
    address_line2 TEXT NOT NULL DEFAULT 'Uthangarai Taluk',
    village_post TEXT NOT NULL DEFAULT 'Karapattu',
    taluk TEXT NOT NULL DEFAULT 'Uthangarai',
    district_state TEXT NOT NULL DEFAULT 'Tamil Nadu',
    pincode TEXT NOT NULL DEFAULT '635306',
    country TEXT NOT NULL DEFAULT 'India',
    full_address TEXT NOT NULL DEFAULT '99, Karapattu Village and Post, Uthangarai Taluk, Karapattu, Tamil Nadu – 635306, India.',
    phone TEXT NOT NULL DEFAULT '+91 84891 28362',
    whatsapp TEXT NOT NULL DEFAULT '+91 84891 28362',
    email TEXT NOT NULL DEFAULT 'nithyastudio90@gmail.com',
    instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/nithyastudiokpt/',
    youtube_url TEXT NOT NULL DEFAULT 'https://www.youtube.com/@nithyastudiokpt',
    maps_url TEXT DEFAULT 'https://maps.google.com/?q=Karapattu+Uthangarai+Tamil+Nadu+635306',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. SERVICES TABLE (All 9 official services)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    image_url TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);

-- ----------------------------------------------------------------------------
-- 4. GALLERY CATEGORIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_gallery_categories_slug ON public.gallery_categories(slug);

-- ----------------------------------------------------------------------------
-- 5. GALLERY IMAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category_id TEXT REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
    category_slug TEXT NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    alt_text TEXT,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images(category_slug);
CREATE INDEX IF NOT EXISTS idx_gallery_images_featured ON public.gallery_images(is_featured);

-- ----------------------------------------------------------------------------
-- 6. BOOKINGS TABLE (Customer Enquiries)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_location TEXT NOT NULL,
    additional_message TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- ----------------------------------------------------------------------------
-- 7. YOUTUBE VIDEOS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Studio Settings Policies
DROP POLICY IF EXISTS "Public read studio settings" ON public.studio_settings;
CREATE POLICY "Public read studio settings" ON public.studio_settings
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage studio settings" ON public.studio_settings;
CREATE POLICY "Admin manage studio settings" ON public.studio_settings
    FOR ALL TO authenticated USING (public.is_admin());

-- Services Policies
DROP POLICY IF EXISTS "Public read active services" ON public.services;
CREATE POLICY "Public read active services" ON public.services
    FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage services" ON public.services;
CREATE POLICY "Admin manage services" ON public.services
    FOR ALL TO authenticated USING (public.is_admin());

-- Gallery Categories Policies
DROP POLICY IF EXISTS "Public read gallery categories" ON public.gallery_categories;
CREATE POLICY "Public read gallery categories" ON public.gallery_categories
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage gallery categories" ON public.gallery_categories;
CREATE POLICY "Admin manage gallery categories" ON public.gallery_categories
    FOR ALL TO authenticated USING (public.is_admin());

-- Gallery Images Policies
DROP POLICY IF EXISTS "Public read gallery images" ON public.gallery_images;
CREATE POLICY "Public read gallery images" ON public.gallery_images
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage gallery images" ON public.gallery_images;
CREATE POLICY "Admin manage gallery images" ON public.gallery_images
    FOR ALL TO authenticated USING (public.is_admin());

-- Bookings Policies (Public can insert enquiries; Admins manage)
DROP POLICY IF EXISTS "Public submit booking enquiry" ON public.bookings;
CREATE POLICY "Public submit booking enquiry" ON public.bookings
    FOR INSERT TO anon, authenticated WITH CHECK (
        char_length(customer_name) >= 2 AND
        char_length(mobile_number) >= 10 AND
        char_length(event_location) >= 2
    );

DROP POLICY IF EXISTS "Admin view and manage bookings" ON public.bookings;
CREATE POLICY "Admin view and manage bookings" ON public.bookings
    FOR ALL TO authenticated USING (public.is_admin());

-- YouTube Videos Policies
DROP POLICY IF EXISTS "Public read youtube videos" ON public.youtube_videos;
CREATE POLICY "Public read youtube videos" ON public.youtube_videos
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin manage youtube videos" ON public.youtube_videos;
CREATE POLICY "Admin manage youtube videos" ON public.youtube_videos
    FOR ALL TO authenticated USING (public.is_admin());

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

-- 1. Studio Settings
INSERT INTO public.studio_settings (
    id, business_name, address_line1, address_line2, village_post, taluk, district_state, pincode, country,
    full_address, phone, whatsapp, email, instagram_url, youtube_url, maps_url
) VALUES (
    'nithya-studio-official',
    'Nithya Studio & Video',
    '99, Karapattu Village and Post',
    'Uthangarai Taluk',
    'Karapattu',
    'Uthangarai',
    'Tamil Nadu',
    '635306',
    'India',
    '99, Karapattu Village and Post, Uthangarai Taluk, Karapattu, Tamil Nadu – 635306, India.',
    '+91 84891 28362',
    '+91 84891 28362',
    'nithyastudio90@gmail.com',
    'https://www.instagram.com/nithyastudiokpt/',
    'https://www.youtube.com/@nithyastudiokpt',
    'https://maps.google.com/?q=Karapattu+Uthangarai+Tamil+Nadu+635306'
) ON CONFLICT (id) DO UPDATE SET
    business_name = EXCLUDED.business_name,
    full_address = EXCLUDED.full_address,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp,
    email = EXCLUDED.email,
    instagram_url = EXCLUDED.instagram_url,
    youtube_url = EXCLUDED.youtube_url;

-- 2. All 9 Official Services
INSERT INTO public.services (id, title, slug, short_description, full_description, image_url, is_active, display_order)
VALUES
('srv-1', 'Wedding Photography', 'wedding-photography', 'Timeless, candid, and traditional wedding photography capturing the raw emotions, rituals, and sacred bonds of your auspicious day.', 'Our wedding photography blends authentic emotional photojournalism with regal traditional portraits. From haldi and sangeet to sacred muhurtham and reception, we capture every sacred gesture and radiant smile.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', true, 1),
('srv-2', 'Wedding Videography', 'wedding-videography', 'Cinematic storytelling films, highlight reels, and traditional multi-cam video capture with pristine audio and 4K clarity.', 'We turn your wedding into a cinematic masterpiece. Utilizing 4K cinema cameras, gimbal stabilization, and crystal-clear audio recording, our team crafts poignant teaser trailers and emotional highlight films.', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', true, 2),
('srv-3', 'Pre-Wedding Photography', 'pre-wedding-photography', 'Artistic, romantic outdoor and destination couple shoots that celebrate your unique love story before the wedding celebrations.', 'Celebrate the chemistry and romance between you and your partner in stunning natural landscapes, historic locations, or scenic backdrops across Tamil Nadu.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', true, 3),
('srv-4', 'Birthday Photography', 'birthday-photography', 'Vibrant celebration coverage capturing joyous laughter, cake-cutting milestones, games, and memories with loved ones.', 'From 1st birthday milestones to grand 60th Sashti Apthapoorthi celebrations, we capture the warmth, decorations, laughter, and candid moments that make family birthdays unforgettable.', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80', true, 4),
('srv-5', 'Baby Photography', 'baby-photography', 'Gentle, heartwarming newborn and toddler portraits preserving innocence, tiny toes, and pure developmental milestones.', 'Tender newborn and toddler sessions handled with the highest safety, patience, and warmth. We capture authentic expressions, tiny details, and loving parent-baby bonds.', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80', true, 5),
('srv-6', 'Photo Editing', 'photo-editing', 'Professional color grading, retouching, restoration of vintage family photos, and flawless digital image enhancement.', 'Our digital imaging specialists handle skin retouching, color correction, background manipulation, and restoration of cherished antique photos.', 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80', true, 6),
('srv-7', 'Passport Photos', 'passport-photos', 'Instant, compliant biometric passport, visa, and ID photos formatted to international and domestic government standards.', 'Quick, high-clarity passport and visa photographs meeting all official sizing guidelines for Indian passports, Schengen, US, UK, Gulf visas, and student exams.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80', true, 7),
('srv-8', 'Photo Frames & Albums', 'photo-frames-albums', 'Premium handcrafted leatherette and acrylic photo albums, custom wooden framing, and long-lasting canvas wall art.', 'Transform digital memories into timeless physical treasures. We craft custom flush-mount wedding albums, crystal acrylic covers, metallic finish pages, and custom wall frames.', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80', true, 8),
('srv-9', 'Drone Photography', 'drone-photography', 'Breathtaking 4K aerial drone photography and sweeping video perspectives for weddings, outdoor events, and landscapes.', 'Add an extraordinary cinematic dimension to your wedding or grand event with high-definition aerial footage operated by skilled aerial cinematographers.', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80', true, 9)
ON CONFLICT (slug) DO NOTHING;

-- 3. Gallery Categories
INSERT INTO public.gallery_categories (id, name, slug, display_order)
VALUES
('cat-wedding', 'Wedding Photography', 'wedding-photography', 1),
('cat-pre-wedding', 'Pre-Wedding', 'pre-wedding', 2),
('cat-birthday', 'Birthday Photography', 'birthday-photography', 3),
('cat-baby', 'Baby Photography', 'baby-photography', 4),
('cat-video', 'Wedding Videography', 'wedding-videography', 5),
('cat-albums', 'Albums & Photo Frames', 'albums-photo-frames', 6)
ON CONFLICT (slug) DO NOTHING;

-- 4. YouTube Videos
INSERT INTO public.youtube_videos (id, title, video_url, youtube_id, description, is_featured, display_order)
VALUES
('yt-1', 'Traditional Tamil Wedding Highlights | Nithya Studio', 'https://www.youtube.com/@nithyastudiokpt', 'dQw4w9WgXcQ', 'A celebration of love, heritage, and rituals in 4K cinema by Nithya Studio & Video.', true, 1),
('yt-2', 'Cinematic Pre-Wedding Teaser | Karapattu & Krishnagiri Sceneries', 'https://www.youtube.com/@nithyastudiokpt', 'LXb3EKWsInQ', 'Romantic golden hour visual poem featuring countryside serenity.', true, 2)
ON CONFLICT DO NOTHING;
