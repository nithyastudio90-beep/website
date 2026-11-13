-- ============================================================================
-- NITHYA STUDIO & VIDEO – SEED DATA SCRIPT
-- Execute in Supabase SQL Editor to populate initial verified studio data
-- ============================================================================

-- 1. Studio Settings
INSERT INTO public.studio_settings (
    id,
    business_name,
    address_line1,
    address_line2,
    village_post,
    taluk,
    district_state,
    pincode,
    country,
    full_address,
    phone,
    whatsapp,
    email,
    instagram_url,
    youtube_url,
    maps_url
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

-- 2. Services (All 9 official services)
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
