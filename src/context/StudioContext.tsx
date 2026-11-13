import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Service,
  PortfolioCategory,
  PortfolioImage,
  GalleryCategory,
  GalleryImage,
  SiteSettings,
  StudioSettings,
  YouTubeVideo,
  HomepageContent,
  AboutContent,
  WebsiteSections,
  Testimonial,
  Customer,
  CalendarEvent,
  ActivityLog,
  AISettings,
  Booking
} from '../types/database.types';
import { DataService } from '../lib/supabase';
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
} from '../lib/constants';

interface StudioContextType {
  settings: SiteSettings;
  homepage: HomepageContent;
  about: AboutContent;
  sections: WebsiteSections;
  services: Service[];
  categories: PortfolioCategory[];
  portfolioImages: PortfolioImage[];
  testimonials: Testimonial[];
  youtubeVideos: YouTubeVideo[];
  customers: Customer[];
  bookings: Booking[];
  calendarEvents: CalendarEvent[];
  activityLogs: ActivityLog[];
  aiSettings: AISettings;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: SiteSettings) => Promise<boolean>;
  updateHomepage: (content: HomepageContent) => Promise<boolean>;
  updateAbout: (content: AboutContent) => Promise<boolean>;
  updateSections: (sections: WebsiteSections) => Promise<boolean>;
  saveService: (service: Service) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  saveCategory: (category: PortfolioCategory) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  savePortfolioImage: (image: PortfolioImage) => Promise<boolean>;
  deletePortfolioImage: (id: string, storagePath?: string) => Promise<boolean>;
  saveTestimonial: (t: Testimonial) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  saveYouTubeVideo: (video: YouTubeVideo) => Promise<boolean>;
  deleteYouTubeVideo: (id: string) => Promise<boolean>;
  updateCustomer: (customer: Customer) => Promise<boolean>;
  updateAISettings: (settings: AISettings) => Promise<boolean>;
  confirmBooking: (bookingId: string, adminId?: string) => Promise<{ success: boolean; error?: string }>;
  rejectBooking: (bookingId: string, reason: string, adminId?: string) => Promise<{ success: boolean; error?: string }>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(OFFICIAL_STUDIO_INFO);
  const [homepage, setHomepage] = useState<HomepageContent>(INITIAL_HOMEPAGE_CONTENT);
  const [about, setAbout] = useState<AboutContent>(INITIAL_ABOUT_CONTENT);
  const [sections, setSections] = useState<WebsiteSections>(INITIAL_WEBSITE_SECTIONS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [categories, setCategories] = useState<PortfolioCategory[]>(GALLERY_CATEGORIES);
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>(INITIAL_GALLERY_IMAGES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>(INITIAL_YOUTUBE_VIDEOS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [aiSettings, setAiSettings] = useState<AISettings>(INITIAL_AI_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAllData = useCallback(async () => {
    try {
      const [
        fetchedSettings,
        fetchedHome,
        fetchedAbout,
        fetchedSections,
        fetchedServices,
        fetchedCats,
        fetchedImgs,
        fetchedTestimonials,
        fetchedVideos,
        fetchedCustomers,
        fetchedBookings,
        fetchedCalEvents,
        fetchedLogs,
        fetchedAI
      ] = await Promise.all([
        DataService.fetchSiteSettings(),
        DataService.fetchHomepageContent(),
        DataService.fetchAboutContent(),
        DataService.fetchWebsiteSections(),
        DataService.fetchServices(),
        DataService.fetchPortfolioCategories(),
        DataService.fetchPortfolioImages(),
        DataService.fetchTestimonials(),
        DataService.fetchYouTubeVideos(),
        DataService.fetchCustomers(),
        DataService.fetchBookings(),
        DataService.fetchCalendarEvents(),
        DataService.fetchActivityLogs(),
        DataService.fetchAISettings()
      ]);

      setSettings(fetchedSettings);
      setHomepage(fetchedHome);
      setAbout(fetchedAbout);
      setSections(fetchedSections);
      setServices(fetchedServices);
      setCategories(fetchedCats);
      setPortfolioImages(fetchedImgs);
      setTestimonials(fetchedTestimonials);
      setYoutubeVideos(fetchedVideos);
      setCustomers(fetchedCustomers);
      setBookings(fetchedBookings);
      setCalendarEvents(fetchedCalEvents);
      setActivityLogs(fetchedLogs);
      setAiSettings(fetchedAI);
    } catch (e) {
      console.error('Failed to load studio data from Supabase/Local:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();

    // Setup Realtime subscriptions
    const unsubBookings = DataService.subscribeToTable('bookings', () => {
      DataService.fetchBookings().then(setBookings);
      DataService.fetchCalendarEvents().then(setCalendarEvents);
      DataService.fetchCustomers().then(setCustomers);
      DataService.fetchActivityLogs().then(setActivityLogs);
    });

    const unsubServices = DataService.subscribeToTable('services', () => {
      DataService.fetchServices().then(setServices);
    });

    const unsubPortfolio = DataService.subscribeToTable('portfolio_images', () => {
      DataService.fetchPortfolioImages().then(setPortfolioImages);
    });

    return () => {
      unsubBookings();
      unsubServices();
      unsubPortfolio();
    };
  }, [loadAllData]);

  const updateSettings = async (newSettings: SiteSettings): Promise<boolean> => {
    const success = await DataService.updateSiteSettings(newSettings);
    if (success) {
      setSettings(newSettings);
      await DataService.logActivity('admin', 'UPDATE_SETTINGS', 'site_settings', newSettings.id);
    }
    return success;
  };

  const updateHomepage = async (content: HomepageContent): Promise<boolean> => {
    const success = await DataService.updateHomepageContent(content);
    if (success) {
      setHomepage(content);
      await DataService.logActivity('admin', 'UPDATE_HOMEPAGE', 'homepage_content', content.id);
    }
    return success;
  };

  const updateAbout = async (content: AboutContent): Promise<boolean> => {
    const success = await DataService.updateAboutContent(content);
    if (success) {
      setAbout(content);
      await DataService.logActivity('admin', 'UPDATE_ABOUT', 'about_content', content.id);
    }
    return success;
  };

  const updateSections = async (newSections: WebsiteSections): Promise<boolean> => {
    const success = await DataService.updateWebsiteSections(newSections);
    if (success) {
      setSections(newSections);
      await DataService.logActivity('admin', 'UPDATE_SECTIONS', 'website_sections', newSections.id);
    }
    return success;
  };

  const saveService = async (service: Service): Promise<boolean> => {
    const success = await DataService.saveService(service);
    if (success) {
      setServices((prev) => {
        const idx = prev.findIndex((s) => s.id === service.id || s.slug === service.slug);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = service;
          return updated;
        }
        return [...prev, service];
      });
      await DataService.logActivity('admin', 'SAVE_SERVICE', 'service', service.id, { title: service.title });
    }
    return success;
  };

  const deleteService = async (id: string): Promise<boolean> => {
    const success = await DataService.deleteService(id);
    if (success) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      await DataService.logActivity('admin', 'DELETE_SERVICE', 'service', id);
    }
    return success;
  };

  const saveCategory = async (cat: PortfolioCategory): Promise<boolean> => {
    const success = await DataService.savePortfolioCategory(cat);
    if (success) {
      setCategories((prev) => {
        const idx = prev.findIndex((c) => c.id === cat.id || c.slug === cat.slug);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = cat;
          return updated;
        }
        return [...prev, cat];
      });
      await DataService.logActivity('admin', 'SAVE_CATEGORY', 'category', cat.id, { name: cat.name });
    }
    return success;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    const success = await DataService.deletePortfolioCategory(id);
    if (success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      await DataService.logActivity('admin', 'DELETE_CATEGORY', 'category', id);
    }
    return success;
  };

  const savePortfolioImage = async (img: PortfolioImage): Promise<boolean> => {
    const success = await DataService.savePortfolioImage(img);
    if (success) {
      setPortfolioImages((prev) => {
        const idx = prev.findIndex((i) => i.id === img.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = img;
          return updated;
        }
        return [img, ...prev];
      });
      await DataService.logActivity('admin', 'SAVE_IMAGE', 'portfolio_image', img.id, { title: img.title });
    }
    return success;
  };

  const deletePortfolioImage = async (id: string, storagePath?: string): Promise<boolean> => {
    const success = await DataService.deletePortfolioImage(id, storagePath);
    if (success) {
      setPortfolioImages((prev) => prev.filter((i) => i.id !== id));
      await DataService.logActivity('admin', 'DELETE_IMAGE', 'portfolio_image', id);
    }
    return success;
  };

  const saveTestimonial = async (t: Testimonial): Promise<boolean> => {
    const success = await DataService.saveTestimonial(t);
    if (success) {
      setTestimonials((prev) => {
        const idx = prev.findIndex((item) => item.id === t.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = t;
          return updated;
        }
        return [...prev, t];
      });
      await DataService.logActivity('admin', 'SAVE_TESTIMONIAL', 'testimonial', t.id, { client: t.client_name });
    }
    return success;
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    const success = await DataService.deleteTestimonial(id);
    if (success) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      await DataService.logActivity('admin', 'DELETE_TESTIMONIAL', 'testimonial', id);
    }
    return success;
  };

  const saveYouTubeVideo = async (video: YouTubeVideo): Promise<boolean> => {
    const success = await DataService.saveYouTubeVideo(video);
    if (success) {
      setYoutubeVideos((prev) => {
        const idx = prev.findIndex((v) => v.id === video.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = video;
          return updated;
        }
        return [...prev, video];
      });
      await DataService.logActivity('admin', 'SAVE_VIDEO', 'youtube_video', video.id, { title: video.title });
    }
    return success;
  };

  const deleteYouTubeVideo = async (id: string): Promise<boolean> => {
    const success = await DataService.deleteYouTubeVideo(id);
    if (success) {
      setYoutubeVideos((prev) => prev.filter((v) => v.id !== id));
      await DataService.logActivity('admin', 'DELETE_VIDEO', 'youtube_video', id);
    }
    return success;
  };

  const updateCustomer = async (cust: Customer): Promise<boolean> => {
    const success = await DataService.updateCustomer(cust);
    if (success) {
      setCustomers((prev) => {
        const idx = prev.findIndex((c) => c.id === cust.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = cust;
          return updated;
        }
        return [cust, ...prev];
      });
      await DataService.logActivity('admin', 'UPDATE_CUSTOMER', 'customer', cust.id, { name: cust.name });
    }
    return success;
  };

  const updateAISettings = async (newAi: AISettings): Promise<boolean> => {
    const success = await DataService.updateAISettings(newAi);
    if (success) {
      setAiSettings(newAi);
      await DataService.logActivity('admin', 'UPDATE_AI_SETTINGS', 'ai_settings', newAi.id);
    }
    return success;
  };

  const confirmBooking = async (bookingId: string, adminId: string = 'admin') => {
    const res = await DataService.confirmBooking(bookingId, adminId);
    if (res.success) {
      DataService.fetchCalendarEvents().then(setCalendarEvents);
      DataService.fetchCustomers().then(setCustomers);
      DataService.fetchActivityLogs().then(setActivityLogs);
    }
    return res;
  };

  const rejectBooking = async (bookingId: string, reason: string, adminId: string = 'admin') => {
    const res = await DataService.rejectBooking(bookingId, reason, adminId);
    if (res.success) {
      DataService.fetchCalendarEvents().then(setCalendarEvents);
      DataService.fetchCustomers().then(setCustomers);
      DataService.fetchActivityLogs().then(setActivityLogs);
    }
    return res;
  };

  return (
    <StudioContext.Provider
      value={{
        settings,
        homepage,
        about,
        sections,
        services,
        categories,
        portfolioImages,
        testimonials,
        youtubeVideos,
        customers,
        bookings,
        calendarEvents,
        activityLogs,
        aiSettings,
        isLoading,
        refreshData: loadAllData,
        updateSettings,
        updateHomepage,
        updateAbout,
        updateSections,
        saveService,
        deleteService,
        saveCategory,
        deleteCategory,
        savePortfolioImage,
        deletePortfolioImage,
        saveTestimonial,
        deleteTestimonial,
        saveYouTubeVideo,
        deleteYouTubeVideo,
        updateCustomer,
        updateAISettings,
        confirmBooking,
        rejectBooking,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
