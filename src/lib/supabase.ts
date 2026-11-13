import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Booking,
  BookingStatus,
  GalleryCategory,
  GalleryImage,
  Service,
  StudioSettings,
  YouTubeVideo
} from '../types/database.types';
import {
  OFFICIAL_STUDIO_INFO,
  INITIAL_SERVICES,
  GALLERY_CATEGORIES,
  INITIAL_GALLERY_IMAGES,
  INITIAL_YOUTUBE_VIDEOS
} from './constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-ref')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage keys for resilient offline/development fallback
const STORAGE_KEYS = {
  BOOKINGS: 'nithya_bookings_store',
  SERVICES: 'nithya_services_store',
  GALLERY_IMAGES: 'nithya_gallery_store',
  GALLERY_CATEGORIES: 'nithya_categories_store',
  SETTINGS: 'nithya_settings_store',
  YOUTUBE: 'nithya_youtube_store',
};

// Seed local storage with official initial data if not already present
function initializeLocalStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY_CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.GALLERY_CATEGORIES, JSON.stringify(GALLERY_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY_IMAGES)) {
    localStorage.setItem(STORAGE_KEYS.GALLERY_IMAGES, JSON.stringify(INITIAL_GALLERY_IMAGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(OFFICIAL_STUDIO_INFO));
  }
  if (!localStorage.getItem(STORAGE_KEYS.YOUTUBE)) {
    localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(INITIAL_YOUTUBE_VIDEOS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    // Start with empty or sample initial enquiries
    const sampleBookings: Booking[] = [
      {
        id: 'bk-1001',
        customer_name: 'Dinesh Kumar & Priya',
        mobile_number: '+91 98421 54321',
        email: 'dinesh.priya@gmail.com',
        service_name: 'Wedding Photography',
        service_id: 'srv-wedding-photo',
        event_date: '2026-12-18',
        event_location: 'Uthangarai Kalyana Mandapam',
        additional_message: 'Interested in Muhurtham and Reception candid coverage + 1 Premium Album.',
        status: 'Confirmed',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'bk-1002',
        customer_name: 'Vigneshwaran',
        mobile_number: '+91 87654 32109',
        email: 'vignesh.m@yahoo.com',
        service_name: 'Pre-Wedding Photography',
        service_id: 'srv-pre-wedding',
        event_date: '2027-01-10',
        event_location: 'Krishnagiri Dam & Lakeview',
        additional_message: 'Want sunset golden hour shoot and drone video teaser.',
        status: 'Pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(sampleBookings));
  }
}

initializeLocalStorage();

// ============================================================================
// UNIFIED DATA SERVICE (Supabase + Resilient Local Fallback)
// ============================================================================
export const DataService = {
  // ---------------- BOOKINGS ----------------
  async submitBooking(data: {
    customer_name: string;
    mobile_number: string;
    email?: string | null;
    service_id?: string | null;
    service_name: string;
    event_date: string;
    event_location: string;
    additional_message?: string | null;
  }): Promise<{ success: boolean; data?: Booking; error?: string }> {
    const newBooking: Booking = {
      id: `bk-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      customer_name: data.customer_name.trim(),
      mobile_number: data.mobile_number.trim(),
      email: data.email?.trim() || null,
      service_id: data.service_id || null,
      service_name: data.service_name,
      event_date: data.event_date,
      event_location: data.event_location.trim(),
      additional_message: data.additional_message?.trim() || null,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('bookings')
          .insert([newBooking])
          .select()
          .single();

        if (error) {
          console.warn('Supabase booking insert error, falling back to local store:', error.message);
        } else if (inserted) {
          return { success: true, data: inserted };
        }
      } catch (err: any) {
        console.warn('Supabase call failed, utilizing persistent local storage:', err.message);
      }
    }

    // Local Storage persistence
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      const bookings: Booking[] = stored ? JSON.parse(stored) : [];
      bookings.unshift(newBooking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      return { success: true, data: newBooking };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to submit booking' };
    }
  },

  async fetchBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Fetch from Supabase failed, falling back to local:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Update on Supabase failed, updating local store:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!stored) return false;
      const bookings: Booking[] = JSON.parse(stored);
      const index = bookings.findIndex((b) => b.id === id);
      if (index !== -1) {
        bookings[index].status = status;
        bookings[index].updated_at = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  async deleteBooking(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Delete on Supabase failed, falling back to local store:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!stored) return false;
      const bookings: Booking[] = JSON.parse(stored);
      const filtered = bookings.filter((b) => b.id !== id);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- SERVICES ----------------
  async fetchServices(): Promise<Service[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Services fetch fallback:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return stored ? JSON.parse(stored) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  },

  async saveService(service: Service): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('services').upsert(service);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase service save error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
      const services: Service[] = stored ? JSON.parse(stored) : [...INITIAL_SERVICES];
      const idx = services.findIndex((s) => s.id === service.id);
      if (idx !== -1) {
        services[idx] = service;
      } else {
        services.push(service);
      }
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- GALLERY ----------------
  async fetchGalleryImages(categorySlug?: string): Promise<GalleryImage[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('gallery_images').select('*').order('display_order', { ascending: true });
        if (categorySlug && categorySlug !== 'all') {
          query = query.eq('category_slug', categorySlug);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Gallery images fetch fallback:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GALLERY_IMAGES);
      const images: GalleryImage[] = stored ? JSON.parse(stored) : INITIAL_GALLERY_IMAGES;
      if (!categorySlug || categorySlug === 'all') return images;
      return images.filter((img) => img.category_slug === categorySlug);
    } catch {
      return INITIAL_GALLERY_IMAGES;
    }
  },

  async fetchGalleryCategories(): Promise<GalleryCategory[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('gallery_categories')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Gallery categories fetch fallback:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GALLERY_CATEGORIES);
      return stored ? JSON.parse(stored) : GALLERY_CATEGORIES;
    } catch {
      return GALLERY_CATEGORIES;
    }
  },

  async addGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> {
    const newImage: GalleryImage = {
      ...image,
      id: `gal-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('gallery_images').insert([newImage]).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase gallery insert error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.GALLERY_IMAGES);
    const images: GalleryImage[] = stored ? JSON.parse(stored) : [...INITIAL_GALLERY_IMAGES];
    images.unshift(newImage);
    localStorage.setItem(STORAGE_KEYS.GALLERY_IMAGES, JSON.stringify(images));
    return newImage;
  },

  async deleteGalleryImage(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('gallery_images').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase gallery delete error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GALLERY_IMAGES);
      if (!stored) return false;
      const images: GalleryImage[] = JSON.parse(stored);
      const filtered = images.filter((img) => img.id !== id);
      localStorage.setItem(STORAGE_KEYS.GALLERY_IMAGES, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- STUDIO SETTINGS ----------------
  async fetchStudioSettings(): Promise<StudioSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('studio_settings')
          .select('*')
          .eq('id', 'nithya-studio-official')
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Settings fetch fallback:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : OFFICIAL_STUDIO_INFO;
    } catch {
      return OFFICIAL_STUDIO_INFO;
    }
  },

  async updateStudioSettings(settings: StudioSettings): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('studio_settings')
          .upsert({ ...settings, updated_at: new Date().toISOString() });
        if (!error) return true;
      } catch (err) {
        console.warn('Settings update fallback:', err);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- YOUTUBE VIDEOS ----------------
  async fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('youtube_videos')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('YouTube fetch fallback:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.YOUTUBE);
      return stored ? JSON.parse(stored) : INITIAL_YOUTUBE_VIDEOS;
    } catch {
      return INITIAL_YOUTUBE_VIDEOS;
    }
  },

  async saveYouTubeVideo(video: YouTubeVideo): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('youtube_videos').upsert(video);
        if (!error) return true;
      } catch (err) {
        console.warn('YouTube save error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.YOUTUBE);
      const videos: YouTubeVideo[] = stored ? JSON.parse(stored) : [...INITIAL_YOUTUBE_VIDEOS];
      const idx = videos.findIndex((v) => v.id === video.id);
      if (idx !== -1) {
        videos[idx] = video;
      } else {
        videos.push(video);
      }
      localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(videos));
      return true;
    } catch {
      return false;
    }
  },

  async deleteYouTubeVideo(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('youtube_videos').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('YouTube delete error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.YOUTUBE);
      if (!stored) return false;
      const videos: YouTubeVideo[] = JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(videos.filter((v) => v.id !== id)));
      return true;
    } catch {
      return false;
    }
  }
};
