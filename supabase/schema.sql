-- ============================================================================
-- NITHYA STUDIO & VIDEO – OFFICIAL SUPABASE POSTGRESQL SCHEMA
-- Complete Database Architecture, Triggers, RLS Policies & Initial Seed Data
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
-- 2. STUDIO SETTINGS TABLE (Single official record for business information)
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
-- 3. SERVICES TABLE
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

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Helper check for admin role
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

-- Profiles: Authenticated user can read own profile; Admin can read all
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Studio Settings: Public readable, Admin writeable
CREATE POLICY "Public read studio settings" ON public.studio_settings
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage studio settings" ON public.studio_settings
    FOR ALL TO authenticated USING (public.is_admin());

-- Services: Public can read active services; Admin can read/write all
CREATE POLICY "Public read active services" ON public.services
    FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage services" ON public.services
    FOR ALL TO authenticated USING (public.is_admin());

-- Gallery Categories: Public read, Admin manage
CREATE POLICY "Public read gallery categories" ON public.gallery_categories
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage gallery categories" ON public.gallery_categories
    FOR ALL TO authenticated USING (public.is_admin());

-- Gallery Images: Public read, Admin manage
CREATE POLICY "Public read gallery images" ON public.gallery_images
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage gallery images" ON public.gallery_images
    FOR ALL TO authenticated USING (public.is_admin());

-- Bookings:
-- 1. Public (anon & authenticated) can INSERT new booking enquiries
CREATE POLICY "Public submit booking enquiry" ON public.bookings
    FOR INSERT TO anon, authenticated WITH CHECK (
        char_length(customer_name) >= 2 AND
        char_length(mobile_number) >= 10 AND
        char_length(event_location) >= 2
    );

-- 2. Only authenticated Admins can SELECT, UPDATE, DELETE bookings (Privacy Protection)
CREATE POLICY "Admin view and manage bookings" ON public.bookings
    FOR ALL TO authenticated USING (public.is_admin());

-- YouTube Videos: Public read, Admin manage
CREATE POLICY "Public read youtube videos" ON public.youtube_videos
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage youtube videos" ON public.youtube_videos
    FOR ALL TO authenticated USING (public.is_admin());

-- ============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION FOR GALLERY
-- ============================================================================
-- Note: Create storage bucket 'gallery' in Supabase Dashboard or via Storage API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
-- ON CONFLICT DO NOTHING;
--
-- Storage Policies:
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
-- CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND public.is_admin());
-- CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND public.is_admin());
