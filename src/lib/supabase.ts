import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Booking,
  BookingStatus,
  BookingStatusHistory,
  BookingAvailability,
  CalendarEvent,
  Customer,
  CustomerEnquiry,
  EnquiryStatus,
  Service,
  PortfolioCategory,
  PortfolioImage,
  GalleryCategory,
  GalleryImage,
  Testimonial,
  HomepageContent,
  AboutContent,
  WebsiteSections,
  SiteSettings,
  StudioSettings,
  YouTubeVideo,
  AdminProfile,
  ActivityLog,
  NotificationLog,
  AISettings,
  BookingStats,
  DiagnosticsReport
} from '../types/database.types';
import {
  OFFICIAL_STUDIO_INFO,
  INITIAL_SERVICES,
  GALLERY_CATEGORIES,
  INITIAL_GALLERY_IMAGES,
  INITIAL_YOUTUBE_VIDEOS,
  INITIAL_HOMEPAGE_CONTENT,
  INITIAL_ABOUT_CONTENT,
  INITIAL_WEBSITE_SECTIONS,
  INITIAL_AI_SETTINGS,
  INITIAL_CUSTOMERS,
  TESTIMONIALS
} from './constants';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://bbdfewknrwiurrioojll.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_n5uBFZjz2WvEu-B0DOcisg_FoioK1jL';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-ref')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Local storage keys for resilient offline fallback
const STORAGE_KEYS = {
  BOOKINGS: 'nithya_bookings_store',
  BOOKING_HISTORY: 'nithya_booking_history_store',
  AVAILABILITY: 'nithya_availability_store',
  CALENDAR: 'nithya_calendar_store',
  CUSTOMERS: 'nithya_customers_store',
  ENQUIRIES: 'nithya_enquiries_store',
  SERVICES: 'nithya_services_store',
  PORTFOLIO_IMAGES: 'nithya_gallery_store',
  PORTFOLIO_CATEGORIES: 'nithya_categories_store',
  SETTINGS: 'nithya_settings_store',
  YOUTUBE: 'nithya_youtube_store',
  HOMEPAGE: 'nithya_homepage_store',
  ABOUT: 'nithya_about_store',
  SECTIONS: 'nithya_sections_store',
  TESTIMONIALS: 'nithya_testimonials_store',
  ACTIVITY_LOGS: 'nithya_activity_logs_store',
  AI_SETTINGS: 'nithya_ai_settings_store',
};

// Seed local storage with initial data if offline
function initializeLocalStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PORTFOLIO_CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO_CATEGORIES, JSON.stringify(GALLERY_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PORTFOLIO_IMAGES)) {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO_IMAGES, JSON.stringify(INITIAL_GALLERY_IMAGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(OFFICIAL_STUDIO_INFO));
  }
  if (!localStorage.getItem(STORAGE_KEYS.YOUTUBE)) {
    localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(INITIAL_YOUTUBE_VIDEOS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOMEPAGE)) {
    localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(INITIAL_HOMEPAGE_CONTENT));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ABOUT)) {
    localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(INITIAL_ABOUT_CONTENT));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SECTIONS)) {
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(INITIAL_WEBSITE_SECTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AI_SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.AI_SETTINGS, JSON.stringify(INITIAL_AI_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  }
}

initializeLocalStorage();

/**
 * Normalizes phone numbers to standard 10 or 12 digit string for deduplication
 */
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  return digits || phone.trim();
}

/**
 * Converts Google Drive sharing link to a direct renderable image URL
 */
export function parseGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed.includes('drive.google.com')) return trimmed;

  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return trimmed;
}

export const DataService = {
  // ---------------- DIAGNOSTICS & HEALTH CHECK ----------------
  async checkConnectionHealth(): Promise<DiagnosticsReport> {
    const startTime = Date.now();
    const report: DiagnosticsReport = {
      apiStatus: 'offline',
      authStatus: 'offline',
      storageStatus: 'offline',
      realtimeStatus: 'connecting',
      tablesStatus: {},
      lastChecked: new Date().toISOString(),
      projectUrl: supabaseUrl,
      responseTimeMs: 0
    };

    if (!isSupabaseConfigured || !supabase) {
      report.responseTimeMs = Date.now() - startTime;
      return report;
    }

    try {
      // 1. Check Auth
      const { error: authErr } = await supabase.auth.getSession();
      report.authStatus = authErr ? 'error' : 'online';

      // 2. Check Storage
      const { error: storageErr } = await supabase.storage.listBuckets();
      report.storageStatus = storageErr ? 'error' : 'online';

      // 3. Check Core Tables
      const tablesToCheck = [
        'bookings',
        'customers',
        'services',
        'portfolio_images',
        'portfolio_categories',
        'homepage_content',
        'about_content',
        'site_settings',
        'customer_enquiries',
        'testimonials',
        'booking_availability',
        'calendar_events',
        'activity_logs',
        'ai_settings'
      ];

      let anyTableSuccess = false;
      await Promise.all(
        tablesToCheck.map(async (table) => {
          try {
            const { count, error } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });

            if (error) {
              report.tablesStatus[table] = {
                exists: false,
                count: 0,
                error: error.message
              };
            } else {
              anyTableSuccess = true;
              report.tablesStatus[table] = {
                exists: true,
                count: count || 0
              };
            }
          } catch (e: any) {
            report.tablesStatus[table] = {
              exists: false,
              count: 0,
              error: e.message
            };
          }
        })
      );

      report.apiStatus = anyTableSuccess ? 'online' : 'error';
      report.realtimeStatus = anyTableSuccess ? 'online' : 'offline';
    } catch {
      report.apiStatus = 'error';
    }

    report.responseTimeMs = Date.now() - startTime;
    return report;
  },

  // ---------------- BOOKINGS & AVAILABILITY ----------------
  async createBooking(data: {
    customer_name: string;
    mobile_number: string;
    whatsapp_number?: string;
    email?: string;
    service_id?: string;
    service_name: string;
    event_date: string;
    event_start_time?: string;
    event_end_time?: string;
    duration_hours?: number;
    event_location: string;
    additional_message?: string;
  }): Promise<{ success: boolean; data?: Booking; error?: string }> {
    const bookingId = `bkg-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    const normalizedPhone = normalizePhoneNumber(data.mobile_number);

    const newBooking: Booking = {
      id: bookingId,
      customer_name: data.customer_name.trim(),
      mobile_number: data.mobile_number.trim(),
      whatsapp_number: data.whatsapp_number?.trim() || data.mobile_number.trim(),
      email: data.email?.trim() || null,
      service_id: data.service_id || null,
      service_name: data.service_name,
      event_date: data.event_date,
      event_start_time: data.event_start_time || '09:00:00',
      event_end_time: data.event_end_time || '17:00:00',
      duration_hours: data.duration_hours || 8,
      event_location: data.event_location.trim(),
      additional_message: data.additional_message?.trim() || null,
      status: 'New',
      created_at: new Date().toISOString(),
    };

    // Auto-sync customer CRM record
    await this.upsertCustomerFromBooking(newBooking, normalizedPhone);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('bookings')
          .insert([newBooking])
          .select()
          .single();

        if (!error && inserted) {
          await this.logBookingHistory(bookingId, 'None', 'New', 'Customer Form', 'New booking submitted from public portal');
          return { success: true, data: inserted as Booking };
        }
      } catch (err: any) {
        console.warn('Supabase booking insert noticed error, using resilient store:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      const bookings: Booking[] = stored ? JSON.parse(stored) : [];
      bookings.unshift(newBooking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      await this.logBookingHistory(bookingId, 'None', 'New', 'Customer Form', 'New booking submitted from public portal');
      return { success: true, data: newBooking };
    } catch {
      return { success: false, error: 'Could not store booking enquiry.' };
    }
  },

  async submitBooking(data: {
    customer_name: string;
    mobile_number: string;
    whatsapp_number?: string;
    email?: string;
    service_id?: string;
    service_name: string;
    event_date: string;
    event_start_time?: string;
    event_end_time?: string;
    duration_hours?: number;
    event_location: string;
    additional_message?: string;
  }): Promise<{ success: boolean; data?: Booking; error?: string }> {
    return this.createBooking(data);
  },

  async fetchBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as Booking[];
        }
      } catch (err) {
        console.warn('Supabase bookings fetch error, using local store:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Confirms a booking atomically, reserving the time slot and generating a calendar event
   */
  async confirmBooking(
    id: string,
    adminId: string = 'admin'
  ): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('confirm_booking_atomic', {
          p_booking_id: id,
          p_admin_id: adminId
        });

        if (!error && data && data.success) {
          return { success: true };
        } else if (data && !data.success) {
          return { success: false, error: data.error || 'Conflict: Slot unavailable.' };
        }
      } catch (err: any) {
        console.warn('Atomic RPC failed, running fallback confirmation:', err);
      }
    }

    // Local Fallback Confirmation
    try {
      const bookings = await this.fetchBookings();
      const booking = bookings.find(b => b.id === id);
      if (!booking) return { success: false, error: 'Booking not found.' };

      // Check slot availability
      const isAvailable = await this.checkSlotAvailability(booking.event_date, booking.event_start_time || '00:00:00', booking.event_end_time || '23:59:59', id);
      if (!isAvailable) {
        return { success: false, error: 'Sorry! This date or time slot is already confirmed for another booking.' };
      }

      booking.status = 'Confirmed';
      booking.confirmed_at = new Date().toISOString();
      booking.confirmed_by = adminId;
      booking.updated_at = new Date().toISOString();

      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

      // Lock availability
      const avail = await this.fetchAvailability();
      avail.push({
        id: `avail-${Date.now()}`,
        booking_id: id,
        service_id: booking.service_id,
        event_date: booking.event_date,
        start_time: booking.event_start_time || '09:00:00',
        end_time: booking.event_end_time || '17:00:00',
        is_full_day: true,
        is_blocked: true,
        notes: `Confirmed for ${booking.customer_name}`
      });
      localStorage.setItem(STORAGE_KEYS.AVAILABILITY, JSON.stringify(avail));

      await this.logBookingHistory(id, 'Pending', 'Confirmed', adminId, 'Confirmed by administrator');
      await this.logActivity(adminId, 'CONFIRM_BOOKING', 'booking', id, { client: booking.customer_name, date: booking.event_date });
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to confirm booking.' };
    }
  },

  /**
   * Rejects a booking with mandatory reason and releases any reserved availability slot
   */
  async rejectBooking(
    id: string,
    reason: string,
    adminId: string = 'admin'
  ): Promise<{ success: boolean; error?: string }> {
    if (!reason || !reason.trim()) {
      return { success: false, error: 'A rejection reason is strictly mandatory.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('reject_booking_atomic', {
          p_booking_id: id,
          p_admin_id: adminId,
          p_reason: reason.trim()
        });

        if (!error && data && data.success) {
          return { success: true };
        }
      } catch (err) {
        console.warn('Atomic reject RPC failed, using fallback:', err);
      }
    }

    try {
      const bookings = await this.fetchBookings();
      const booking = bookings.find(b => b.id === id);
      if (!booking) return { success: false, error: 'Booking not found.' };

      const fromStatus = booking.status;
      booking.status = 'Rejected';
      booking.rejection_reason = reason.trim();
      booking.rejected_at = new Date().toISOString();
      booking.rejected_by = adminId;
      booking.updated_at = new Date().toISOString();

      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

      // Release availability lock
      const avail = (await this.fetchAvailability()).filter(a => a.booking_id !== id);
      localStorage.setItem(STORAGE_KEYS.AVAILABILITY, JSON.stringify(avail));

      await this.logBookingHistory(id, fromStatus, 'Rejected', adminId, reason.trim());
      await this.logActivity(adminId, 'REJECT_BOOKING', 'booking', id, { client: booking.customer_name, reason: reason.trim() });
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to reject booking.' };
    }
  },

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    adminNotes?: string,
    adminId: string = 'admin'
  ): Promise<boolean> {
    if (status === 'Confirmed') {
      const res = await this.confirmBooking(id, adminId);
      return res.success;
    }

    const updatePayload: any = { status, updated_at: new Date().toISOString() };
    if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;
    if (status === 'Completed') updatePayload.completed_at = new Date().toISOString();
    if (status === 'Cancelled') updatePayload.cancelled_at = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .update(updatePayload)
          .eq('id', id);

        if (!error) {
          await this.logBookingHistory(id, 'Previous', status, adminId, adminNotes || `Status updated to ${status}`);
          return true;
        }
      } catch (err) {
        console.warn('Supabase booking update failed, updating local store:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (stored) {
        const bookings: Booking[] = JSON.parse(stored);
        const idx = bookings.findIndex((b) => b.id === id);
        if (idx !== -1) {
          const from = bookings[idx].status;
          bookings[idx] = { ...bookings[idx], ...updatePayload };
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
          await this.logBookingHistory(id, from, status, adminId, adminNotes || `Status updated to ${status}`);
          return true;
        }
      }
    } catch {}
    return false;
  },

  async deleteBooking(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase delete booking failed, updating local store:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (stored) {
        const bookings: Booking[] = JSON.parse(stored);
        const updated = bookings.filter((b) => b.id !== id);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
        return true;
      }
    } catch {}
    return false;
  },

  // ---------------- TIME SLOT AVAILABILITY ENGINE ----------------
  async checkSlotAvailability(
    eventDate: string,
    startTime: string = '00:00:00',
    endTime: string = '23:59:59',
    excludeBookingId?: string
  ): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('booking_availability')
          .select('id, start_time, end_time, booking_id')
          .eq('event_date', eventDate)
          .eq('is_blocked', true);

        if (excludeBookingId) {
          query = query.neq('booking_id', excludeBookingId);
        }

        const { data, error } = await query;
        if (!error && data) {
          const hasConflict = data.some(slot => {
            return slot.start_time <= endTime && slot.end_time >= startTime;
          });
          return !hasConflict;
        }
      } catch (err) {
        console.warn('Availability check failed, using local check:', err);
      }
    }

    const avail = await this.fetchAvailability();
    const conflicts = avail.filter(a => 
      a.event_date === eventDate &&
      a.is_blocked &&
      (!excludeBookingId || a.booking_id !== excludeBookingId) &&
      (a.start_time <= endTime && a.end_time >= startTime)
    );
    return conflicts.length === 0;
  },

  async fetchAvailability(): Promise<BookingAvailability[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('booking_availability')
          .select('*')
          .order('event_date', { ascending: true });
        if (!error && data) return data as BookingAvailability[];
      } catch {}
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AVAILABILITY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async logBookingHistory(
    bookingId: string,
    fromStatus: string,
    toStatus: string,
    changedBy: string,
    reason?: string
  ): Promise<void> {
    const entry: BookingStatusHistory = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      booking_id: bookingId,
      from_status: fromStatus,
      to_status: toStatus,
      changed_by: changedBy,
      reason: reason || null,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('booking_status_history').insert([entry]);
      } catch {}
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKING_HISTORY);
      const list: BookingStatusHistory[] = stored ? JSON.parse(stored) : [];
      list.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.BOOKING_HISTORY, JSON.stringify(list));
    } catch {}
  },

  async fetchBookingHistory(bookingId: string): Promise<BookingStatusHistory[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('booking_status_history')
          .select('*')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: false });
        if (!error && data) return data as BookingStatusHistory[];
      } catch {}
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKING_HISTORY);
      const list: BookingStatusHistory[] = stored ? JSON.parse(stored) : [];
      return list.filter(h => h.booking_id === bookingId);
    } catch {
      return [];
    }
  },

  // ---------------- CALENDAR EVENTS ----------------
  async fetchCalendarEvents(): Promise<CalendarEvent[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .order('event_date', { ascending: true });
        if (!error && data && data.length > 0) return data as CalendarEvent[];
      } catch {}
    }

    // Generate from confirmed bookings fallback
    const bookings = await this.fetchBookings();
    return bookings.map(b => ({
      id: `cal-${b.id}`,
      booking_id: b.id,
      title: `${b.service_name} • ${b.customer_name}`,
      event_date: b.event_date,
      start_time: b.event_start_time || '09:00:00',
      end_time: b.event_end_time || '17:00:00',
      event_type: 'Booking',
      status: b.status,
      location: b.event_location,
      customer_name: b.customer_name,
      customer_phone: b.mobile_number,
      notes: b.additional_message || undefined,
      created_at: b.created_at
    }));
  },

  // ---------------- CUSTOMER MANAGEMENT (CRM) ----------------
  async upsertCustomerFromBooking(booking: Booking, normalizedPhone: string): Promise<void> {
    const customers = await this.fetchCustomers();
    const existing = customers.find(c => c.normalized_phone === normalizedPhone);

    const customerRecord: Customer = {
      id: existing ? existing.id : `cust-${Date.now()}`,
      name: booking.customer_name,
      normalized_phone: normalizedPhone,
      mobile_number: booking.mobile_number,
      whatsapp_number: booking.whatsapp_number || booking.mobile_number,
      email: booking.email || existing?.email || null,
      address: booking.event_location || existing?.address || null,
      total_bookings: (existing?.total_bookings || 0) + 1,
      confirmed_bookings: existing?.confirmed_bookings || 0,
      completed_bookings: existing?.completed_bookings || 0,
      rejected_bookings: existing?.rejected_bookings || 0,
      cancelled_bookings: existing?.cancelled_bookings || 0,
      last_booking_date: booking.event_date,
      internal_notes: existing?.internal_notes || null,
      created_at: existing ? existing.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('customers').upsert([customerRecord], { onConflict: 'normalized_phone' });
      } catch {}
    }

    try {
      const idx = customers.findIndex(c => c.normalized_phone === normalizedPhone);
      if (idx !== -1) customers[idx] = customerRecord;
      else customers.unshift(customerRecord);
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch {}
  },

  async fetchCustomers(): Promise<Customer[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('total_bookings', { ascending: false });
        if (!error && data && data.length > 0) return data as Customer[];
      } catch {}
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return stored ? JSON.parse(stored) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  },

  async updateCustomer(customer: Customer): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('customers').upsert([customer]);
        if (!error) return true;
      } catch {}
    }
    try {
      const list = await this.fetchCustomers();
      const idx = list.findIndex(c => c.id === customer.id || c.normalized_phone === customer.normalized_phone);
      if (idx !== -1) list[idx] = customer;
      else list.push(customer);
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- CUSTOMER ENQUIRIES (CONTACT US FORM) ----------------
  async submitEnquiry(data: {
    customer_name: string;
    phone: string;
    email?: string | null;
    subject?: string | null;
    message: string;
  }): Promise<{ success: boolean; data?: CustomerEnquiry; error?: string }> {
    const newEnquiry: CustomerEnquiry = {
      id: `enq-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      customer_name: data.customer_name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      subject: data.subject?.trim() || 'General Enquiry',
      message: data.message.trim(),
      status: 'New',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('customer_enquiries')
          .insert([newEnquiry])
          .select()
          .single();

        if (!error && inserted) {
          return { success: true, data: inserted as CustomerEnquiry };
        }
      } catch (err: any) {
        console.warn('Supabase enquiry insert failed, using local store:', err.message);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      const list: CustomerEnquiry[] = stored ? JSON.parse(stored) : [];
      list.unshift(newEnquiry);
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(list));
      return { success: true, data: newEnquiry };
    } catch {
      return { success: false, error: 'Could not store enquiry.' };
    }
  },

  async fetchEnquiries(): Promise<CustomerEnquiry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('customer_enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) return data as CustomerEnquiry[];
      } catch (err) {
        console.warn('Supabase enquiries fetch error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async updateEnquiryStatus(id: string, status: EnquiryStatus, adminNotes?: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const updatePayload: any = { status };
        if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;
        const { error } = await supabase.from('customer_enquiries').update(updatePayload).eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update enquiry status error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      if (stored) {
        const list: CustomerEnquiry[] = JSON.parse(stored);
        const idx = list.findIndex(e => e.id === id);
        if (idx !== -1) {
          list[idx].status = status;
          if (adminNotes !== undefined) list[idx].admin_notes = adminNotes;
          localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(list));
          return true;
        }
      }
    } catch {}
    return false;
  },

  // ---------------- SERVICES MANAGEMENT (UNLIMITED SERVICES) ----------------
  async fetchServices(): Promise<Service[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as Service[];
        }
      } catch (err) {
        console.warn('Supabase services fetch failed, falling back to local store:', err);
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
        const { error } = await supabase.from('services').upsert([service]);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase save service failed, saving locally:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
      const services: Service[] = stored ? JSON.parse(stored) : INITIAL_SERVICES;
      const idx = services.findIndex((s) => s.id === service.id || s.slug === service.slug);
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

  async deleteService(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase delete service failed:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (stored) {
        const services: Service[] = JSON.parse(stored);
        const filtered = services.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(filtered));
        return true;
      }
    } catch {}
    return false;
  },

  // ---------------- PORTFOLIO CATEGORIES ----------------
  async fetchPortfolioCategories(): Promise<PortfolioCategory[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('portfolio_categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as PortfolioCategory[];
        }
      } catch (err) {
        console.warn('Supabase portfolio categories fetch error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO_CATEGORIES);
      return stored ? JSON.parse(stored) : GALLERY_CATEGORIES;
    } catch {
      return GALLERY_CATEGORIES;
    }
  },
  fetchGalleryCategories(): Promise<GalleryCategory[]> {
    return this.fetchPortfolioCategories();
  },

  async savePortfolioCategory(category: PortfolioCategory): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_categories').upsert([category]);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase category upsert error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO_CATEGORIES);
      const list: PortfolioCategory[] = stored ? JSON.parse(stored) : GALLERY_CATEGORIES;
      const idx = list.findIndex(c => c.id === category.id || c.slug === category.slug);
      if (idx !== -1) list[idx] = category;
      else list.push(category);
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO_CATEGORIES, JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  },

  async deletePortfolioCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_categories').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase category delete error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO_CATEGORIES);
      if (stored) {
        const list: PortfolioCategory[] = JSON.parse(stored);
        localStorage.setItem(STORAGE_KEYS.PORTFOLIO_CATEGORIES, JSON.stringify(list.filter(c => c.id !== id)));
        return true;
      }
    } catch {}
    return false;
  },

  // ---------------- PORTFOLIO / GALLERY IMAGES ----------------
  async fetchPortfolioImages(categorySlug?: string): Promise<PortfolioImage[]> {
    let images: PortfolioImage[] = [];
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('portfolio_images')
          .select('*')
          .order('display_order', { ascending: true });

        if (categorySlug && categorySlug !== 'all') {
          query = query.eq('category_slug', categorySlug);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          images = data as PortfolioImage[];
        }
      } catch (err) {
        console.warn('Supabase portfolio images fetch error:', err);
      }
    }

    if (images.length === 0) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO_IMAGES);
        const all = stored ? JSON.parse(stored) : INITIAL_GALLERY_IMAGES;
        images = (categorySlug && categorySlug !== 'all')
          ? all.filter((img: PortfolioImage) => img.category_slug === categorySlug)
          : all;
      } catch {
        images = (categorySlug && categorySlug !== 'all')
          ? INITIAL_GALLERY_IMAGES.filter((img: PortfolioImage) => img.category_slug === categorySlug)
          : INITIAL_GALLERY_IMAGES;
      }
    }

    return images;
  },
  fetchGalleryImages(categorySlug?: string): Promise<GalleryImage[]> {
    return this.fetchPortfolioImages(categorySlug);
  },

  async savePortfolioImage(image: PortfolioImage): Promise<boolean> {
    // Auto-parse Google Drive link if supplied
    if (image.google_drive_url) {
      image.image_url = parseGoogleDriveUrl(image.google_drive_url);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_images').upsert([image]);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase image upsert error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO_IMAGES);
      const list: PortfolioImage[] = stored ? JSON.parse(stored) : INITIAL_GALLERY_IMAGES;
      const idx = list.findIndex(img => img.id === image.id);
      if (idx !== -1) list[idx] = image;
      else list.unshift(image);
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO_IMAGES, JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  },

  async deletePortfolioImage(id: string, storagePath?: string): Promise<boolean> {
    if (storagePath && isSupabaseConfigured && supabase) {
      try {
        await supabase.storage.from('gallery').remove([storagePath]);
      } catch (e) {
        console.warn('Storage delete exception:', e);
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('portfolio_images').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase delete image error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO_IMAGES);
      if (stored) {
        const list: PortfolioImage[] = JSON.parse(stored);
        localStorage.setItem(STORAGE_KEYS.PORTFOLIO_IMAGES, JSON.stringify(list.filter(img => img.id !== id)));
        return true;
      }
    } catch {}
    return false;
  },

  // ---------------- SUPABASE STORAGE UPLOADS ----------------
  async uploadImageToStorage(
    file: File,
    folder: string = 'portfolio'
  ): Promise<{ success: boolean; url?: string; storagePath?: string; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      // Local Base64 fallback if offline
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          success: true,
          url: reader.result as string,
          storagePath: `local-${Date.now()}`
        });
        reader.onerror = () => resolve({ success: false, error: 'Local FileReader error' });
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${folder}/${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(filePath, file, {
          cacheControl: '31536000',
          upsert: false
        });

      if (error) {
        // Fallback to local DataURL
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            success: true,
            url: reader.result as string,
            storagePath: `fallback-${Date.now()}`
          });
          reader.readAsDataURL(file);
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(data.path);

      return {
        success: true,
        url: publicUrlData.publicUrl,
        storagePath: data.path
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Storage upload error.' };
    }
  },

  // ---------------- HOMEPAGE CONTENT ----------------
  async fetchHomepageContent(): Promise<HomepageContent> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('homepage_content').select('*').limit(1).maybeSingle();
        if (!error && data) return data as HomepageContent;
      } catch (err) {
        console.warn('Supabase homepage content fetch error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HOMEPAGE);
      return stored ? JSON.parse(stored) : INITIAL_HOMEPAGE_CONTENT;
    } catch {
      return INITIAL_HOMEPAGE_CONTENT;
    }
  },

  async updateHomepageContent(content: HomepageContent): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('homepage_content').upsert([{ ...content, updated_at: new Date().toISOString() }]);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update homepage content error:', err);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(content));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- ABOUT CONTENT ----------------
  async fetchAboutContent(): Promise<AboutContent> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('about_content').select('*').limit(1).maybeSingle();
        if (!error && data) return data as AboutContent;
      } catch (err) {
        console.warn('Supabase about content fetch error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ABOUT);
      return stored ? JSON.parse(stored) : INITIAL_ABOUT_CONTENT;
    } catch {
      return INITIAL_ABOUT_CONTENT;
    }
  },

  async updateAboutContent(content: AboutContent): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('about_content').upsert([{ ...content, updated_at: new Date().toISOString() }]);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update about content error:', err);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEYS.ABOUT, JSON.stringify(content));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- TESTIMONIALS / REVIEWS ----------------
  async fetchTestimonials(): Promise<Testimonial[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) return data as Testimonial[];
      } catch (err) {
        console.warn('Supabase testimonials fetch error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (stored) return JSON.parse(stored);
    } catch {}

    return TESTIMONIALS.map((t, idx) => ({
      id: t.id,
      client_name: t.client_name,
      event_type: t.event,
      location: t.location,
      event_date: t.date,
      rating: t.rating,
      comment: t.comment,
      is_featured: true,
      is_published: true,
      display_order: idx + 1
    }));
  },

  async saveTestimonial(testimonial: Testimonial): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('testimonials').upsert([testimonial]);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase save testimonial error:', err);
      }
    }

    try {
      const list = await this.fetchTestimonials();
      const idx = list.findIndex(t => t.id === testimonial.id);
      if (idx !== -1) list[idx] = testimonial;
      else list.push(testimonial);
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(list));
      return true;
    } catch {
      return false;
    }
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase delete testimonial error:', err);
      }
    }

    try {
      const list = await this.fetchTestimonials();
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(list.filter(t => t.id !== id)));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- WEBSITE SECTIONS ----------------
  async fetchWebsiteSections(): Promise<WebsiteSections> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('website_sections').select('*').limit(1).maybeSingle();
        if (!error && data) return data as WebsiteSections;
      } catch (err) {
        console.warn('Supabase website sections fetch error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      return stored ? JSON.parse(stored) : INITIAL_WEBSITE_SECTIONS;
    } catch {
      return INITIAL_WEBSITE_SECTIONS;
    }
  },

  async updateWebsiteSections(sections: WebsiteSections): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('website_sections').upsert([{ ...sections, updated_at: new Date().toISOString() }]);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update website sections error:', err);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- SITE SETTINGS ----------------
  async fetchSiteSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
        if (!error && data) return data as SiteSettings;
      } catch (err) {
        console.warn('Supabase site settings fetch error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : OFFICIAL_STUDIO_INFO;
    } catch {
      return OFFICIAL_STUDIO_INFO;
    }
  },
  fetchStudioSettings(): Promise<StudioSettings> {
    return this.fetchSiteSettings();
  },

  async updateSiteSettings(settings: SiteSettings): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('site_settings').upsert([{ ...settings, updated_at: new Date().toISOString() }]);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update site settings error:', err);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  },
  updateStudioSettings(settings: StudioSettings): Promise<boolean> {
    return this.updateSiteSettings(settings);
  },

  // ---------------- YOUTUBE VIDEOS ----------------
  async fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('youtube_videos')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) return data as YouTubeVideo[];
      } catch (err) {
        console.warn('Supabase youtube fetch error:', err);
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
        const { error } = await supabase.from('youtube_videos').upsert([video]);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase save youtube video error:', err);
      }
    }

    try {
      const list = await this.fetchYouTubeVideos();
      const idx = list.findIndex(v => v.id === video.id);
      if (idx !== -1) list[idx] = video;
      else list.push(video);
      localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(list));
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
        console.warn('Supabase delete youtube video error:', err);
      }
    }

    try {
      const list = await this.fetchYouTubeVideos();
      localStorage.setItem(STORAGE_KEYS.YOUTUBE, JSON.stringify(list.filter(v => v.id !== id)));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- ACTIVITY LOGS ----------------
  async logActivity(
    userId: string,
    action: string,
    entityType: string,
    entityId?: string,
    details?: any
  ): Promise<void> {
    const log: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {},
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('activity_logs').insert([log]);
      } catch {}
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      const list: ActivityLog[] = stored ? JSON.parse(stored) : [];
      list.unshift(log);
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(list.slice(0, 200)));
    } catch {}
  },

  async fetchActivityLogs(): Promise<ActivityLog[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        if (!error && data) return data as ActivityLog[];
      } catch {}
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // ---------------- AI ASSISTANT SETTINGS ----------------
  async fetchAISettings(): Promise<AISettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ai_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        if (!error && data) return data as AISettings;
      } catch {}
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AI_SETTINGS);
      return stored ? JSON.parse(stored) : INITIAL_AI_SETTINGS;
    } catch {
      return INITIAL_AI_SETTINGS;
    }
  },

  async updateAISettings(settings: AISettings): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('ai_settings')
          .upsert([{ ...settings, updated_at: new Date().toISOString() }]);
        if (!error) return true;
      } catch {}
    }

    try {
      localStorage.setItem(STORAGE_KEYS.AI_SETTINGS, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  },

  // ---------------- REALTIME SUBSCRIPTION HELPER ----------------
  subscribeToTable(table: string, onUpdate: (payload: any) => void): () => void {
    if (!isSupabaseConfigured || !supabase) {
      return () => {};
    }

    const channel = supabase
      .channel(`realtime_${table}_${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        onUpdate(payload);
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }
};
