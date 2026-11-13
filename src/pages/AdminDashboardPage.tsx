import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Image as ImageIcon,
  Layers,
  Settings,
  Youtube,
  LogOut,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudio } from '../context/StudioContext';
import { DataService } from '../lib/supabase';
import { Booking, BookingStatus, GalleryImage } from '../types/database.types';
import { StatsOverview } from '../components/admin/StatsOverview';
import { BookingManager } from '../components/admin/BookingManager';
import { GalleryManager } from '../components/admin/GalleryManager';
import { ServiceManager } from '../components/admin/ServiceManager';
import { StudioSettingsManager } from '../components/admin/StudioSettingsManager';
import { YouTubeManager } from '../components/admin/YouTubeManager';
import { Button } from '../components/ui/Button';

type ActiveTab = 'overview' | 'bookings' | 'gallery' | 'services' | 'settings' | 'youtube';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, logout } = useAuth();
  const {
    settings,
    services,
    categories,
    youtubeVideos,
    updateSettings,
    saveService,
    saveYouTubeVideo,
    deleteYouTubeVideo,
    refreshData,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdmin, authLoading, navigate]);

  // Load administrative data
  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [bData, gData] = await Promise.all([
        DataService.fetchBookings(),
        DataService.fetchGalleryImages(),
      ]);
      setBookings(bData);
      setGalleryImages(gData);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    const success = await DataService.updateBookingStatus(id, status);
    if (success) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    }
  };

  const handleDeleteBooking = async (id: string) => {
    const success = await DataService.deleteBooking(id);
    if (success) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleAddGalleryImage = async (img: Omit<GalleryImage, 'id' | 'created_at'>) => {
    const created = await DataService.addGalleryImage(img);
    setGalleryImages((prev) => [created, ...prev]);
  };

  const handleDeleteGalleryImage = async (id: string) => {
    const success = await DataService.deleteGalleryImage(id);
    if (success) {
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (authLoading || (!isAdmin && authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-studio-black text-studio-light">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Verifying Administrator Access...</span>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings' as const, label: `Enquiries (${bookings.length})`, icon: CalendarCheck },
    { id: 'gallery' as const, label: 'Gallery', icon: ImageIcon },
    { id: 'services' as const, label: 'Services', icon: Layers },
    { id: 'youtube' as const, label: 'YouTube Films', icon: Youtube },
    { id: 'settings' as const, label: 'Studio Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-studio-black text-studio-light pt-20">
      {/* Top Admin Navigation Header */}
      <div className="bg-studio-dark/95 border-b border-studio-border/70 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-cinzel text-base font-bold text-studio-light">
                  Nithya Studio Control Panel
                </span>
                <span className="hidden sm:inline-block text-[11px] text-studio-muted ml-2">
                  • {user?.email}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={loadAdminData}
                disabled={loadingData}
                className="p-2 rounded-xl bg-studio-surface border border-studio-border text-studio-muted hover:text-gold-400"
                title="Refresh Records"
              >
                <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => navigate('/')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-studio-surface border border-studio-border text-xs text-studio-light hover:text-gold-400"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <Button
                variant="dark"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                className="border-rose-500/30 text-rose-300 hover:bg-rose-950/30"
              >
                Sign Out
              </Button>
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-studio-border/40">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gold-500 text-studio-black font-semibold shadow-gold-glow-sm'
                      : 'text-studio-muted hover:text-studio-light hover:bg-studio-surface'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Admin Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <StatsOverview bookings={bookings} />

            {/* Recent Enquiries & Quick Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel text-lg font-bold text-studio-light">
                  Recent Customer Booking Requests
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-gold-400 hover:underline font-semibold"
                >
                  View All {bookings.length} Enquiries →
                </button>
              </div>

              <BookingManager
                bookings={bookings.slice(0, 5)}
                onUpdateStatus={handleUpdateBookingStatus}
                onDeleteBooking={handleDeleteBooking}
              />
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-studio-light">
                  Customer Booking Enquiries
                </h2>
                <p className="text-xs text-studio-muted">
                  Search, filter, update statuses, or reply directly to customers via WhatsApp.
                </p>
              </div>
            </div>

            <BookingManager
              bookings={bookings}
              onUpdateStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
            />
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <GalleryManager
            images={galleryImages}
            categories={categories}
            onAddImage={handleAddGalleryImage}
            onDeleteImage={handleDeleteGalleryImage}
          />
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <ServiceManager
            services={services}
            onSaveService={saveService}
          />
        )}

        {/* YOUTUBE TAB */}
        {activeTab === 'youtube' && (
          <YouTubeManager
            videos={youtubeVideos}
            onSaveVideo={saveYouTubeVideo}
            onDeleteVideo={deleteYouTubeVideo}
          />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <StudioSettingsManager
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        )}

      </main>
    </div>
  );
};
