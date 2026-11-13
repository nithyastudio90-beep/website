import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Service, GalleryCategory, StudioSettings, YouTubeVideo } from '../types/database.types';
import { DataService } from '../lib/supabase';
import { OFFICIAL_STUDIO_INFO, INITIAL_SERVICES, GALLERY_CATEGORIES, INITIAL_YOUTUBE_VIDEOS } from '../lib/constants';

interface StudioContextType {
  settings: StudioSettings;
  services: Service[];
  categories: GalleryCategory[];
  youtubeVideos: YouTubeVideo[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: StudioSettings) => Promise<boolean>;
  saveService: (service: Service) => Promise<boolean>;
  saveYouTubeVideo: (video: YouTubeVideo) => Promise<boolean>;
  deleteYouTubeVideo: (id: string) => Promise<boolean>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StudioSettings>(OFFICIAL_STUDIO_INFO);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [categories, setCategories] = useState<GalleryCategory[]>(GALLERY_CATEGORIES);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>(INITIAL_YOUTUBE_VIDEOS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAllData = useCallback(async () => {
    try {
      const [fetchedSettings, fetchedServices, fetchedCats, fetchedVideos] = await Promise.all([
        DataService.fetchStudioSettings(),
        DataService.fetchServices(),
        DataService.fetchGalleryCategories(),
        DataService.fetchYouTubeVideos(),
      ]);

      setSettings(fetchedSettings);
      setServices(fetchedServices);
      setCategories(fetchedCats);
      setYoutubeVideos(fetchedVideos);
    } catch (e) {
      console.error('Error loading studio data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const updateSettings = async (newSettings: StudioSettings): Promise<boolean> => {
    const success = await DataService.updateStudioSettings(newSettings);
    if (success) {
      setSettings(newSettings);
    }
    return success;
  };

  const saveService = async (service: Service): Promise<boolean> => {
    const success = await DataService.saveService(service);
    if (success) {
      const updated = await DataService.fetchServices();
      setServices(updated);
    }
    return success;
  };

  const saveYouTubeVideo = async (video: YouTubeVideo): Promise<boolean> => {
    const success = await DataService.saveYouTubeVideo(video);
    if (success) {
      const updated = await DataService.fetchYouTubeVideos();
      setYoutubeVideos(updated);
    }
    return success;
  };

  const deleteYouTubeVideo = async (id: string): Promise<boolean> => {
    const success = await DataService.deleteYouTubeVideo(id);
    if (success) {
      setYoutubeVideos((prev) => prev.filter((v) => v.id !== id));
    }
    return success;
  };

  return (
    <StudioContext.Provider
      value={{
        settings,
        services,
        categories,
        youtubeVideos,
        isLoading,
        refreshData: loadAllData,
        updateSettings,
        saveService,
        saveYouTubeVideo,
        deleteYouTubeVideo,
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
