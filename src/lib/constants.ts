import { Service, GalleryCategory, StudioSettings, YouTubeVideo } from '../types/database.types';

export const OFFICIAL_STUDIO_INFO: StudioSettings = {
  id: 'nithya-studio-official',
  business_name: 'Nithya Studio & Video',
  address_line1: '99, Karapattu Village and Post',
  address_line2: 'Uthangarai Taluk',
  village_post: 'Karapattu',
  taluk: 'Uthangarai',
  district_state: 'Tamil Nadu',
  pincode: '635306',
  country: 'India',
  full_address: '99, Karapattu Village and Post, Uthangarai Taluk, Karapattu, Tamil Nadu – 635306, India.',
  phone: '+91 84891 28362',
  whatsapp: '+91 84891 28362',
  email: 'nithyastudio90@gmail.com',
  instagram_url: 'https://www.instagram.com/nithyastudiokpt/',
  youtube_url: 'https://www.youtube.com/@nithyastudiokpt',
  maps_url: 'https://maps.google.com/?q=Karapattu+Uthangarai+Tamil+Nadu+635306',
};

export const RAW_WHATSAPP_NUMBER = '918489128362';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-wedding-photo',
    title: 'Wedding Photography',
    slug: 'wedding-photography',
    short_description: 'Timeless, candid, and traditional wedding photography capturing the raw emotions, rituals, and sacred bonds of your auspicious day.',
    full_description: 'Our wedding photography blends authentic emotional photojournalism with regal traditional portraits. From the lively haldi and sangeet to the sacred muhurtham and grand reception, we capture every sacred gesture, radiant smile, and tear of joy in pristine high resolution.',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Full-day Muhurtham & Reception coverage',
      'Candid & traditional couple portraiture',
      'Family & ritual focused photography',
      'High-resolution edited digital gallery',
      'Premium heirloom album design ready'
    ],
    is_active: true,
    display_order: 1,
  },
  {
    id: 'srv-wedding-video',
    title: 'Wedding Videography',
    slug: 'wedding-videography',
    short_description: 'Cinematic storytelling films, highlight reels, and traditional multi-cam video capture with pristine audio and 4K clarity.',
    full_description: 'We turn your wedding into a cinematic masterpiece. Utilizing 4K cinema cameras, gimbal stabilization, and crystal-clear audio recording, our team crafts poignant teaser trailers, emotional highlight films, and full-length ceremony recordings you will cherish forever.',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Cinematic 4K UHD video recording',
      'Gimbal-stabilized dynamic motion shots',
      'Lavalier & ambient sound capture',
      'Cinematic teaser & full-length film',
      'YouTube & Instagram ready edits'
    ],
    is_active: true,
    display_order: 2,
  },
  {
    id: 'srv-pre-wedding',
    title: 'Pre-Wedding Photography',
    slug: 'pre-wedding-photography',
    short_description: 'Artistic, romantic outdoor and destination couple shoots that celebrate your unique love story before the wedding celebrations.',
    full_description: 'Celebrate the chemistry and romance between you and your partner in stunning natural landscapes, historic locations, or scenic backdrops across Tamil Nadu. Relaxed, creative, and personalized to reflect your personalities.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Scenic outdoor location scouting',
      'Creative concept & moodboard planning',
      'Multiple costume changes & styling',
      'Signature color-graded portraits',
      'Save-The-Date teasers for social media'
    ],
    is_active: true,
    display_order: 3,
  },
  {
    id: 'srv-birthday',
    title: 'Birthday Photography',
    slug: 'birthday-photography',
    short_description: 'Vibrant celebration coverage capturing joyous laughter, cake-cutting milestones, games, and memories with loved ones.',
    full_description: 'From 1st birthday milestones to grand 60th Sashti Apthapoorthi celebrations, we capture the warmth, decorations, laughter, and candid moments that make family birthdays unforgettable.',
    image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Candid moments & party action',
      'Decoration & cake table portraits',
      'Family & guest group photos',
      'Fast delivery for sharing'
    ],
    is_active: true,
    display_order: 4,
  },
  {
    id: 'srv-baby',
    title: 'Baby Photography',
    slug: 'baby-photography',
    short_description: 'Gentle, heartwarming newborn and toddler portraits preserving innocence, tiny toes, and pure developmental milestones.',
    full_description: 'Tender newborn and toddler sessions handled with the highest safety, patience, and warmth. We capture authentic expressions, tiny details, and loving parent-baby bonds in comfortable studio or home environments.',
    image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Patient & baby-safe sessions',
      'Adorable props & cozy styling',
      'Parent & sibling portraits',
      'Natural lighting & gentle retouching'
    ],
    is_active: true,
    display_order: 5,
  },
  {
    id: 'srv-photo-editing',
    title: 'Photo Editing',
    slug: 'photo-editing',
    short_description: 'Professional color grading, retouching, restoration of vintage family photos, and flawless digital image enhancement.',
    full_description: 'Our digital imaging specialists handle skin retouching, color correction, background manipulation, and restoration of cherished antique photos. Bring old damaged prints back to life with state-of-the-art restoration.',
    image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Natural skin retouching & tone balancing',
      'Old & damaged photo restoration',
      'Color correction & artistic grading',
      'Background cleanup & replacement'
    ],
    is_active: true,
    display_order: 6,
  },
  {
    id: 'srv-passport',
    title: 'Passport Photos',
    slug: 'passport-photos',
    short_description: 'Instant, compliant biometric passport, visa, and ID photos formatted to international and domestic government standards.',
    full_description: 'Quick, high-clarity passport and visa photographs meeting all official sizing guidelines for Indian passports, Schengen, US, UK, Gulf visas, and student exams. Printed instantly on archival photo paper.',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Instant in-studio capture & print',
      'Strict government compliant guidelines',
      'White / light grey / blue backgrounds',
      'Physical prints + digital soft copy'
    ],
    is_active: true,
    display_order: 7,
  },
  {
    id: 'srv-frames-albums',
    title: 'Photo Frames & Albums',
    slug: 'photo-frames-albums',
    short_description: 'Premium handcrafted leatherette and acrylic photo albums, custom wooden framing, and long-lasting canvas wall art.',
    full_description: 'Transform digital memories into timeless physical treasures. We craft custom flush-mount wedding albums, crystal acrylic covers, metallic finish pages, and custom wood/synthetic wall frames built to withstand generations.',
    image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Premium flush-mount Italian leather & acrylic albums',
      'Anti-tear waterproof non-tearable paper',
      'Custom wall frames & canvas prints',
      'Custom layout design with client preview'
    ],
    is_active: true,
    display_order: 8,
  },
  {
    id: 'srv-drone',
    title: 'Drone Photography',
    slug: 'drone-photography',
    short_description: 'Breathtaking 4K aerial drone photography and sweeping video perspectives for weddings, outdoor events, and landscapes.',
    full_description: 'Add an extraordinary cinematic dimension to your wedding or grand event with high-definition aerial footage. Operated by skilled aerial cinematographers for safe, smooth, sweeping panoramic shots.',
    image_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    features: [
      '4K ultra-high definition aerial cinematography',
      'Sweeping wedding venue bird-eye views',
      'Procession & baraat aerial tracking',
      'Licensed & safe flight operations'
    ],
    is_active: true,
    display_order: 9,
  }
];

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { id: 'cat-all', name: 'All Works', slug: 'all', display_order: 0 },
  { id: 'cat-wedding', name: 'Wedding Photography', slug: 'wedding-photography', display_order: 1 },
  { id: 'cat-pre-wedding', name: 'Pre-Wedding', slug: 'pre-wedding', display_order: 2 },
  { id: 'cat-birthday', name: 'Birthday Photography', slug: 'birthday-photography', display_order: 3 },
  { id: 'cat-baby', name: 'Baby Photography', slug: 'baby-photography', display_order: 4 },
  { id: 'cat-video', name: 'Wedding Videography', slug: 'wedding-videography', display_order: 5 },
  { id: 'cat-albums', name: 'Albums & Photo Frames', slug: 'albums-photo-frames', display_order: 6 },
];

export const INITIAL_GALLERY_IMAGES = [
  {
    id: 'gal-1',
    title: 'Sacred Muhurtham Garland Exchange',
    category_slug: 'wedding-photography',
    category_id: 'cat-wedding',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    is_featured: true,
    display_order: 1,
    alt_text: 'Traditional South Indian wedding garland exchange captured by Nithya Studio'
  },
  {
    id: 'gal-2',
    title: 'Bridal Kanchipuram Silk Elegance',
    category_slug: 'wedding-photography',
    category_id: 'cat-wedding',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    is_featured: true,
    display_order: 2,
    alt_text: 'South Indian bride in red silk saree and temple jewelry'
  },
  {
    id: 'gal-3',
    title: 'Golden Hour Pre-Wedding Embrace',
    category_slug: 'pre-wedding',
    category_id: 'cat-pre-wedding',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    is_featured: true,
    display_order: 3,
    alt_text: 'Romantic couple golden hour pre-wedding photoshoot in Tamil Nadu'
  },
  {
    id: 'gal-4',
    title: 'Ceremonial Mangalsutra Ritual',
    category_slug: 'wedding-photography',
    category_id: 'cat-wedding',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    is_featured: true,
    display_order: 4,
    alt_text: 'Emotional mangalsutra tying ritual in traditional South Indian wedding'
  },
  {
    id: 'gal-5',
    title: 'Pure Innocence Newborn Dream',
    category_slug: 'baby-photography',
    category_id: 'cat-baby',
    image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
    is_featured: true,
    display_order: 5,
    alt_text: 'Sleeping baby portrait in soft knit wraps'
  },
  {
    id: 'gal-6',
    title: 'Toddler Milestone First Cake Smash',
    category_slug: 'birthday-photography',
    category_id: 'cat-birthday',
    image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
    is_featured: false,
    display_order: 6,
    alt_text: 'Colorful 1st birthday cake smash celebration with balloons'
  },
  {
    id: 'gal-7',
    title: 'Lakeside Pre-Wedding Romance',
    category_slug: 'pre-wedding',
    category_id: 'cat-pre-wedding',
    image_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
    is_featured: false,
    display_order: 7,
    alt_text: 'Scenic pre-wedding couple photography at twilight'
  },
  {
    id: 'gal-8',
    title: 'Handcrafted Flush-Mount Wedding Album',
    category_slug: 'albums-photo-frames',
    category_id: 'cat-albums',
    image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    is_featured: true,
    display_order: 8,
    alt_text: 'Luxury velvet and acrylic photobook crafted at Nithya Studio'
  },
  {
    id: 'gal-9',
    title: 'Cinematic Grand Reception Highlights',
    category_slug: 'wedding-videography',
    category_id: 'cat-video',
    image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
    is_featured: true,
    display_order: 9,
    alt_text: 'Grand wedding reception stage lights and cinematography'
  }
];

export const INITIAL_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-1',
    title: 'Traditional Tamil Wedding Highlights | Nithya Studio',
    video_url: 'https://www.youtube.com/@nithyastudiokpt',
    youtube_id: 'dQw4w9WgXcQ', // fallback or placeholder id, linking directly to official channel
    description: 'A breathtaking celebration of love, heritage, and rituals captured in full 4K cinema by Nithya Studio & Video.',
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'yt-2',
    title: 'Cinematic Pre-Wedding Teaser | Karapattu & Krishnagiri Sceneries',
    video_url: 'https://www.youtube.com/@nithyastudiokpt',
    youtube_id: 'LXb3EKWsInQ',
    description: 'Romantic golden hour visual poem featuring sweeping hills and countryside serenity.',
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
  }
];

export const TESTIMONIALS = [
  {
    id: 'test-1',
    client_name: 'Karthik & Deepa',
    event: 'Wedding Photography & Cinema',
    location: 'Uthangarai, Tamil Nadu',
    rating: 5,
    comment: 'Nithya Studio & Video captured our wedding with immense passion and care. Every ritual was preserved with stunning clarity, and the album quality exceeded our expectations. Truly the best studio in our region!',
    date: 'February 2024'
  },
  {
    id: 'test-2',
    client_name: 'Saravanan & Priya',
    event: 'Pre-Wedding & Muhurtham',
    location: 'Karapattu',
    rating: 5,
    comment: 'The team made us feel completely relaxed during our pre-wedding shoot. Their drone shots and cinematic video highlights received so many compliments from our friends and relatives.',
    date: 'May 2024'
  },
  {
    id: 'test-3',
    client_name: 'Anitha Ramesh',
    event: 'Baby 1st Birthday & Album',
    location: 'Harur / Uthangarai',
    rating: 5,
    comment: 'So patient and gentle with our baby! The photos came out bright, natural, and joyful. The acrylic album we ordered is a treasure on our living room table.',
    date: 'August 2024'
  }
];
