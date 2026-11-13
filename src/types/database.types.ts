export type BookingStatus = 'New' | 'Pending' | 'Confirmed' | 'Rejected' | 'Completed' | 'Cancelled';
export type EnquiryStatus = 'New' | 'Contacted' | 'Resolved' | 'Archived';

export interface Booking {
  id: string;
  customer_id?: string | null;
  customer_name: string;
  mobile_number: string;
  whatsapp_number?: string | null;
  email?: string | null;
  service_id?: string | null;
  service_name: string;
  event_date: string;
  event_start_time?: string | null;
  event_end_time?: string | null;
  duration_hours?: number;
  event_location: string;
  additional_message?: string | null;
  status: BookingStatus;
  admin_notes?: string | null;
  rejection_reason?: string | null;
  confirmed_at?: string | null;
  confirmed_by?: string | null;
  rejected_at?: string | null;
  rejected_by?: string | null;
  completed_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface BookingStatusHistory {
  id: string;
  booking_id: string;
  from_status: string;
  to_status: string;
  changed_by: string;
  reason?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface BookingAvailability {
  id: string;
  booking_id?: string | null;
  service_id?: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  is_full_day: boolean;
  is_blocked: boolean;
  notes?: string | null;
  created_at?: string;
}

export interface CalendarEvent {
  id: string;
  booking_id?: string | null;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  event_type: 'Booking' | 'Shoot' | 'Meeting' | 'Blocked';
  status: BookingStatus;
  location?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  normalized_phone: string;
  mobile_number: string;
  whatsapp_number?: string | null;
  email?: string | null;
  address?: string | null;
  total_bookings: number;
  confirmed_bookings: number;
  completed_bookings: number;
  rejected_bookings: number;
  cancelled_bookings: number;
  last_booking_date?: string | null;
  internal_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CustomerEnquiry {
  id: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  subject?: string | null;
  message: string;
  status: EnquiryStatus;
  admin_notes?: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  image_url: string;
  features?: string[];
  price?: number;
  price_label?: string;
  duration_minutes?: number;
  duration_label?: string;
  capacity?: number;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  description?: string;
}
export type GalleryCategory = PortfolioCategory;

export interface PortfolioImage {
  id: string;
  title: string;
  category_id?: string | null;
  category_slug: string;
  image_url: string;
  thumbnail_url?: string;
  storage_path?: string;
  google_drive_url?: string;
  is_featured: boolean;
  is_published?: boolean;
  display_order: number;
  width?: number;
  height?: number;
  alt_text?: string;
  created_at?: string;
}
export type GalleryImage = PortfolioImage;

export interface Testimonial {
  id: string;
  client_name: string;
  event_type: string;
  location: string;
  event_date?: string;
  rating: number;
  comment: string;
  avatar_url?: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at?: string;
}

export interface HomepageContent {
  id: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_background_image: string;
  hero_cta_primary: string;
  hero_cta_primary_link?: string;
  hero_cta_secondary: string;
  hero_cta_secondary_link?: string;
  featured_badge: string;
  stats_counters?: Array<{ label: string; value: string }>;
  updated_at?: string;
}

export interface AboutContent {
  id: string;
  page_title: string;
  page_subtitle: string;
  story_title: string;
  story_paragraphs: string[];
  experience_years: string;
  weddings_covered: string;
  main_image_url: string;
  secondary_image_url?: string;
  updated_at?: string;
}

export interface WebsiteSections {
  id: string;
  show_hero: boolean;
  show_about_overview: boolean;
  show_services: boolean;
  show_portfolio: boolean;
  show_youtube: boolean;
  show_instagram: boolean;
  show_testimonials: boolean;
  show_quick_contact: boolean;
  updated_at?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  video_url: string;
  youtube_id: string;
  thumbnail_url?: string;
  description?: string;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  full_address: string;
  address_line1: string;
  address_line2: string;
  village_post: string;
  taluk: string;
  district_state: string;
  pincode: string;
  country: string;
  maps_url?: string;
  instagram_url: string;
  youtube_url: string;
  business_hours?: string;
  business_timings?: string;
  seo_title?: string;
  seo_description?: string;
  social_share_image?: string;
  updated_at?: string;
}
export type StudioSettings = SiteSettings;

export interface AdminProfile {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  full_name?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, any>;
  ip_address?: string | null;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  customer_id?: string | null;
  booking_id?: string | null;
  channel: string;
  recipient: string;
  message_preview: string;
  status: 'prepared' | 'sent' | 'failed';
  provider_message_id?: string | null;
  error_message?: string | null;
  created_at: string;
}

export interface AISettings {
  id: string;
  is_enabled: boolean;
  assistant_name: string;
  system_prompt: string;
  welcome_message: string;
  voice_enabled: boolean;
  model_name: string;
  gemini_api_key?: string;
  default_language: string;
  max_tokens: number;
  updated_at?: string;
}

export interface BookingStats {
  total: number;
  newBookings: number;
  pending: number;
  confirmed: number;
  rejected: number;
  completed: number;
  cancelled: number;
  totalCustomers: number;
  activeServices: number;
  inactiveServices: number;
  totalEnquiries: number;
}

export interface DiagnosticsReport {
  apiStatus: 'online' | 'offline' | 'error';
  authStatus: 'online' | 'offline' | 'error';
  storageStatus: 'online' | 'offline' | 'error';
  realtimeStatus: 'online' | 'offline' | 'connecting';
  tablesStatus: Record<string, { exists: boolean; count: number; error?: string }>;
  lastChecked: string;
  projectUrl: string;
  responseTimeMs: number;
}
