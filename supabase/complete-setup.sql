-- ============================================================================
-- NITHYA STUDIO & VIDEO — COMPLETE DIGITAL STUDIO MANAGEMENT PLATFORM SCHEMA
-- Target Database: Supabase PostgreSQL (Cloud Schema)
-- Project: bbdfewknrwiurrioojll.supabase.co
-- Official Location: 99, Karapattu Village & Post, Uthangarai Taluk, TN - 635306
-- ============================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ADMIN PROFILES TABLE (Linked to auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Studio Administrator',
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE OR REPLACE VIEW public.profiles AS SELECT * FROM public.admin_profiles;

-- ============================================================================
-- 2. SITE SETTINGS TABLE (Official Studio Details & Branding)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'nithya-settings',
    business_name TEXT NOT NULL DEFAULT 'Nithya Studio & Video',
    phone TEXT NOT NULL DEFAULT '+91 84891 28362',
    whatsapp TEXT NOT NULL DEFAULT '+91 84891 28362',
    email TEXT NOT NULL DEFAULT 'nithyastudio90@gmail.com',
    full_address TEXT NOT NULL DEFAULT '99, Karapattu Village and Post, Uthangarai Taluk, Karapattu, Tamil Nadu – 635306, India',
    address_line1 TEXT NOT NULL DEFAULT '99, Karapattu Village and Post',
    address_line2 TEXT NOT NULL DEFAULT 'Uthangarai Taluk',
    village_post TEXT NOT NULL DEFAULT 'Karapattu',
    taluk TEXT NOT NULL DEFAULT 'Uthangarai',
    district_state TEXT NOT NULL DEFAULT 'Krishnagiri Dist, Tamil Nadu',
    pincode TEXT NOT NULL DEFAULT '635306',
    country TEXT NOT NULL DEFAULT 'India',
    instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/nithyastudiokpt/',
    youtube_url TEXT NOT NULL DEFAULT 'https://www.youtube.com/@nithyastudiokpt',
    business_hours TEXT NOT NULL DEFAULT 'Mon - Sun: 8:00 AM - 9:00 PM',
    seo_title TEXT NOT NULL DEFAULT 'Nithya Studio & Video | Luxury Wedding Photography & Cinematography',
    seo_description TEXT NOT NULL DEFAULT 'Premier destination for luxury wedding photography, 4K cinematic films, and heirloom albums in Karapattu, Uthangarai, and across Tamil Nadu.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE OR REPLACE VIEW public.studio_settings AS SELECT * FROM public.site_settings;

-- ============================================================================
-- 3. HOMEPAGE CONTENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id TEXT PRIMARY KEY DEFAULT 'nithya-home-content',
    hero_headline TEXT NOT NULL DEFAULT 'Capturing Eternal Moments, Crafting Legacies.',
    hero_subheadline TEXT NOT NULL DEFAULT 'From sacred traditional weddings and romantic pre-wedding stories to 4K cinematic films and heirloom albums. Based in Karapattu, serving Tamil Nadu with artistic devotion.',
    hero_background_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
    hero_cta_primary TEXT NOT NULL DEFAULT 'Explore Our Work',
    hero_cta_primary_link TEXT NOT NULL DEFAULT '/portfolio',
    hero_cta_secondary TEXT NOT NULL DEFAULT 'Book Your Session',
    hero_cta_secondary_link TEXT NOT NULL DEFAULT '/booking',
    featured_badge TEXT NOT NULL DEFAULT 'Premier Photography & Cinematography',
    stats_counters JSONB DEFAULT '[{"label": "Years of Heritage", "value": "15+"}, {"label": "Weddings Captured", "value": "500+"}, {"label": "Happy Families", "value": "1200+"}, {"label": "Cinema Quality", "value": "4K Ultra"}]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 4. ABOUT CONTENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.about_content (
    id TEXT PRIMARY KEY DEFAULT 'nithya-about-content',
    page_title TEXT NOT NULL DEFAULT 'About Nithya Studio & Video',
    page_subtitle TEXT NOT NULL DEFAULT 'Honoring heritage, sacred matrimonial rituals, and heartwarming familial celebrations with cinematic artistry in Karapattu, Tamil Nadu.',
    story_title TEXT NOT NULL DEFAULT 'Preserving Tamil Nadu''s Auspicious Moments with Dignity and Joy',
    story_paragraphs JSONB DEFAULT '["Established in Karapattu, Uthangarai Taluk, Nithya Studio & Video was born out of a genuine devotion to the art of visual storytelling. In South Indian weddings, rituals are not merely events—they are sacred transitions brimming with spiritual depth, ancestral blessings, and emotional bonds.", "From the fragrance of fresh jasmine and the rhythmic beats of the thavil to the quiet tears of parents during Kanyadaanam, our lens captures truth without intrusion.", "Over the years, we have grown alongside the families of Karapattu, Uthangarai, and surrounding districts of Tamil Nadu. We treat every assignment with reverence, combining top-tier cinema cameras, drones, and master color grading."]'::jsonb,
    experience_years TEXT NOT NULL DEFAULT '15+',
    weddings_covered TEXT NOT NULL DEFAULT '500+',
    main_image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    secondary_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 5. SERVICES TABLE (Dynamic & Unlimited Services)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    image_url TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    price NUMERIC(10, 2) DEFAULT 0.00,
    price_label TEXT DEFAULT 'Custom Quote',
    duration_minutes INTEGER DEFAULT 240,
    duration_label TEXT DEFAULT '4 - 8 Hours',
    capacity INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active);

-- ============================================================================
-- 6. SERVICE CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    description TEXT
);

-- ============================================================================
-- 7. PORTFOLIO CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_portfolio_categories_slug ON public.portfolio_categories(slug);
CREATE OR REPLACE VIEW public.gallery_categories AS SELECT * FROM public.portfolio_categories;

-- ============================================================================
-- 8. PORTFOLIO IMAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_images (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category_id TEXT REFERENCES public.portfolio_categories(id) ON DELETE SET NULL,
    category_slug TEXT NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    storage_path TEXT,
    google_drive_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    alt_text TEXT,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_portfolio_images_category ON public.portfolio_images(category_slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_featured ON public.portfolio_images(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_published ON public.portfolio_images(is_published);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_display_order ON public.portfolio_images(display_order);

CREATE OR REPLACE VIEW public.gallery_images AS SELECT * FROM public.portfolio_images;
CREATE OR REPLACE VIEW public.gallery AS SELECT * FROM public.portfolio_images;

-- ============================================================================
-- 9. CUSTOMERS TABLE (Studio CRM Directory)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    normalized_phone TEXT UNIQUE NOT NULL,
    mobile_number TEXT NOT NULL,
    whatsapp_number TEXT,
    email TEXT,
    address TEXT,
    total_bookings INTEGER DEFAULT 0 NOT NULL,
    confirmed_bookings INTEGER DEFAULT 0 NOT NULL,
    completed_bookings INTEGER DEFAULT 0 NOT NULL,
    rejected_bookings INTEGER DEFAULT 0 NOT NULL,
    cancelled_bookings INTEGER DEFAULT 0 NOT NULL,
    last_booking_date DATE,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(normalized_phone);

-- ============================================================================
-- 10. BOOKINGS TABLE (Customer Appointments & Enquiries)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    whatsapp_number TEXT,
    email TEXT,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_start_time TIME DEFAULT '09:00:00',
    event_end_time TIME DEFAULT '17:00:00',
    duration_hours INTEGER DEFAULT 8,
    event_location TEXT NOT NULL,
    additional_message TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled')),
    admin_notes TEXT,
    rejection_reason TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by TEXT,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejected_by TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);

-- ============================================================================
-- 11. BOOKING STATUS HISTORY TABLE (Permanent Audit Ledger)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    from_status TEXT NOT NULL,
    to_status TEXT NOT NULL,
    changed_by TEXT NOT NULL DEFAULT 'system',
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_booking_status_history_booking ON public.booking_status_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_status_history_created_at ON public.booking_status_history(created_at DESC);

-- ============================================================================
-- 12. BOOKING AVAILABILITY TABLE (Time Slot Lock Engine)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.booking_availability (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL DEFAULT '00:00:00',
    end_time TIME NOT NULL DEFAULT '23:59:59',
    is_full_day BOOLEAN DEFAULT TRUE NOT NULL,
    is_blocked BOOLEAN DEFAULT TRUE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_availability_date ON public.booking_availability(event_date);
CREATE INDEX IF NOT EXISTS idx_availability_blocked ON public.booking_availability(is_blocked);

-- ============================================================================
-- 13. CALENDAR EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL DEFAULT '09:00:00',
    end_time TIME NOT NULL DEFAULT '17:00:00',
    event_type TEXT NOT NULL DEFAULT 'Booking',
    status TEXT NOT NULL DEFAULT 'Confirmed',
    location TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON public.calendar_events(event_date);

-- ============================================================================
-- 14. CUSTOMER ENQUIRIES TABLE (Contact Us Form)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customer_enquiries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Resolved', 'Archived')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customer_enquiries_status ON public.customer_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_customer_enquiries_created_at ON public.customer_enquiries(created_at DESC);
CREATE OR REPLACE VIEW public.enquiries AS SELECT * FROM public.customer_enquiries;

-- ============================================================================
-- 15. TESTIMONIALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    location TEXT NOT NULL,
    event_date TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    avatar_url TEXT,
    is_featured BOOLEAN DEFAULT TRUE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON public.testimonials(display_order);

-- ============================================================================
-- 16. WEBSITE SECTIONS TABLE (Homepage Section Visibility Toggles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.website_sections (
    id TEXT PRIMARY KEY DEFAULT 'nithya-sections',
    show_hero BOOLEAN DEFAULT TRUE NOT NULL,
    show_about_overview BOOLEAN DEFAULT TRUE NOT NULL,
    show_services BOOLEAN DEFAULT TRUE NOT NULL,
    show_portfolio BOOLEAN DEFAULT TRUE NOT NULL,
    show_youtube BOOLEAN DEFAULT TRUE NOT NULL,
    show_instagram BOOLEAN DEFAULT TRUE NOT NULL,
    show_testimonials BOOLEAN DEFAULT TRUE NOT NULL,
    show_quick_contact BOOLEAN DEFAULT TRUE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 17. YOUTUBE VIDEOS TABLE
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_youtube_videos_order ON public.youtube_videos(display_order);

-- ============================================================================
-- 18. ACTIVITY LOGS TABLE (Administrative Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT,
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);

-- ============================================================================
-- 19. NOTIFICATION LOGS TABLE (WhatsApp Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_id TEXT,
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
    channel TEXT NOT NULL DEFAULT 'whatsapp',
    recipient TEXT NOT NULL,
    message_preview TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'prepared' CHECK (status IN ('prepared', 'sent', 'failed')),
    provider_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON public.notification_logs(created_at DESC);

-- ============================================================================
-- 20. AI SETTINGS TABLE (Google Gemini & Domain Assistant Configuration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ai_settings (
    id TEXT PRIMARY KEY DEFAULT 'nithya-ai-settings',
    is_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    assistant_name TEXT NOT NULL DEFAULT 'Nithya Studio Assistant',
    system_prompt TEXT NOT NULL DEFAULT 'You are the official AI assistant for Nithya Studio & Video, located in Karapattu Village, Uthangarai Taluk, Tamil Nadu (PIN: 635306). You warmly assist clients with wedding photography, candid video, albums, drone coverage, and studio appointments in Tamil and English.',
    welcome_message TEXT NOT NULL DEFAULT 'Vanakkam! Welcome to Nithya Studio & Video. How may I assist you with your wedding, photoshoot, or album booking today?',
    voice_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    model_name TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
    default_language TEXT NOT NULL DEFAULT 'en-IN',
    max_tokens INTEGER DEFAULT 500,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- ATOMIC POSTGRESQL FUNCTIONS & STORED PROCEDURES
-- ============================================================================

-- Function 1: Check Slot Availability
CREATE OR REPLACE FUNCTION public.check_slot_availability(
    p_event_date DATE,
    p_start_time TIME DEFAULT '00:00:00',
    p_end_time TIME DEFAULT '23:59:59'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_conflicts INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_conflicts
    FROM public.booking_availability ba
    WHERE ba.event_date = p_event_date
      AND ba.is_blocked = TRUE
      AND (
          (ba.start_time <= p_end_time AND ba.end_time >= p_start_time)
      );

    RETURN (v_conflicts = 0);
END;
$$;

-- Function 2: Atomically Confirm Booking & Lock Calendar Slot
CREATE OR REPLACE FUNCTION public.confirm_booking_atomic(
    p_booking_id TEXT,
    p_admin_id TEXT DEFAULT 'admin'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_booking RECORD;
    v_is_available BOOLEAN;
BEGIN
    -- Fetch booking
    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Booking record not found.');
    END IF;

    IF v_booking.status = 'Confirmed' THEN
        RETURN jsonb_build_object('success', TRUE, 'message', 'Booking is already confirmed.');
    END IF;

    -- Check availability atomically
    v_is_available := public.check_slot_availability(
        v_booking.event_date,
        v_booking.event_start_time,
        v_booking.event_end_time
    );

    IF NOT v_is_available THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'This date and time slot is already confirmed for another client.');
    END IF;

    -- Update booking
    UPDATE public.bookings
    SET status = 'Confirmed',
        confirmed_at = TIMEZONE('utc'::text, NOW()),
        confirmed_by = p_admin_id,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = p_booking_id;

    -- Record status history
    INSERT INTO public.booking_status_history (booking_id, from_status, to_status, changed_by, reason)
    VALUES (p_booking_id, v_booking.status, 'Confirmed', p_admin_id, 'Confirmed by administrator');

    -- Insert availability slot lock
    INSERT INTO public.booking_availability (
        booking_id, service_id, event_date, start_time, end_time, is_full_day, is_blocked, notes
    ) VALUES (
        p_booking_id, v_booking.service_id, v_booking.event_date,
        v_booking.event_start_time, v_booking.event_end_time, TRUE, TRUE,
        'Confirmed for ' || v_booking.customer_name
    )
    ON CONFLICT (booking_id) DO UPDATE
    SET is_blocked = TRUE, event_date = EXCLUDED.event_date;

    -- Insert calendar event
    INSERT INTO public.calendar_events (
        booking_id, title, event_date, start_time, end_time,
        event_type, status, location, customer_name, customer_phone
    ) VALUES (
        p_booking_id,
        v_booking.service_name || ' - ' || v_booking.customer_name,
        v_booking.event_date,
        v_booking.event_start_time,
        v_booking.event_end_time,
        'Booking',
        'Confirmed',
        v_booking.event_location,
        v_booking.customer_name,
        v_booking.mobile_number
    );

    -- Update customer CRM metrics if linked
    IF v_booking.customer_id IS NOT NULL THEN
        UPDATE public.customers
        SET confirmed_bookings = confirmed_bookings + 1,
            last_booking_date = v_booking.event_date,
            updated_at = TIMEZONE('utc'::text, NOW())
        WHERE id = v_booking.customer_id;
    END IF;

    -- Log activity
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (p_admin_id, 'CONFIRM_BOOKING', 'booking', p_booking_id, jsonb_build_object(
        'client', v_booking.customer_name,
        'date', v_booking.event_date,
        'service', v_booking.service_name
    ));

    RETURN jsonb_build_object('success', TRUE, 'booking_id', p_booking_id);
END;
$$;

-- Function 3: Atomically Reject Booking & Release Slot
CREATE OR REPLACE FUNCTION public.reject_booking_atomic(
    p_booking_id TEXT,
    p_admin_id TEXT DEFAULT 'admin',
    p_reason TEXT DEFAULT 'Schedule unavailable'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_booking RECORD;
BEGIN
    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Booking record not found.');
    END IF;

    -- Update booking
    UPDATE public.bookings
    SET status = 'Rejected',
        rejection_reason = p_reason,
        rejected_at = TIMEZONE('utc'::text, NOW()),
        rejected_by = p_admin_id,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = p_booking_id;

    -- Record status history
    INSERT INTO public.booking_status_history (booking_id, from_status, to_status, changed_by, reason)
    VALUES (p_booking_id, v_booking.status, 'Rejected', p_admin_id, p_reason);

    -- Release availability lock if existed
    DELETE FROM public.booking_availability WHERE booking_id = p_booking_id;
    DELETE FROM public.calendar_events WHERE booking_id = p_booking_id;

    -- Update customer CRM metrics if linked
    IF v_booking.customer_id IS NOT NULL THEN
        UPDATE public.customers
        SET rejected_bookings = rejected_bookings + 1,
            updated_at = TIMEZONE('utc'::text, NOW())
        WHERE id = v_booking.customer_id;
    END IF;

    -- Log activity
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (p_admin_id, 'REJECT_BOOKING', 'booking', p_booking_id, jsonb_build_object(
        'client', v_booking.customer_name,
        'reason', p_reason
    ));

    RETURN jsonb_build_object('success', TRUE, 'booking_id', p_booking_id);
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read homepage content" ON public.homepage_content;
CREATE POLICY "Public read homepage content" ON public.homepage_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read about content" ON public.about_content;
CREATE POLICY "Public read about content" ON public.about_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read active services" ON public.services;
CREATE POLICY "Public read active services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read categories" ON public.portfolio_categories;
CREATE POLICY "Public read categories" ON public.portfolio_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read published portfolio" ON public.portfolio_images;
CREATE POLICY "Public read published portfolio" ON public.portfolio_images FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public read published testimonials" ON public.testimonials;
CREATE POLICY "Public read published testimonials" ON public.testimonials FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public read website sections" ON public.website_sections;
CREATE POLICY "Public read website sections" ON public.website_sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read youtube videos" ON public.youtube_videos;
CREATE POLICY "Public read youtube videos" ON public.youtube_videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read availability" ON public.booking_availability;
CREATE POLICY "Public read availability" ON public.booking_availability FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read ai settings" ON public.ai_settings;
CREATE POLICY "Public read ai settings" ON public.ai_settings FOR SELECT USING (true);

-- 2. Public Insert Policies (Bookings & Enquiries)
DROP POLICY IF EXISTS "Public create bookings" ON public.bookings;
CREATE POLICY "Public create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public create customer enquiries" ON public.customer_enquiries;
CREATE POLICY "Public create customer enquiries" ON public.customer_enquiries FOR INSERT WITH CHECK (true);

-- 3. Admin Full Access Policies
DROP POLICY IF EXISTS "Admin manage admin profiles" ON public.admin_profiles;
CREATE POLICY "Admin manage admin profiles" ON public.admin_profiles FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage site settings" ON public.site_settings;
CREATE POLICY "Admin manage site settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage homepage content" ON public.homepage_content;
CREATE POLICY "Admin manage homepage content" ON public.homepage_content FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage about content" ON public.about_content;
CREATE POLICY "Admin manage about content" ON public.about_content FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage services" ON public.services;
CREATE POLICY "Admin manage services" ON public.services FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage portfolio categories" ON public.portfolio_categories;
CREATE POLICY "Admin manage portfolio categories" ON public.portfolio_categories FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage portfolio images" ON public.portfolio_images;
CREATE POLICY "Admin manage portfolio images" ON public.portfolio_images FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage customers" ON public.customers;
CREATE POLICY "Admin manage customers" ON public.customers FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage bookings" ON public.bookings;
CREATE POLICY "Admin manage bookings" ON public.bookings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage booking history" ON public.booking_status_history;
CREATE POLICY "Admin manage booking history" ON public.booking_status_history FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage availability" ON public.booking_availability;
CREATE POLICY "Admin manage availability" ON public.booking_availability FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage calendar events" ON public.calendar_events;
CREATE POLICY "Admin manage calendar events" ON public.calendar_events FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage enquiries" ON public.customer_enquiries;
CREATE POLICY "Admin manage enquiries" ON public.customer_enquiries FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage testimonials" ON public.testimonials;
CREATE POLICY "Admin manage testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage sections" ON public.website_sections;
CREATE POLICY "Admin manage sections" ON public.website_sections FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage youtube" ON public.youtube_videos;
CREATE POLICY "Admin manage youtube" ON public.youtube_videos FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage activity logs" ON public.activity_logs;
CREATE POLICY "Admin manage activity logs" ON public.activity_logs FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage notification logs" ON public.notification_logs;
CREATE POLICY "Admin manage notification logs" ON public.notification_logs FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin manage ai settings" ON public.ai_settings;
CREATE POLICY "Admin manage ai settings" ON public.ai_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION ('gallery')
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gallery',
    'gallery',
    TRUE,
    20971520, -- 20MB per image
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = TRUE,
    file_size_limit = 20971520,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

-- Storage bucket RLS policies
DROP POLICY IF EXISTS "Public view gallery bucket objects" ON storage.objects;
CREATE POLICY "Public view gallery bucket objects"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admin upload gallery bucket objects" ON storage.objects;
CREATE POLICY "Admin upload gallery bucket objects"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete gallery bucket objects" ON storage.objects;
CREATE POLICY "Admin delete gallery bucket objects"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update gallery bucket objects" ON storage.objects;
CREATE POLICY "Admin update gallery bucket objects"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA (Default Configurations & Services)
-- ============================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (id, business_name, phone, whatsapp, email, address_line1, address_line2, village_post, taluk, district_state, pincode, country)
VALUES ('nithya-settings', 'Nithya Studio & Video', '+91 84891 28362', '+91 84891 28362', 'nithyastudio90@gmail.com', '99, Karapattu Village and Post', 'Uthangarai Taluk', 'Karapattu', 'Uthangarai', 'Krishnagiri Dist, Tamil Nadu', '635306', 'India')
ON CONFLICT (id) DO NOTHING;

-- 2. Homepage Content
INSERT INTO public.homepage_content (id, hero_headline, hero_subheadline, hero_background_image, hero_cta_primary, hero_cta_secondary, featured_badge)
VALUES (
    'nithya-home-content',
    'Capturing Eternal Moments, Crafting Legacies.',
    'From sacred traditional weddings and romantic pre-wedding stories to 4K cinematic films and heirloom albums. Based in Karapattu, serving Tamil Nadu with artistic devotion.',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
    'Explore Our Work',
    'Book Your Session',
    'Premier Photography & Cinematography'
) ON CONFLICT (id) DO NOTHING;

-- 3. About Content
INSERT INTO public.about_content (id, page_title, page_subtitle, story_title, experience_years, weddings_covered, main_image_url)
VALUES (
    'nithya-about-content',
    'About Nithya Studio & Video',
    'Honoring heritage, sacred matrimonial rituals, and heartwarming familial celebrations with cinematic artistry in Karapattu, Tamil Nadu.',
    'Preserving Tamil Nadu''s Auspicious Moments with Dignity and Joy',
    '15+',
    '500+',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (id) DO NOTHING;

-- 4. Website Sections Toggles
INSERT INTO public.website_sections (id, show_hero, show_about_overview, show_services, show_portfolio, show_youtube, show_instagram, show_testimonials, show_quick_contact)
VALUES ('nithya-sections', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. AI Settings
INSERT INTO public.ai_settings (id, is_enabled, assistant_name, welcome_message)
VALUES ('nithya-ai-settings', TRUE, 'Nithya Studio Assistant', 'Vanakkam! Welcome to Nithya Studio & Video. How may I assist you with your wedding, photoshoot, or album booking today?')
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Portfolio Categories
INSERT INTO public.portfolio_categories (id, name, slug, display_order, description) VALUES
('cat-wedding', 'Wedding Photography', 'wedding-photography', 1, 'Traditional Tamil Hindu Muhurtham ceremonies, candid rituals, and reception celebrations.'),
('cat-pre-wedding', 'Pre-Wedding & Outdoor', 'pre-wedding', 2, 'Cinematic romantic couple outdoor photoshoots and twilight storytelling sessions.'),
('cat-video', 'Wedding Videography', 'wedding-videography', 3, '4K cinema films, teaser trailers, candid wedding highlights, and drone aerials.'),
('cat-baby', 'Baby & Toddler Photography', 'baby-photography', 4, 'Newborn portraits, ear-piercing ceremonies, and childhood milestones.'),
('cat-birthday', 'Birthday Celebrations', 'birthday-photography', 5, 'Grand 1st birthdays, cake-smash fun, family celebrations, and milestone anniversaries.'),
('cat-albums', 'Photo Frames & Albums', 'albums-photo-frames', 6, 'Handcrafted flush-mount albums, wooden wall frames, acrylic luster prints, and heirloom preservation.')
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Official Services
INSERT INTO public.services (id, title, slug, short_description, full_description, image_url, price, duration_minutes, is_active, display_order, features) VALUES
('srv-1', 'Wedding Photography', 'wedding-photography', 'Full-day traditional and candid wedding photography preserving every sacred ritual.', 'Comprehensive coverage of Tamil weddings including Nichayathartham, Nalangu, Muhurtham, and Reception.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', 25000.00, 480, TRUE, 1, '["Traditional & Candid Coverage", "Dual Senior Photographers", "High-Resolution Edited Images", "Color Grading & Retouching"]'::jsonb),
('srv-2', 'Wedding Videography', 'wedding-videography', '4K cinematic wedding films, drone aerial views, and traditional live video coverage.', 'Cinematic storytelling with multi-axis gimbals, crisp audio recording, and custom Tamil background score.', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80', 30000.00, 480, TRUE, 2, '["4K Ultra-HD Cinema Cameras", "Licensed Drone Aerial Shots", "Teaser Reel & Full Wedding Film", "High-End Sound Capture"]'::jsonb),
('srv-3', 'Pre-Wedding Shoots', 'pre-wedding-photography', 'Romantic outdoor pre-wedding and post-wedding creative couple sessions.', 'Celebrate your love story across scenic hills, heritage temples, and twilight lakes.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 15000.00, 240, TRUE, 3, '["Multiple Costume Changes", "Scenic Location Consultation", "Cinematic Music Video Teaser", "Save-the-Date Digital Invite"]'::jsonb),
('srv-4', 'Birthday Photography', 'birthday-photography', 'Joyful candid event photography for milestone birthdays and family gatherings.', 'From 1st birthday cake smash parties to 60th Sashti Poorthi celebrations.', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80', 8000.00, 180, TRUE, 4, '["Cake Smash & Decor Portraits", "Candid Guest Coverage", "Same-Day Teaser Photos", "Full Event Coverage"]'::jsonb),
('srv-5', 'Baby & Toddler Shoots', 'baby-photography', 'Gentle newborn portraits, toddler milestone milestones, and cradle ceremonies.', 'Patient, sanitary in-studio and home baby photoshoots with custom props and soft warm lighting.', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80', 6000.00, 120, TRUE, 5, '["Sanitized Props & Backdrops", "Patient Pacing for Baby", "Family Bonding Portraits", "High-Resolution Prints"]'::jsonb),
('srv-6', 'Photo Editing & Restoration', 'photo-editing', 'Professional skin retouching, color grading, and vintage heirloom restoration.', 'Revitalize weathered ancestral photographs and enhance digital portraits.', 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80', 1000.00, 60, TRUE, 6, '["Scratch & Stain Removal", "Black & White Colorization", "High-End Skin Frequency Separation", "Digital Proof Before Final Print"]'::jsonb),
('srv-7', 'Passport & Visa Photos', 'passport-photos', 'Instant biometric passport, visa, ID card, and government document photographs.', 'Accurate background color matching and sizing according to international standards.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 150.00, 15, TRUE, 7, '["5-Minute Instant Print", "Compliance Guarantee", "Digital Soft-Copy on WhatsApp", "Multiple Size Options"]'::jsonb),
('srv-8', 'Photo Frames & Heirloom Albums', 'photo-frames-albums', 'Handcrafted wooden wall frames, acrylic prints, and non-tearable albums.', 'Turn your cherished memories into museum-quality display art.', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80', 5000.00, 120, TRUE, 8, '["Non-Tearable Silk Luster Paper", "Velvet & Acrylic Hardbound Covers", "Custom Embossed Names", "Lifetime Durability Guarantee"]'::jsonb),
('srv-9', 'Drone & Aerial Cinematography', 'drone-photography', 'Licensed high-definition drone photography and cinematic 4K aerial videography.', 'Spectacular bird''s-eye views capturing the scale of marriage halls and outdoor gatherings.', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80', 12000.00, 180, TRUE, 9, '["4K 60FPS Video Capture", "Licensed & Insured Drone Pilots", "Dynamic Establishing Shots", "Smooth Panoramic Sweeps"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Initial Portfolio Images
INSERT INTO public.portfolio_images (id, title, category_slug, category_id, image_url, thumbnail_url, is_featured, display_order, alt_text) VALUES
('gal-1', 'Sacred Varmala Exchange', 'wedding-photography', 'cat-wedding', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', TRUE, 1, 'Traditional South Indian wedding garland exchange captured by Nithya Studio'),
('gal-2', 'Bridal Kanchipuram Silk Elegance', 'wedding-photography', 'cat-wedding', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', TRUE, 2, 'South Indian bride in red silk saree and temple jewelry'),
('gal-3', 'Golden Hour Pre-Wedding Embrace', 'pre-wedding', 'cat-pre-wedding', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', TRUE, 3, 'Romantic couple golden hour pre-wedding photoshoot in Tamil Nadu'),
('gal-4', 'Ceremonial Mangalsutra Ritual', 'wedding-photography', 'cat-wedding', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80', TRUE, 4, 'Emotional mangalsutra tying ritual in traditional South Indian wedding'),
('gal-5', 'Pure Innocence Newborn Dream', 'baby-photography', 'cat-baby', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80', TRUE, 5, 'Sleeping baby portrait in soft knit wraps'),
('gal-6', 'Toddler Milestone First Cake Smash', 'birthday-photography', 'cat-birthday', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80', FALSE, 6, 'Colorful 1st birthday cake smash celebration with balloons'),
('gal-7', 'Lakeside Pre-Wedding Romance', 'pre-wedding', 'cat-pre-wedding', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80', FALSE, 7, 'Scenic pre-wedding couple photography at twilight'),
('gal-8', 'Handcrafted Flush-Mount Wedding Album', 'albums-photo-frames', 'cat-albums', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80', TRUE, 8, 'Luxury velvet and acrylic photobook crafted at Nithya Studio'),
('gal-9', 'Cinematic Grand Reception Highlights', 'wedding-videography', 'cat-video', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80', TRUE, 9, 'Grand wedding reception entrance lighting and stage setup')
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Testimonials
INSERT INTO public.testimonials (id, client_name, event_type, location, event_date, rating, comment, is_featured, is_published, display_order) VALUES
('test-1', 'Karthik & Deepa', 'Wedding Photography & Cinema', 'Uthangarai, Tamil Nadu', 'February 2024', 5, 'Nithya Studio & Video captured our wedding with immense passion and care. Every ritual was preserved with stunning clarity, and the album quality exceeded our expectations. Truly the best studio in our region!', TRUE, TRUE, 1),
('test-2', 'Saravanan & Priya', 'Pre-Wedding & Muhurtham', 'Karapattu', 'May 2024', 5, 'The team made us feel completely relaxed during our pre-wedding shoot. Their drone shots and cinematic video highlights received so many compliments from our friends and relatives.', TRUE, TRUE, 2),
('test-3', 'Anitha Ramesh', 'Baby 1st Birthday & Album', 'Harur / Uthangarai', 'August 2024', 5, 'So patient and gentle with our baby! The photos came out bright, natural, and joyful. The acrylic album we ordered is a treasure on our living room table.', TRUE, TRUE, 3)
ON CONFLICT (id) DO NOTHING;

-- 10. Seed YouTube Showcase
INSERT INTO public.youtube_videos (id, title, video_url, youtube_id, description, is_featured, display_order) VALUES
('yt-1', 'Traditional South Indian Hindu Wedding Highlights | Karapattu', 'https://www.youtube.com/@nithyastudiokpt', 'dQw4w9WgXcQ', 'Cinematic wedding film capturing devotional rituals, kanyadanam, and garland exchange in high definition.', TRUE, 1),
('yt-2', 'Romantic Pre-Wedding Teaser | Golden Hour Outdoor Shoot', 'https://www.youtube.com/@nithyastudiokpt', 'LXb3EKWsInQ', 'Romantic golden hour visual poem featuring sweeping hills and countryside serenity.', TRUE, 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- REALTIME SUBSCRIPTIONS PUBLICATION
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_enquiries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_availability;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
