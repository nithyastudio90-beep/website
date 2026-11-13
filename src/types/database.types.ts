export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  customer_name: string;
  mobile_number: string;
  email?: string | null;
  service_id?: string | null;
  service_name: string;
  event_date: string;
  event_location: string;
  additional_message?: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  image_url: string;
  features?: string[];
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  description?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category_id: string;
  category_slug?: string;
  image_url: string;
  thumbnail_url?: string;
  is_featured: boolean;
  display_order: number;
  width?: number;
  height?: number;
  alt_text?: string;
  created_at?: string;
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

export interface StudioSettings {
  id: string;
  business_name: string;
  address_line1: string;
  address_line2: string;
  village_post: string;
  taluk: string;
  district_state: string;
  pincode: string;
  country: string;
  full_address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram_url: string;
  youtube_url: string;
  maps_url?: string;
  updated_at?: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  full_name?: string;
  created_at: string;
}
